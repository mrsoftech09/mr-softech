import Client from '../models/Client.js';
import { clientSchema } from '../validators/client.js';
import { audit } from '../services/audit.js';
import { serviceStatus } from '../utils/expiry.js';

const ALLOWED_SORT_FIELDS = new Set([
  'nodeName',
  'ipAddress',
  'dataCenter',
  'billTo',
  'serviceTo',
  'numberOfUsers',
  'expiryDate',
  'createdAt'
]);

function escapeRegex(text) {
  return String(text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function filterFor(q) {
  const f = { isDeleted: false };

  if (q.search && typeof q.search === 'string') {
    const escaped = escapeRegex(q.search.trim());
    if (escaped) {
      f.$or = [
        { nodeName: { $regex: escaped, $options: 'i' } },
        { ipAddress: { $regex: escaped, $options: 'i' } }
      ];
    }
  }

  if (q.dataCenter && typeof q.dataCenter === 'string') {
    f.dataCenter = q.dataCenter;
  }

  if (q.status && typeof q.status === 'string') {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (q.status === 'EXPIRED') {
      f.expiryDate = { $lt: now };
    } else if (q.status === 'EXPIRING_SOON') {
      f.expiryDate = { $gte: now, $lte: thirtyDays };
    } else if (q.status === 'ACTIVE') {
      f.expiryDate = { $gt: thirtyDays };
    }
  }

  return f;
}

export async function users(req, res) {
  const rows = await Client.find({ isDeleted: false })
    .select('nodeName users numberOfUsers expiryDate')
    .lean();

  const data = rows.flatMap(c => {
    const saved = Array.isArray(c.users) && c.users.length
      ? c.users
      : Array.from({ length: c.numberOfUsers || 0 }, (_, i) => ({
          name: `${c.nodeName} User ${i + 1}`,
          email: `user${i + 1}@${String(c.nodeName).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.example.com`
        }));

    return saved.map(u => ({
      ...u,
      client: c.nodeName,
      status: serviceStatus(c.expiryDate)
    }));
  });

  res.json({ data });
}

export async function list(req, res) {
  const page = Math.max(1, +req.query.page || 1);
  const limit = Math.min(100, Math.max(5, +req.query.limit || 20));
  const f = filterFor(req.query);

  const sortField = ALLOWED_SORT_FIELDS.has(req.query.sort) ? req.query.sort : 'expiryDate';
  const sortOrder = req.query.order === 'desc' ? -1 : 1;

  const [rows, total] = await Promise.all([
    Client.find(f)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Client.countDocuments(f)
  ]);

  res.json({
    data: rows.map(x => ({ ...x, status: serviceStatus(x.expiryDate) })),
    meta: { page, limit, total }
  });
}

export async function get(req, res) {
  const row = await Client.findOne({ _id: req.params.id, isDeleted: false });
  if (!row) return res.status(404).json({ error: { message: 'Client not found' } });
  res.json({ data: { ...row.toObject(), status: serviceStatus(row.expiryDate) } });
}

export async function create(req, res) {
  const data = clientSchema.parse(req.body);
  const row = await Client.create({
    ...data,
    ftpLink: data.ftpLink || null,
    createdBy: req.user._id,
    updatedBy: req.user._id
  });
  await audit('CLIENT_CREATED', req, row._id, { nodeName: row.nodeName });
  res.status(201).json({ data: row });
}

export async function update(req, res) {
  const data = clientSchema.partial().parse(req.body);
  const row = await Client.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { ...data, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!row) return res.status(404).json({ error: { message: 'Client not found' } });
  await audit('CLIENT_EDITED', req, row._id, { nodeName: row.nodeName });
  res.json({ data: row });
}

export async function remove(req, res) {
  const row = await Client.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date(), deletedBy: req.user._id },
    { new: true }
  );
  if (!row) return res.status(404).json({ error: { message: 'Client not found' } });
  await audit('CLIENT_DELETED', req, row._id, { nodeName: row.nodeName });
  res.status(204).end();
}

export async function restore(req, res) {
  const row = await Client.findOneAndUpdate(
    { _id: req.params.id, isDeleted: true },
    { isDeleted: false, deletedAt: null, deletedBy: null, updatedBy: req.user._id },
    { new: true }
  );
  if (!row) return res.status(404).json({ error: { message: 'Client not found' } });
  await audit('CLIENT_RESTORED', req, row._id);
  res.json({ data: row });
}

export async function bulkCreate(req, res) {
  const rows = Array.isArray(req.body?.clients) ? req.body.clients : req.body;
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > 1000) {
    return res.status(400).json({ error: { message: 'Provide between 1 and 1000 clients' } });
  }

  const parsed = [], invalid = [];
  for (let i = 0; i < rows.length; i++) {
    const result = clientSchema.safeParse(rows[i]);
    if (!result.success) {
      invalid.push({
        row: i + 1,
        fields: result.error.issues.map(x => ({ field: x.path.join('.'), message: x.message }))
      });
    } else {
      parsed.push(result.data);
    }
  }

  if (invalid.length) {
    return res.status(400).json({
      error: { message: `${invalid.length} invalid row(s) found`, details: invalid.slice(0, 20) }
    });
  }

  try {
    const docs = await Client.insertMany(
      parsed.map(data => ({
        ...data,
        ftpLink: data.ftpLink || null,
        createdBy: req.user._id,
        updatedBy: req.user._id
      })),
      { ordered: true }
    );
    await audit('CLIENT_BULK_IMPORTED', req, null, { count: docs.length });
    res.status(201).json({ data: { inserted: docs.length } });
  } catch (err) {
    res.status(400).json({
      error: {
        message: 'Import could not be inserted',
        details: err.code === 11000 ? 'Duplicate record detected' : undefined
      }
    });
  }
}

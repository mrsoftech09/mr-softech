import AuditLog from '../models/AuditLog.js';
import { audit } from '../services/audit.js';

export async function listLogs(req, res) {
  const page = Math.max(1, +req.query.page || 1);
  const limit = Math.min(100, +req.query.limit || 25);
  
  const [data, total] = await Promise.all([
    AuditLog.find()
      .populate('actor', 'email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments()
  ]);

  res.json({
    data,
    meta: { page, limit, total }
  });
}

export async function logExport(req, res) {
  await audit('EXPORT', req, null, {
    format: req.body?.format || 'unknown'
  });
  
  res.status(204).end();
}
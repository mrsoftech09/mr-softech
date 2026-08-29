import Client from '../models/Client.js';
import { serviceStatus } from '../utils/expiry.js';

export async function summary(req, res) {
  const rows = await Client.find({ isDeleted: false }).lean();
  
  const statuses = rows.map(r => serviceStatus(r.expiryDate));
  
  const active = statuses.filter(x => x === 'ACTIVE').length;
  const soon = statuses.filter(x => x === 'EXPIRING_SOON').length;
  const expired = statuses.filter(x => x === 'EXPIRED').length;

  const dataCenters = Object.entries(
    rows.reduce((a, r) => (a[r.dataCenter] = (a[r.dataCenter] || 0) + 1, a), {})
  ).map(([name, value]) => ({ name, value }));

  const byService = Object.entries(
    rows.reduce((a, r) => (a[r.serviceTo] = (a[r.serviceTo] || 0) + r.numberOfUsers, a), {})
  ).map(([name, value]) => ({ name, value }));

  res.json({
    data: {
      totalNodes: rows.length,
      totalUsers: rows.reduce((s, r) => s + r.numberOfUsers, 0),
      activeServices: active,
      renewalHealth: rows.length ? Math.round(active / rows.length * 100) : 100,
      expiringSoon: soon,
      expiredNodes: expired,
      distribution: [
        { name: 'Active', value: active },
        { name: 'Expiring soon', value: soon },
        { name: 'Expired', value: expired }
      ],
      dataCenters,
      byService
    }
  });
}
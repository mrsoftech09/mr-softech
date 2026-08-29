import { Router } from 'express';
import { z } from 'zod';
import { login, logout, me } from '../controllers/auth.js';
import * as clients from '../controllers/clients.js';
import { summary } from '../controllers/dashboard.js';
import { listLogs, logExport } from '../controllers/audit.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { dbHealthy } from '../config/db.js';

const r = Router();

const body = s => (req, res, next) => {
  req.body = s.parse(req.body);
  next();
};

const creds = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(256)
});

r.post('/auth/login', body(creds), login);
r.post('/auth/logout', requireAuth, logout);
r.get('/auth/me', requireAuth, me);

r.get('/health', (req, res) => 
  res.status(dbHealthy() ? 200 : 503).json({
    data: {
      api: 'ok',
      database: dbHealthy() ? 'connected' : 'unavailable'
    }
  })
);

r.get('/dashboard/summary', requireAuth, summary);
r.get('/clients', requireAuth, clients.list);
r.get('/clients/users', requireAuth, clients.users);
r.get('/clients/:id', requireAuth, clients.get);
r.post('/clients', requireAuth, clients.create);
r.post('/clients/bulk', requireAuth, clients.bulkCreate);
r.patch('/clients/:id', requireAuth, clients.update);
r.delete('/clients/:id', requireAuth, requireAdmin, clients.remove);
r.post('/clients/:id/restore', requireAuth, requireAdmin, clients.restore);

r.get('/audit-logs', requireAuth, requireAdmin, listLogs);
r.post('/audit-logs/export', requireAuth, logExport);

export default r;
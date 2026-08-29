import crypto from 'crypto';
import Session from '../models/Session.js';
import { env } from '../config/env.js';
export const hashToken = t => crypto.createHash('sha256').update(t).digest('hex');
export async function requireAuth(req, res, next) {
  try {
    const raw = req.cookies?.mr_session;
    if (!raw) {
      return res.status(401).json({ error: { message: 'Authentication required' } });
    }
    const session = await Session.findOne({
      token: hashToken(raw),
      expiresAt: { $gt: new Date() }
    }).populate('user');
    if (!session) {
      return res.status(401).json({ error: { message: 'Session expired' } });
    }
    req.user = session.user;
    req.session = session;
    next();
  } catch (e) {
    next(e);
  }
}
export const requireAdmin = (req, res, next) => 
  req.user?.role === 'admin' 
    ? next() 
    : res.status(403).json({ error: { message: 'Admin access required' } });
export function sessionCookie(res, token) {
  res.cookie('mr_session', token, {
    httpOnly: true,
    secure: env.production || env.cookieSecure,
    sameSite: env.production ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 12,
    path: '/api'
  });
}
import argon2 from 'argon2';
import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { hashToken, sessionCookie } from '../middleware/auth.js';
import { audit } from '../services/audit.js';

export const MAX_CONCURRENT_SESSIONS = 5;

// Pre-computed dummy argon2 hash to mitigate timing-based user enumeration attacks
const DUMMY_HASH = await argon2.hash('__timing_safe_placeholder__');

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash');

  const hashToVerify = (user && user.passwordHash) ? user.passwordHash : DUMMY_HASH;
  let passwordMatch = false;

  try {
    passwordMatch = await argon2.verify(hashToVerify, password);
  } catch {
    passwordMatch = false;
  }

  if (!user || user.isLocked() || !passwordMatch) {
    if (user) {
      user.failedLogins = (user.failedLogins || 0) + 1;
      if (user.failedLogins >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60e3);
        user.failedLogins = 0;
      }
      await user.save();
    }
    return res.status(401).json({ error: { message: 'Invalid credentials' } });
  }

  // Check active concurrent sessions for this user
  const activeSessionsCount = await Session.countDocuments({
    user: user._id,
    expiresAt: { $gt: new Date() }
  });

  if (activeSessionsCount >= MAX_CONCURRENT_SESSIONS) {
    await audit('LOGIN_SESSION_LIMIT_EXCEEDED', { ...req, user }, null, {
      activeSessions: activeSessionsCount,
      limit: MAX_CONCURRENT_SESSIONS
    });
    return res.status(403).json({
      error: {
        code: 'SESSION_LIMIT_EXCEEDED',
        message: `Maximum ${MAX_CONCURRENT_SESSIONS} devices are allowed to use this account simultaneously. Please log out from another device first.`
      }
    });
  }

  user.failedLogins = 0;
  user.lockUntil = null;
  await user.save();

  const raw = crypto.randomBytes(48).toString('base64url');
  await Session.create({
    token: hashToken(raw),
    user: user._id,
    userAgent: req.get('user-agent') || null,
    ip: req.ip || null,
    expiresAt: new Date(Date.now() + 12 * 3600e3)
  });

  sessionCookie(res, raw);
  await audit('LOGIN', { ...req, user });

  res.json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }
  });
}

export async function logout(req, res) {
  if (req.session) await req.session.deleteOne();
  res.clearCookie('mr_session', { path: '/api' });
  await audit('LOGOUT', req);
  res.status(204).end();
}

export const me = (req, res) =>
  res.json({
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    }
  });

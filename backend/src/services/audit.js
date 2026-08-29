import AuditLog from '../models/AuditLog.js';

export const audit = (action, req, target = null, meta = {}) => 
  AuditLog.create({
    action,
    actor: req.user?._id,
    target,
    meta,
    ip: req.ip
  }).catch(() => {});
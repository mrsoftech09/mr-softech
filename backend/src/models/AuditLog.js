import mongoose from 'mongoose';

export default mongoose.model('AuditLog', new mongoose.Schema({
  action: { type: String, required: true, index: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  target: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: String
}, { timestamps: true }));
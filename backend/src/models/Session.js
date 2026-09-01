import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userAgent: { type: String, default: null },
  ip: { type: String, default: null },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

sessionSchema.index({ user: 1, expiresAt: 1 });

export default mongoose.model('Session', sessionSchema);
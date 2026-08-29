import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  failedLogins: { type: Number, default: 0 },
  lockUntil: Date
}, { timestamps: true });

schema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > new Date();
};

export default mongoose.model('User', schema);
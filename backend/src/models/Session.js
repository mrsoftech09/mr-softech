import mongoose from 'mongoose';

export default mongoose.model('Session', new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true }));
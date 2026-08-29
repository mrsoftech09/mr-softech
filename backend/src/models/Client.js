import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true }
}, { _id: false });

const schema = new mongoose.Schema({
  nodeName: { type: String, required: true, trim: true, index: true },
  ipAddress: { type: String, required: true, trim: true, index: true },
  dataCenter: { type: String, required: true, trim: true, index: true },
  billTo: { type: String, required: true, trim: true, index: true },
  serviceTo: { type: String, required: true, trim: true },
  numberOfUsers: { type: Number, required: true, min: 0 },
  users: { type: [userSchema], default: [] },
  expiryDate: { type: Date, required: true, index: true },
  billFrom: { type: mongoose.Schema.Types.Mixed, required: true },
  ftpLink: { type: String, default: null, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

schema.index({ isDeleted: 1, expiryDate: 1 });
schema.index({ nodeName: 'text', ipAddress: 'text' });

export default mongoose.model('Client', schema);
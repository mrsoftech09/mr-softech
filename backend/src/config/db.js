import mongoose from 'mongoose';
import { env } from './env.js';
export async function connectDb(){ await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 }); }
export const dbHealthy = () => mongoose.connection.readyState === 1;

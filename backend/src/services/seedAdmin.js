import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import dotenv from 'dotenv';
dotenv.config();

import argon2 from 'argon2';
import User from '../models/User.js';
import { connectDb } from '../config/db.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD');

await connectDb();

await User.findOneAndUpdate(
  { email: email.toLowerCase() },
  {
    email: email.toLowerCase(),
    passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
    role: 'admin',
  },
  { upsert: true }
);

console.log('Admin seeded');
process.exit(0);
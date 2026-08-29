import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

connectDb()
  .then(() => app.listen(env.port, () => console.log(`MR SOFTECH API listening on ${env.port}`)))
  .catch(e => {
    console.error('Database connection failed');
    process.exit(1);
  });
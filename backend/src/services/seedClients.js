import 'dotenv/config';
import mongoose from 'mongoose';
import Client from '../models/Client.js';

const uri = process.env.MONGODB_URI;
const days = n => new Date(Date.now() + n * 864e5);

const companies = [
  ['Mahindra-Node', '10.20.1.10', 'AWS', 42, -180],
  ['Tata-Cap-01', '10.20.2.21', 'Azure', 28, 12],
  ['Reliance-RT', '172.16.4.8', 'GCP', 56, 240],
  ['Infosys-BPM', '192.168.10.14', 'On-Premise', 18, -8],
  ['HDFC-Ergo-02', '10.50.8.33', 'AWS', 35, 95],
  ['ICICI-Tech', '172.20.6.19', 'Azure', 12, 22],
  ['Wipro-Cloud-01', '192.168.25.40', 'GCP', 60, -35],
  ['Larsen-Toubro', '10.60.3.77', 'On-Premise', 24, 16],
  ['Bajaj-Finserv', '172.30.9.12', 'AWS', 8, -20],
  ['Adani-Systems', '192.168.40.55', 'Azure', 31, 365]
];

const records = companies.map(([nodeName, ipAddress, dataCenter, numberOfUsers, expiryOffset]) => ({
  nodeName: `DEMO-${nodeName}`,
  ipAddress,
  dataCenter,
  billTo: `${nodeName.replace(/-\d+$/, '')} India Ltd.`,
  serviceTo: `${nodeName} Managed Services`,
  numberOfUsers,
  users: Array.from({ length: numberOfUsers }, (_, i) => ({
    name: `${nodeName} User ${i + 1}`,
    email: `demo${i + 1}@${nodeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.example.com`
  })),
  expiryDate: days(expiryOffset),
  billFrom: 'MR SOFTECH',
  ftpLink: `ftp://demo.mrsoftech.in/${nodeName.toLowerCase()}`,
  isDeleted: false
}));

async function run() {
  if (!uri) throw new Error('MONGODB_URI is required');
  
  await mongoose.connect(uri);
  await Client.deleteMany({ nodeName: /^DEMO-/ });
  await Client.insertMany(records);
  
  console.log(`Seeded ${records.length} demo clients (${records.reduce((n, c) => n + c.numberOfUsers, 0)} users).`);
  await mongoose.disconnect();
}

run().catch(async e => {
  console.error(e.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
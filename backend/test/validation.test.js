import test from 'node:test';
import assert from 'node:assert/strict';
import { clientSchema } from '../src/validators/client.js';

const valid = {
  nodeName: 'node-a',
  ipAddress: '2001:db8::1',
  dataCenter: 'AWS',
  billTo: 'Acme',
  serviceTo: 'Platform',
  numberOfUsers: 0,
  expiryDate: '2027-01-01',
  billFrom: '2026-01-01',
  ftpLink: 'ftps://example.com/file'
};

test('validates IPv6 and secure FTP links', () => 
  assert.equal(clientSchema.parse(valid).ipAddress, valid.ipAddress)
);

test('rejects invalid addresses and unsafe URL schemes', () => {
  assert.throws(() => clientSchema.parse({ ...valid, ipAddress: 'not-an-ip' }));
  assert.throws(() => clientSchema.parse({ ...valid, ftpLink: 'https://example.com' }));
});
import test from 'node:test';
import assert from 'node:assert/strict';
import { serviceStatus, daysUntil } from '../src/utils/expiry.js';

const now = new Date('2026-01-01T00:00:00Z');

test('expiry classification uses the defined boundaries', () => {
  assert.equal(serviceStatus('2026-02-02T00:00:00Z', now), 'ACTIVE');
  assert.equal(serviceStatus('2026-01-31T00:00:00Z', now), 'EXPIRING_SOON');
  assert.equal(serviceStatus('2025-12-31T00:00:00Z', now), 'EXPIRED');
});

test('days until expiry is calendar-day based', () => 
  assert.equal(daysUntil('2026-01-11T00:00:00Z', now), 10)
);
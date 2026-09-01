import test from 'node:test';
import assert from 'node:assert/strict';
import { filterFor } from '../src/controllers/clients.js';
import { requireApiKey } from '../src/middleware/apiKey.js';
import { MAX_CONCURRENT_SESSIONS } from '../src/controllers/auth.js';

test('concurrent session limit is set to 5', () => {
  assert.equal(MAX_CONCURRENT_SESSIONS, 5);
});

test('filterFor properly escapes regex special characters to prevent ReDoS', () => {
  const dangerousQuery = { search: '.*+?^${}()|[]\\' };
  const filter = filterFor(dangerousQuery);
  
  assert.equal(filter.isDeleted, false);
  assert.ok(Array.isArray(filter.$or));
  assert.equal(filter.$or.length, 2);
  
  // Verify that the regex string has escaped characters
  const regexPattern = filter.$or[0].nodeName.$regex;
  assert.equal(regexPattern, '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
});

test('filterFor builds correct MongoDB query filters for statuses', () => {
  const expiredFilter = filterFor({ status: 'EXPIRED' });
  assert.ok(expiredFilter.expiryDate.$lt instanceof Date);

  const soonFilter = filterFor({ status: 'EXPIRING_SOON' });
  assert.ok(soonFilter.expiryDate.$gte instanceof Date);
  assert.ok(soonFilter.expiryDate.$lte instanceof Date);

  const activeFilter = filterFor({ status: 'ACTIVE' });
  assert.ok(activeFilter.expiryDate.$gt instanceof Date);
});

test('requireApiKey rejects mismatched or empty keys securely', () => {
  process.env.API_KEY = 'correct_secret_key_12345';

  const mockRes = () => {
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      }
    };
    return res;
  };

  // Case 1: Wrong key
  const reqWrong = { get: () => 'wrong_secret_key_12345' };
  const resWrong = mockRes();
  let nextCalled = false;
  requireApiKey(reqWrong, resWrong, () => { nextCalled = true; });
  assert.equal(resWrong.statusCode, 401);
  assert.equal(nextCalled, false);

  // Case 2: Missing key
  const reqMissing = { get: () => null };
  const resMissing = mockRes();
  requireApiKey(reqMissing, resMissing, () => { nextCalled = true; });
  assert.equal(resMissing.statusCode, 401);

  // Case 3: Correct key
  const reqCorrect = { get: () => 'correct_secret_key_12345' };
  const resCorrect = mockRes();
  let nextCalledCorrect = false;
  requireApiKey(reqCorrect, resCorrect, () => { nextCalledCorrect = true; });
  assert.equal(nextCalledCorrect, true);
});

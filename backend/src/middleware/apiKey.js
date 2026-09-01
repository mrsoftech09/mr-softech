import crypto from 'crypto';

export function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  const provided = req.get('x-api-key');

  if (!expected || !provided) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

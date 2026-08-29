# MR SOFTECH

Private client infrastructure and service-management dashboard. It includes cookie-based role authentication, client lifecycle management, expiry monitoring, audit trails, dashboard analytics, and CSV/XLSX export.

## Local development

1. Copy `backend/.env.example` to `backend/.env` and set a strong `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Start MongoDB locally (or set `MONGODB_URI` to an Atlas connection string).
4. Install and run:

```bash
cd backend && npm install && npm run seed:admin && npm run dev
cd frontend && npm install && npm run dev
```

Visit `http://localhost:5173`; log in using the seeded admin account. No public registration exists.

## Production

Set `NODE_ENV=production`, `COOKIE_SECURE=true`, a long unique `SESSION_SECRET`, correct `CORS_ORIGIN`, and a MongoDB Atlas URI. Run `npm run build` in `frontend`, serve `frontend/dist` through Nginx, and proxy `/api` to the PM2-managed backend (`pm2 start ecosystem.config.js --env production`). Terminate TLS at Nginx before using secure cookies. Atlas network access must permit the VPS IP.

## Security notes

Passwords are Argon2id hashes; sessions are opaque, hashed database records sent only by HTTP-only SameSite cookies. Login lockout, rate limiting, Helmet, CORS allow-listing, request-size limits, validation, soft deletion, and redacted request logging are enabled.

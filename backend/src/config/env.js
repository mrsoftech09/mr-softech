import 'dotenv/config';
const required = ['MONGODB_URI','SESSION_SECRET'];
if (process.env.NODE_ENV === 'production') required.forEach(k => { if (!process.env[k]) throw new Error(`Missing ${k}`); });
export const env = { port:Number(process.env.PORT || 5000), mongoUri:process.env.MONGODB_URI, sessionSecret:process.env.SESSION_SECRET || 'development-only-change-me', corsOrigin:process.env.CORS_ORIGIN || 'http://localhost:5173', production:process.env.NODE_ENV === 'production', cookieSecure:process.env.COOKIE_SECURE === 'true', timezone:process.env.TIMEZONE || 'UTC' };

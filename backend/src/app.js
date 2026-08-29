import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import pinoHttp from 'pino-http';
import routes from './routes/index.js';
import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/error.js';
import { requireApiKey } from './middleware/apiKey.js';

const app = express();

app.set('trust proxy', 1);

app.use(pinoHttp({
  redact: ['req.headers.cookie', 'req.body.password']
}));

app.use(helmet());

app.use(cors({
  origin: env.corsOrigin.split(','),
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60e3,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
}));

app.use('/api', 
  requireApiKey, 
  rateLimit({
    windowMs: 15 * 60e3,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
  }), 
  routes
);

app.use(notFound);
app.use(errorHandler);

export default app;


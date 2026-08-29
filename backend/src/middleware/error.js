import { ZodError } from 'zod';
import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ error: { message: 'Route not found' } });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || (err instanceof ZodError ? 400 : 500);
  
  if (!env.production) {
    console.error(err);
  }

  res.status(status).json({
    error: {
      message: err instanceof ZodError 
        ? 'Validation failed' 
        : status === 500 
          ? 'Internal server error' 
          : err.message,
      details: err instanceof ZodError ? err.flatten() : undefined
    }
  });
}
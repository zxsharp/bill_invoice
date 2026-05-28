import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
// Import routes here

const app = express();

if (env.SENTRY_DSN) {
  Sentry.init({ dsn: env.SENTRY_DSN });
  // app.use(Sentry.Handlers.requestHandler()); // Requires correct Express typing integration in Sentry v8
}

app.use(helmet());

app.use(cors({
  origin: env.CORS_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const globalLimiter = rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use('/api', globalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'OK' } });
});

// Base route for easy verification in the browser
app.get('/', (req, res) => {
  res.send('<h2>✅ InvoiceList Backend is running properly!</h2><p>Use the /api/v1 endpoints to interact with the API.</p>');
});


import authRoutes from './modules/auth/auth.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';
import userRoutes from './modules/users/user.routes';

if (env.SENTRY_DSN) {
  // app.use(Sentry.Handlers.errorHandler());
}

app.use('/api/v1/auth', authRoutes);
// Support legacy mount without versioning for backward compatibility
app.use('/api/auth', authRoutes);
// user routes can be added similarly when ready
app.use('/api/v1/invoices', invoiceRoutes);
// Support legacy singular invoice path for older clients
app.use('/api/invoice', invoiceRoutes);

// User routes
app.use('/api/v1/users', userRoutes);
// Legacy user path
app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;

import 'dotenv/config';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import router from './routes/index';
import { errorHandler } from './middlewares/error.middleware';

const allowedOrigins = [config.FRONTEND_URL, config.ADMIN_URL].filter(Boolean);

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server calls (no origin) and known frontend origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, message: 'Too many requests.' } }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/v1', router);
app.use(errorHandler);
export default app;

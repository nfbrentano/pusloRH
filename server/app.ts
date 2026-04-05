import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import deptRoutes from './routes/departments.js';
import surveyRoutes from './routes/surveys.js';
import responseRoutes from './routes/responses.js';

// --- CONFIGURATION ---
// In production/dev, we use .env. In tests, we might override this.
dotenv.config();

const app = express();

// --- GLOBAL MIDDLEWARES ---
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// --- ROUTES ---
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);

// --- GLOBAL ERROR HANDLER ---
app.use(errorHandler);

export default app;

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
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- GLOBAL MIDDLEWARES ---
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
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

// --- MISC ---
// (health moved above)

// --- GLOBAL ERROR HANDLER ---
app.use(errorHandler);

// --- STARTUP ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('💡 Run "npx prisma db seed" to initialize data if needed.');
});

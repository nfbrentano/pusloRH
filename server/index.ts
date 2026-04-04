import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'pulsorh-dev-secret-change-in-prod';
const JWT_EXPIRES_IN = '6h';

// --- CORS ---
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, mobile apps) or whitelisted origins
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

// --- TYPES ---
interface QuestionInput {
  text: string;
  type: string;
  allowComment: boolean;
}

interface ResponseInput {
  questionId: string;
  value: string | number;
  comment?: string;
}

interface JwtPayload {
  userId: string;
  role: string;
}

// Prisma User type with passwordHash (field added via migration)
type PrismaUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  status: string;
  departmentId: string | null;
  passwordHash: string | null;
  createdAt: Date;
  department?: unknown;
};

// --- AUTH MIDDLEWARE ---
function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing token' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as Request & { user?: JwtPayload }).user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
  }
}

// --- SEED INITIAL DATA ---
async function seed() {
  const departments = ['RH', 'Engenharia', 'Vendas', 'Marketing', 'Operações'];
  const colors = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  for (let i = 0; i < departments.length; i++) {
    const dept = await prisma.department.findUnique({ where: { name: departments[i] } });
    if (!dept) {
      await prisma.department.create({ data: { name: departments[i], color: colors[i] } });
    }
  }

  // Seed Admin with hashed password
  const adminEmail = 'admin@pulsorh.com';
  const defaultPassword = 'PulsoRH@2026!';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const rhDept = await prisma.department.findUnique({ where: { name: 'RH' } });
    const passwordHash = await bcrypt.hash(defaultPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin Master',
        role: 'ADMIN',
        departmentId: rhDept?.id,
        // @ts-expect-error — field added via migration, tsserver cache may lag
        passwordHash,
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
      },
    });
    console.log('✅  Admin criado. Senha padrão:', defaultPassword);
    console.log('⚠️   Troque a senha após o primeiro login em produção!');
  } else if (!(existing as PrismaUser).passwordHash) {
    // Backfill hash for existing admin without password
    const passwordHash = await bcrypt.hash(defaultPassword, 12);
    // @ts-expect-error — field added via migration, tsserver cache may lag
    await prisma.user.update({ where: { email: adminEmail }, data: { passwordHash } });
    console.log('✅  Hash adicionado ao admin existente. Senha padrão:', defaultPassword);
  }
}
seed();

// --- ROUTES ---

function sanitizeUser(user: PrismaUser) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

// --- AUTH ---
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      return;
    }

    const user = (await prisma.user.findUnique({
      where: { email: String(email) },
      include: { department: true },
    })) as PrismaUser | null;

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    if (user.status === 'Inactive') {
      res.status(403).json({ error: 'Conta desativada. Contate o administrador.' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// USERS (all protected)
app.get('/api/users', authenticate, async (_req: Request, res: Response) => {
  try {
    const users = (await prisma.user.findMany({
      include: { department: true },
      orderBy: { createdAt: 'desc' },
    })) as PrismaUser[];
    res.json(users.map(sanitizeUser));
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', authenticate, async (req: Request, res: Response) => {
  try {
    const { email, name, role, departmentId, avatar, password } = req.body as {
      email: string;
      name: string;
      role: string;
      departmentId?: string;
      avatar?: string;
      password?: string;
    };
    const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;
    const user = (await prisma.user.create({
      // @ts-expect-error — passwordHash exists at runtime after migration
      data: { email, name, role, departmentId, avatar, passwordHash },
      include: { department: true },
    })) as PrismaUser;
    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, departmentId, status, password } = req.body as {
      name: string;
      email: string;
      role: string;
      departmentId?: string;
      status?: string;
      password?: string;
    };
    const data: Record<string, unknown> = { name, email, role, departmentId, status };
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12);
    }
    const user = (await prisma.user.update({
      where: { id: String(id) },
      // @ts-expect-error — passwordHash field exists at runtime after migration
      data,
      include: { department: true },
    })) as PrismaUser;
    res.json(sanitizeUser(user));
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: String(id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// DEPARTMENTS (GET public, mutations protected)
app.get('/api/departments', async (_req: Request, res: Response) => {
  try {
    const depts = await prisma.department.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(depts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.post('/api/departments', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const dept = await prisma.department.create({ data: { name, color } });
    res.status(201).json(dept);
  } catch {
    res.status(500).json({ error: 'Failed to create department' });
  }
});

app.delete('/api/departments/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const count = await prisma.user.count({ where: { departmentId: String(id) } });
    if (count > 0) {
      res.status(400).json({ error: 'Cannot delete department with users' });
      return;
    }
    await prisma.department.delete({ where: { id: String(id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// SURVEYS (GET public, mutations protected)
app.get('/api/surveys', async (_req: Request, res: Response) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(surveys);
  } catch {
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

app.get('/api/surveys/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!survey) {
      res.status(404).json({ error: 'Survey not found' });
      return;
    }
    res.json(survey);
  } catch {
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});

app.post('/api/surveys', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, openDate, closeDate, expectedResponses, questions } = req.body;
    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        openDate,
        closeDate,
        expectedResponses: parseInt(String(expectedResponses)) || 0,
        questions: {
          create: (questions as QuestionInput[]).map((q) => ({
            text: q.text,
            type: q.type,
            allowComment: q.allowComment,
          })),
        },
      },
      include: { questions: true },
    });
    res.status(201).json(survey);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

app.put('/api/surveys/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, openDate, closeDate, expectedResponses, questions, isActive } =
      req.body;
    await prisma.question.deleteMany({ where: { surveyId: String(id) } });
    const survey = await prisma.survey.update({
      where: { id: String(id) },
      data: {
        title,
        description,
        openDate,
        closeDate,
        expectedResponses: parseInt(String(expectedResponses)) || 0,
        isActive,
        questions: {
          create: (questions as QuestionInput[]).map((q) => ({
            text: q.text,
            type: q.type,
            allowComment: q.allowComment,
          })),
        },
      },
      include: { questions: true },
    });
    res.json(survey);
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({ error: 'Failed to update survey' });
  }
});

// RESPONSES (public — respondents don't have accounts)
app.post('/api/responses', async (req: Request, res: Response) => {
  try {
    const { surveyId, responses } = req.body;
    const createdResponses = await Promise.all(
      (responses as ResponseInput[]).map((r) =>
        prisma.response.create({
          data: {
            surveyId: String(surveyId),
            questionId: String(r.questionId),
            value: String(r.value),
            comment: r.comment,
          },
        })
      )
    );
    res.status(201).json(createdResponses);
  } catch {
    res.status(500).json({ error: 'Failed to submit responses' });
  }
});

app.get('/api/surveys/:id/stats', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const count = await prisma.response.count({ where: { surveyId: String(id) } });
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

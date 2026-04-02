import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
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

// --- SEED INITIAL DATA ---
async function seed() {
  // Seed Departments
  const departments = ['RH', 'Engenharia', 'Vendas', 'Marketing', 'Operações'];
  const colors = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  for (let i = 0; i < departments.length; i++) {
    const dept = await prisma.department.findUnique({ where: { name: departments[i] } });
    if (!dept) {
      await prisma.department.create({
        data: { name: departments[i], color: colors[i] },
      });
    }
  }

  // Seed Admin
  const adminEmail = 'admin@pulsorh.com';
  const user = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!user) {
    const rhDept = await prisma.department.findUnique({ where: { name: 'RH' } });
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin Master',
        role: 'ADMIN',
        departmentId: rhDept?.id,
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
      },
    });
    console.log('Seeded initial admin user');
  }
}
seed();

// --- ROUTES ---

// USERS
app.get('/api/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { department: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, name, role, departmentId, avatar } = req.body;
    const user = await prisma.user.create({
      data: { email, name, role, departmentId, avatar },
      include: { department: true },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, departmentId, status } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role, departmentId, status },
      include: { department: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// DEPARTMENTS
app.get('/api/departments', async (_req, res) => {
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

app.post('/api/departments', async (req, res) => {
  try {
    const { name, color } = req.body;
    const dept = await prisma.department.create({
      data: { name, color },
    });
    res.status(201).json(dept);
  } catch {
    res.status(500).json({ error: 'Failed to create department' });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if department has users
    const count = await prisma.user.count({ where: { departmentId: id } });
    if (count > 0) return res.status(400).json({ error: 'Cannot delete department with users' });

    await prisma.department.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// SURVEYS
app.get('/api/surveys', async (_req, res) => {
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

app.get('/api/surveys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    res.json(survey);
  } catch {
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});

app.post('/api/surveys', async (req, res) => {
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

app.put('/api/surveys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, openDate, closeDate, expectedResponses, questions, isActive } =
      req.body;

    await prisma.question.deleteMany({ where: { surveyId: id } });

    const survey = await prisma.survey.update({
      where: { id },
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

app.post('/api/responses', async (req, res) => {
  try {
    const { surveyId, responses } = req.body;

    const createdResponses = await Promise.all(
      (responses as ResponseInput[]).map((r) =>
        prisma.response.create({
          data: {
            surveyId,
            questionId: r.questionId,
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

app.get('/api/surveys/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const count = await prisma.response.count({
      where: { surveyId: id },
    });
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

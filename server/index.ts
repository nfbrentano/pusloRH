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

// --- TYPES (Internal to Backend) ---
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

// --- SEED INITIAL USER (Demo Purposes) ---
async function seed() {
  const adminEmail = 'admin@pulsorh.com';
  const user = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!user) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin Master',
        role: 'ADMIN',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
      },
    });
    console.log('Seeded initial admin user');
  }
}
seed();

// --- ROUTES ---

// GET: All Surveys
app.get('/api/surveys', async (_req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: { questions: true },
    });
    res.json(surveys);
  } catch {
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// GET: Single Survey
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

// POST: Create Survey
app.post('/api/surveys', async (req, res) => {
  try {
    const { title, description, openDate, closeDate, expectedResponses, questions } = req.body;

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        openDate,
        closeDate,
        expectedResponses,
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
    console.error(error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

// PUT: Update Survey
app.put('/api/surveys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, openDate, closeDate, expectedResponses, questions, isActive } =
      req.body;

    // Delete existing questions and recreate (simplified update strategy)
    await prisma.question.deleteMany({ where: { surveyId: id } });

    const survey = await prisma.survey.update({
      where: { id },
      data: {
        title,
        description,
        openDate,
        closeDate,
        expectedResponses,
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
  } catch {
    res.status(500).json({ error: 'Failed to update survey' });
  }
});

// POST: Submit Response
app.post('/api/responses', async (req, res) => {
  try {
    const { surveyId, responses } = req.body; // responses is array of { questionId, value, comment }

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

// GET: Survey Statistics (Responses collected)
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

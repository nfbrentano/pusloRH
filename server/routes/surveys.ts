import { Router, type Request, type Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

interface QuestionInput {
  text: string;
  type: string;
  allowComment: boolean;
}

// List all surveys (Protected: Admin/HR only)
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'HR']),
  asyncHandler(async (_req: Request, res: Response) => {
    const surveys = await prisma.survey.findMany({
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(surveys);
  })
);

// Public lookup for respondent view
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const survey = await prisma.survey.findUnique({
      where: { id: String(id) },
      include: { questions: true },
    });

    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    res.json(survey);
  })
);

// Create survey (Admin/HR)
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'HR']),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// Update survey (Admin/HR)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'HR']),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// Stats (Protected)
router.get(
  '/:id/stats',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const count = await prisma.response.count({ where: { surveyId: String(id) } });
    res.json({ count });
  })
);

export default router;

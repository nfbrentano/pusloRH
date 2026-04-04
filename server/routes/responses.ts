import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

// Publicly submit responses
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { surveyId, responses } = req.body;
    const createdResponses = await Promise.all(
      (responses as { questionId: string; value: string; comment?: string }[]).map((r) =>
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
  })
);

export default router;

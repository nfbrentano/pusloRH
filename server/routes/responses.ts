import { Router, type Request, type Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Publicly submit responses
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { surveyId, responses } = req.body;

    if (!surveyId || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Survey ID and responses array are required' });
    }

    // Verify survey exists to avoid 500 on foreign key violations
    const survey = await prisma.survey.findUnique({
      where: { id: String(surveyId) },
    });

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    const createdResponses = await Promise.all(
      responses.map((r: { questionId: string; value: string; comment?: string }) =>
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

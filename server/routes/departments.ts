import { Router, type Request, type Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// List departments (Public/Authenticated)
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const depts = await prisma.department.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(depts);
  })
);

// Create department (Admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMIN']),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, color } = req.body;
    const dept = await prisma.department.create({ data: { name, color } });
    res.status(201).json(dept);
  })
);

// Delete department (Admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN']),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const count = await prisma.user.count({ where: { departmentId: String(id) } });
    if (count > 0) {
      return res.status(400).json({ error: 'Cannot delete department with users associted.' });
    }

    await prisma.department.delete({ where: { id: String(id) } });
    res.status(204).send();
  })
);

export default router;

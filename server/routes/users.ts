import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticateToken, requireRole, type AuthenticatedRequest } from '../middleware/auth.js';
import { sanitizeUser } from '../utils/sanitize.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

// All user routes require authentication
router.use(authenticateToken);

// List users (Admin/HR only)
router.get(
  '/',
  requireRole(['ADMIN', 'HR']),
  asyncHandler(async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      include: { department: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users.map(sanitizeUser));
  })
);

// Create user (Admin only)
router.post(
  '/',
  requireRole(['ADMIN']),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, name, role, departmentId, avatar, password } = req.body;
    const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await prisma.user.create({
      data: { email, name, role, departmentId, avatar, passwordHash },
      include: { department: true },
    });

    res.status(201).json(sanitizeUser(user));
  })
);

// Update user (Self or Admin)
router.put(
  '/:id',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const authUser = req.user;

    if (!authUser) return res.status(401).json({ error: 'Unauthorized' });

    // Basic RBAC: only Admin can change roles/status, or update others
    if (authUser.role !== 'ADMIN' && authUser.userId !== id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const { name, email, role, departmentId, status, password } = req.body;
    const data: Record<string, unknown> = { name, email, role, departmentId, status };

    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12);
    }

    // Restricted fields for non-admins
    if (authUser.role !== 'ADMIN') {
      delete data.role;
      delete data.status;
    }

    const user = await prisma.user.update({
      where: { id: String(id) },
      data,
      include: { department: true },
    });

    res.json(sanitizeUser(user));
  })
);

// Delete user (Admin only)
router.delete(
  '/:id',
  requireRole(['ADMIN']),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: String(id) } });
    res.status(204).send();
  })
);

export default router;

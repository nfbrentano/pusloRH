import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sanitizeUser } from '../utils/sanitize.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();
const prisma = new PrismaClient();

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

const JWT_EXPIRES_IN = '6h';

router.post(
  '/login',
  authLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email) },
      include: { department: true },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ error: 'Conta desativada. Contate o administrador.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const secret = getJwtSecret();
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, user: sanitizeUser(user) });
  })
);

export default router;

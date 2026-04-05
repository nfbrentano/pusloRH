import { describe, it, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API Integration Tests', () => {
  it('should login successfully as admin', async () => {
    // 1. Create a test admin user directly
    const password = 'Password@123';
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: 'admin-test@pulsorh.com',
        name: 'Admin Test',
        role: 'ADMIN',
        passwordHash,
        status: 'Active',
      },
    });

    // 2. Perform login request
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin-test@pulsorh.com', password });

    // 3. Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('admin-test@pulsorh.com');
    expect(response.body.user.role).toBe('ADMIN');
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('should return 401 for wrong password', async () => {
    // 1. Create a test user directly
    const passwordHash = await bcrypt.hash('secret', 10);
    await prisma.user.create({
      data: {
        email: 'wrong-pass@test.com',
        name: 'Failure Test',
        role: 'USER',
        passwordHash,
        status: 'Active',
      },
    });

    // 2. Perform login request with WRONG password
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong-pass@test.com', password: 'NOT-SECRET' });

    // 3. Assertions
    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Credenciais inválidas/i);
  });

  it('should return 403 for inactive user', async () => {
    // 1. Create an INACTIVE user directly
    const password = 'Password@123';
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: 'inactive@test.com',
        name: 'Inactive Test',
        role: 'USER',
        passwordHash,
        status: 'Inactive',
      },
    });

    // 2. Perform login request
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'inactive@test.com', password });

    // 3. Assertions
    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/Conta desativada/i);
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'only-email@test.com' }); // missing password

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/E-mail e senha são obrigatórios/i);
  });
});

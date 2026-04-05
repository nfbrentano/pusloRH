import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'test-secret-key-for-integration-tests';

describe('Surveys API Integration Tests', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    // 1. Setup users
    const admin = await prisma.user.create({
      data: { email: 'admin@test.com', name: 'Admin', role: 'ADMIN' },
    });
    const user = await prisma.user.create({
      data: { email: 'user@test.com', name: 'User', role: 'USER' },
    });

    // 2. Generate tokens
    adminToken = jwt.sign({ userId: admin.id, role: admin.role }, JWT_SECRET);
    userToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
  });

  describe('GET /api/surveys', () => {
    it('should allow Admin to list surveys', async () => {
      await prisma.survey.create({
        data: {
          title: 'Test Survey',
          description: 'Desc',
          openDate: '2026-01-01',
          closeDate: '2026-12-31',
        },
      });

      const response = await request(app)
        .get('/api/surveys')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Test Survey');
    });

    it('should block regular Users from listing surveys', async () => {
      const response = await request(app)
        .get('/api/surveys')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toMatch(/Forbidden: Insufficient permissions/i);
    });
  });

  describe('POST /api/surveys', () => {
    it('should create a new survey with questions as Admin', async () => {
      const payload = {
        title: 'New Integration Survey',
        description: 'Testing creation',
        openDate: '2026-04-01',
        closeDate: '2026-05-01',
        expectedResponses: 50,
        questions: [
          { text: 'Q1', type: 'Binary', allowComment: true },
          { text: 'Q2', type: 'Emoticons', allowComment: false },
        ],
      };

      const response = await request(app)
        .post('/api/surveys')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Integration Survey');
      expect(response.body.questions.length).toBe(2);
    });
  });

  describe('GET /api/surveys/:id', () => {
    it('should return survey details publicly', async () => {
      const survey = await prisma.survey.create({
        data: {
          title: 'Public Survey',
          description: 'Visible to everyone',
          openDate: '2026-01-01',
          closeDate: '2026-12-31',
        },
      });

      const response = await request(app).get(`/api/surveys/${survey.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Public Survey');
    });

    it('should return 404 for non-existent survey', async () => {
      const response = await request(app).get('/api/surveys/missing-id');
      expect(response.status).toBe(404);
    });
  });
});

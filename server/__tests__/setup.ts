import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Load test environment variables
const TEST_DB_PATH = path.resolve(__dirname, '../../prisma/test.db');
process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
process.env.JWT_SECRET = 'test-secret-key-for-integration-tests';
process.env.NODE_ENV = 'test';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Ensure the test database is fresh
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }

  // Run migrations to create schema in test.db
  console.log('⏳ Setting up test database...');
  execSync('npx prisma db push --skip-generate', {
    env: { ...process.env, DATABASE_URL: `file:${TEST_DB_PATH}` },
  });
  console.log('✅ Test database ready.');
});

afterAll(async () => {
  await prisma.$disconnect();
  // Cleanup test database file
  if (fs.existsSync(TEST_DB_PATH)) {
    // fs.unlinkSync(TEST_DB_PATH); // Optional: keep for debugging if needed
  }
});

beforeEach(async () => {
  // Clear all data before each test to ensure isolation
  const deleteResponses = prisma.response.deleteMany();
  const deleteQuestions = prisma.question.deleteMany();
  const deleteSurveys = prisma.survey.deleteMany();
  const deleteUsers = prisma.user.deleteMany();
  const deleteDepts = prisma.department.deleteMany();

  await prisma.$transaction([
    deleteResponses,
    deleteQuestions,
    deleteSurveys,
    deleteUsers,
    deleteDepts,
  ]);
});

export { prisma };

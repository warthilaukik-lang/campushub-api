import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/db';

const email = `test-${Date.now()}@example.com`;
const password = 'password123';

afterAll(async () => {
  await prisma.$disconnect();
});

describe('health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('auth', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/auth/register').send({ name: 'Test User', email, password });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
  });

  it('rejects a duplicate email', async () => {
    const res = await request(app).post('/auth/register').send({ name: 'Test User', email, password });
    expect(res.status).toBe(409);
  });

  it('rejects a wrong password', async () => {
    const res = await request(app).post('/auth/login').send({ email, password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('rejects a protected route without a token', async () => {
    const res = await request(app).get('/me');
    expect(res.status).toBe(401);
  });

  it('returns the user with a valid token', async () => {
    const login = await request(app).post('/auth/login').send({ email, password });
    const res = await request(app).get('/me').set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('STUDENT');
  });
});

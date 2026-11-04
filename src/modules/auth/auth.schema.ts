import { z } from 'zod';

const email = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email');

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email,
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

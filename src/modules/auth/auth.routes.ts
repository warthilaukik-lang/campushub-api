import { Router } from 'express';
import { loginSchema, refreshSchema, registerSchema } from './auth.schema';
import * as authService from './auth.service';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    return;
  }
  res.status(201).json(await authService.register(parsed.data));
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    return;
  }
  res.status(200).json(await authService.login(parsed.data));
});

authRouter.post('/refresh', (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    return;
  }
  res.status(200).json(authService.refresh(parsed.data.refreshToken));
});

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db';
import { config } from '../../config';
import { HttpError } from '../../lib/httpError';

function signTokens(userId: string, role: string) {
  const accessToken = jwt.sign({ role }, config.jwtSecret, {
    subject: userId,
    expiresIn: '15m',
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ role, type: 'refresh' }, config.jwtRefreshSecret, {
    subject: userId,
    expiresIn: '7d',
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

export async function register(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new HttpError(409, 'Email already registered');

  const password = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, password },
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    ...signTokens(user.id, user.role),
  };
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    ...signTokens(user.id, user.role),
  };
}

export function refresh(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, config.jwtRefreshSecret) as jwt.JwtPayload;
    return signTokens(String(payload.sub), String(payload.role));
  } catch {
    throw new HttpError(401, 'Invalid refresh token');
  }
}

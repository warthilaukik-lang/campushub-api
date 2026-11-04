import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { notesRouter } from './modules/notes/notes.routes';
import { requireAuth } from './middleware/auth';
import { HttpError } from './lib/httpError';
import { UPLOAD_DIR } from './lib/upload';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/auth', authRouter);
app.use('/notes', notesRouter);

app.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { createBookmarkSchema } from './bookmarks.schema';
import * as bookmarksService from './bookmarks.service';

export const bookmarksRouter = Router();

bookmarksRouter.use(requireAuth);

bookmarksRouter.get('/me', async (req, res) => {
  res.json(await bookmarksService.listBookmarks(req.user!.id));
});

bookmarksRouter.post('/', async (req, res) => {
  const parsed = createBookmarkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    return;
  }
  res.status(201).json(await bookmarksService.addBookmark(req.user!.id, parsed.data.noteId));
});

bookmarksRouter.delete('/:id', async (req, res) => {
  res.json(await bookmarksService.removeBookmark(req.user!.id, req.params.id));
});
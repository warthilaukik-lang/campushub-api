import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { upload } from '../../lib/upload';
import { createNoteSchema, listNotesQuery, updateNoteSchema } from './notes.schema';
import * as notesService from './notes.service';

export const notesRouter = Router();

notesRouter.get('/', async (req, res) => {
  const parsed = listNotesQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query', issues: parsed.error.issues });
    return;
  }
  res.json(await notesService.listNotes(parsed.data));
});

notesRouter.get('/:id', async (req, res) => {
  res.json(await notesService.getNote(req.params.id as string));
});

notesRouter.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'A file is required in the "file" field' });
    return;
  }

  const parsed = createNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    return;
  }

  const note = await notesService.createNote({
    ...parsed.data,
    fileUrl: `/uploads/${req.file.filename}`,
    uploaderId: req.user!.id,
  });

  res.status(201).json(note);
});

notesRouter.patch('/:id', requireAuth, async (req, res) => {
  const parsed = updateNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    return;
  }
  res.json(await notesService.updateNote(req.params.id as string, req.user!.id, parsed.data));
});

notesRouter.delete('/:id', requireAuth, requireRole('ADMIN'), async (req, res) => {
  res.json(await notesService.deleteNote(req.params.id as string));
});
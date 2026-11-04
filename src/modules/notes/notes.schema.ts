import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(3).max(120),
  subject: z.string().min(2).max(60),
  semester: z.coerce.number().int().min(1).max(8),
});

export const updateNoteSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  subject: z.string().min(2).max(60).optional(),
  semester: z.coerce.number().int().min(1).max(8).optional(),
});

export const listNotesQuery = z.object({
  subject: z.string().optional(),
  semester: z.coerce.number().int().min(1).max(8).optional(),
  q: z.string().optional(),
});

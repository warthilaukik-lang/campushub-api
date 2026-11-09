import { z } from 'zod';

export const createBookmarkSchema = z.object({
  noteId: z.string().uuid(),
});
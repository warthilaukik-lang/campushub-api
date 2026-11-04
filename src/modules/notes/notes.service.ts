import { prisma } from '../../db';
import { HttpError } from '../../lib/httpError';

const publicFields = {
  id: true,
  title: true,
  subject: true,
  semester: true,
  fileUrl: true,
  createdAt: true,
} as const;

export function createNote(input: {
  title: string;
  subject: string;
  semester: number;
  fileUrl: string;
  uploaderId: string;
}) {
  return prisma.note.create({ data: input, select: publicFields });
}

export function listNotes(filters: { subject?: string; semester?: number; q?: string }) {
  return prisma.note.findMany({
    where: {
      ...(filters.subject ? { subject: filters.subject } : {}),
      ...(filters.semester ? { semester: filters.semester } : {}),
      ...(filters.q ? { title: { contains: filters.q, mode: 'insensitive' as const } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: publicFields,
  });
}

export async function getNote(id: string) {
  const note = await prisma.note.findUnique({
    where: { id },
    select: { ...publicFields, uploaderId: true },
  });
  if (!note) throw new HttpError(404, 'Note not found');
  return note;
}

export async function updateNote(
  id: string,
  userId: string,
  data: { title?: string; subject?: string; semester?: number },
) {
  const note = await prisma.note.findUnique({ where: { id }, select: { uploaderId: true } });
  if (!note) throw new HttpError(404, 'Note not found');
  if (note.uploaderId !== userId) throw new HttpError(403, 'You can only edit your own notes');

  return prisma.note.update({ where: { id }, data, select: publicFields });
}

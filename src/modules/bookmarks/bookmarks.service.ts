import { prisma } from '../../db';
import { HttpError } from '../../lib/httpError';

const noteFields = {
  id: true,
  title: true,
  subject: true,
  semester: true,
  fileUrl: true,
  createdAt: true,
} as const;

export async function addBookmark(userId: string, noteId: string) {
  const note = await prisma.note.findUnique({ where: { id: noteId }, select: { id: true } });
  if (!note) throw new HttpError(404, 'Note not found');

  try {
    return await prisma.bookmark.create({
      data: { userId, noteId },
      select: { id: true, createdAt: true, note: { select: noteFields } },
    });
  } catch (err) {
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      throw new HttpError(409, 'You already bookmarked this note');
    }
    throw err;
  }
}

export function listBookmarks(userId: string) {
  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, createdAt: true, note: { select: noteFields } },
  });
}

export async function removeBookmark(userId: string, bookmarkId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { id: bookmarkId },
    select: { userId: true },
  });
  if (!bookmark) throw new HttpError(404, 'Bookmark not found');
  if (bookmark.userId !== userId) throw new HttpError(403, 'That is not your bookmark');

  await prisma.bookmark.delete({ where: { id: bookmarkId } });
  return { deleted: true };
}
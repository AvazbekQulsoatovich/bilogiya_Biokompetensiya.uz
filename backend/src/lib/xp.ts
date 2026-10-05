import { prisma } from './prisma';

/** Har 500 XP uchun yangi daraja. */
export const levelForXp = (xp: number) => Math.floor(Math.max(0, xp) / 500) + 1;

/** XP qoʻshadi va darajani yangilaydi. */
export async function grantXp(userId: string, amount: number) {
  const add = Math.max(0, Math.round(amount));
  if (!add) {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true } });
    return u ? { xp: u.xp, level: u.level } : null;
  }
  const updated = await prisma.user.update({ where: { id: userId }, data: { xp: { increment: add } } });
  const level = levelForXp(updated.xp);
  if (level !== updated.level) await prisma.user.update({ where: { id: userId }, data: { level } });
  return { xp: updated.xp, level };
}

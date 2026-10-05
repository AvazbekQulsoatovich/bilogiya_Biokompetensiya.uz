import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Reyting: eng koʻp XP toʻplaganlar (familiyaning faqat bosh harfi koʻrsatiladi)
router.get('/', async (req, res) => {
  try {
    const top = await prisma.user.findMany({
      where: { role: 'STUDENT', xp: { gt: 0 } },
      take: 20,
      orderBy: [{ xp: 'desc' }, { createdAt: 'asc' }],
      select: { id: true, firstName: true, lastName: true, avatarUrl: true, xp: true, level: true },
    });
    res.json(top.map((u, i) => ({
      id: u.id,
      rank: i + 1,
      name: `${u.firstName} ${u.lastName && u.lastName !== '-' ? u.lastName[0] + '.' : ''}`.trim(),
      avatarUrl: u.avatarUrl,
      xp: u.xp,
      level: u.level,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;

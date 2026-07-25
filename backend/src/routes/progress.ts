import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: true, coins: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      totalXp: user.xp,
      level: user.level,
      streak: user.streak,
      coins: user.coins
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;

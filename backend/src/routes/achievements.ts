import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all possible achievements and user's unlocked ones
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let achievements = await prisma.achievement.findMany();
    
    // Seed default achievements if empty
    if (achievements.length === 0) {
      await prisma.achievement.createMany({
        data: [
          { name: "Yangi Boshlovchi", description: "Tizimga ilk bor kirdingiz", xpReward: 10 },
          { name: "Biolog", description: "1-chi testni muvaffaqiyatli yechdingiz", xpReward: 50 },
          { name: "Krossvord Ustasi", description: "Birinchi krossvordni yakunladingiz", xpReward: 50 },
          { name: "Tadqiqotchi", description: "Barcha 3D modellarni ko'rib chiqdingiz", xpReward: 100 }
        ]
      });
      achievements = await prisma.achievement.findMany();
    }

    const userUnlocked = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    });

    const unlockedIds = userUnlocked.map(ua => ua.achievementId);

    const result = achievements.map(ach => ({
      ...ach,
      unlocked: unlockedIds.includes(ach.id)
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;

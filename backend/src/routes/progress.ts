import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id as string;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: true, coins: true, createdAt: true },
    });
    if (!user) return res.status(401).json({ error: 'Qayta kiring.' });

    const [labs, quizzes, crosswords, tasks, ahead] = await Promise.all([
      prisma.labResult.findMany({ where: { userId }, distinct: ['labId'], select: { labId: true } }),
      prisma.quizAttempt.findMany({ where: { userId }, distinct: ['quizId'], select: { quizId: true } }),
      prisma.completion.count({ where: { userId, kind: 'CROSSWORD' } }),
      prisma.extracurricularTaskSubmission.findMany({ where: { userId }, distinct: ['taskId'], select: { taskId: true } }),
      prisma.user.count({ where: { role: 'STUDENT', xp: { gt: user.xp } } }),
    ]);

    res.json({
      totalXp: user.xp,
      level: user.level,
      streak: user.streak,
      coins: user.coins,
      nextLevelXp: user.level * 500,
      rank: ahead + 1,
      labsDone: labs.length,
      quizzesDone: quizzes.length,
      crosswordsDone: crosswords,
      tasksDone: tasks.length,
      joinedAt: user.createdAt,
    });
  } catch (error) {
    console.error('Progress error:', (error as Error).message);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;

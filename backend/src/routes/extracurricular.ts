import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, optionalAuth, AuthRequest } from '../middleware/auth';
import { grantXp } from '../lib/xp';

const router = Router();

// Get all extracurricular tasks
router.get('/', async (req, res) => {
  try {
    let tasks = await prisma.extracurricularTask.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    if (tasks.length === 0) {
      const mockTask = await prisma.extracurricularTask.create({
        data: {
          title: "Biologiya muzeyiga tashrif",
          description: "O'zbekiston tabiat muzeyiga borib kelish va hisobot yozish.",
          xpReward: 50
        }
      });
      tasks = [mockTask];
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch extracurricular tasks' });
  }
});

// Admin: Create an extracurricular task
router.post('/', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, description, xpReward } = req.body;
    const task = await prisma.extracurricularTask.create({
      data: {
        title,
        description,
        xpReward: xpReward ? parseInt(xpReward.toString(), 10) : 50
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Topshiriqni topshirish. XP faqat tizimga kirgan foydalanuvchiga va bir marta beriladi.
router.post('/:id/submit', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const content = typeof req.body?.content === 'string' ? req.body.content.slice(0, 5000) : '';
    const userId: string | undefined = req.user?.id;

    const task = await prisma.extracurricularTask.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const answer = content.trim();
    if (answer.length < 15) {
      return res.status(400).json({ error: "Javobingiz juda qisqa. Iltimos, toʻliqroq yozing." });
    }
    if (answer.split(/\s+/).length < 3) {
      return res.status(400).json({ error: "Iltimos, haqiqiy maʼnoli javob yozing (kamida 3-4 ta soʻz)." });
    }

    if (!userId) return res.json({ success: true, rewardXp: 0, guest: true });

    const already = await prisma.extracurricularTaskSubmission.findFirst({ where: { userId, taskId: id } });
    await prisma.extracurricularTaskSubmission.create({ data: { userId, taskId: id, content: answer, status: 'COMPLETED' } });
    const progress = await grantXp(userId, already ? 0 : task.xpReward);
    res.json({ success: true, rewardXp: already ? 0 : task.xpReward, repeat: !!already, progress });
  } catch (error) {
    console.error('Submit extracurricular error:', (error as Error).message);
    res.status(500).json({ error: "Topshiriqni yuborib boʻlmadi." });
  }
});

export default router;

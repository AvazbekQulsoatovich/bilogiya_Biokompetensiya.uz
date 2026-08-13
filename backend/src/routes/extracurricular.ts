import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

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

// Submit a task and get XP
router.post('/:id/submit', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const task = await prisma.extracurricularTask.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Basic validation
    const answer = (content || '').trim();
    if (answer.length < 15) {
      return res.status(400).json({ error: "Javobingiz juda qisqa yoki noto'g'ri. Iltimos to'liqroq yozing." });
    }
    const words = answer.split(/\s+/);
    if (words.length < 3) {
      return res.status(400).json({ error: "Iltimos, haqiqiy ma'noli javob yozing (kamida 3-4 ta so'zdan iborat bo'lsin)." });
    }

    // Update progress
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: task.xpReward } }
    });

    const submission = await prisma.extracurricularTaskSubmission.create({
      data: {
        userId,
        taskId: id,
        content: content || 'Bajarildi',
        status: 'COMPLETED'
      }
    });

    res.json({ success: true, submission, rewardXp: task.xpReward });
  } catch (error: any) {
    console.error('Submit Extracurricular Error:', error);
    res.status(500).json({ error: 'Failed to submit task: ' + error.message });
  }
});

export default router;

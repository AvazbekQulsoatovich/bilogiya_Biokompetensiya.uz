import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all labs
router.get('/', async (req, res) => {
  try {
    const labs = await prisma.lab.findMany({
      orderBy: { title: 'asc' }
    });
    // Default mock lab if empty
    if (labs.length === 0) {
      const mockLab = await prisma.lab.create({
        data: {
          title: "Hujayrani mikroskopda ko'rish",
          description: "Piyoz po'sti hujayrasini mikroskop ostida tayyorlash va ko'rish jarayonini amalda sinab ko'ring.",
          stepsJson: JSON.stringify([
            { id: 1, type: "drag", item: "piyoz", target: "oyna", instruction: "Piyoz po'stini predmet oynasiga qo'ying" },
            { id: 2, type: "click", item: "tomizgich", instruction: "Yod eritmasidan bir tomchi tomizing" },
            { id: 3, type: "drag", item: "qoplagich", target: "oyna", instruction: "Usti qoplagich oyna bilan yoping" },
            { id: 4, type: "drag", item: "oyna", target: "mikroskop", instruction: "Tayyor preparatni mikroskopga joylashtiring" }
          ]),
          rewardXp: 50
        }
      });
      return res.json([mockLab]);
    }
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// Get a single lab
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    const lab = await prisma.lab.findUnique({
      where: { id }
    });
    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.json(lab);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
});

// Complete a lab (submit result)
router.post('/:id/complete', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const actualUserId = req.user?.id;
    
    if (!actualUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const lab = await prisma.lab.findUnique({ where: { id } });
    if (!lab) return res.status(404).json({ error: 'Lab not found' });

    // Give XP to user
    await prisma.user.update({
      where: { id: actualUserId },
      data: {
        xp: { increment: lab.rewardXp }
      }
    });

    // Save result
    const result = await prisma.labResult.create({
      data: {
        userId: actualUserId,
        labId: id,
        score: 100
      }
    });

    res.status(200).json({ success: true, rewardXp: lab.rewardXp, result });
  } catch (error) {
    console.error('Completion error:', error);
    res.status(500).json({ error: 'Failed to complete lab' });
  }
});

export default router;

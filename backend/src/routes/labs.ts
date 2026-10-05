import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { grantXp } from '../lib/xp';

const router = Router();

// Barcha laboratoriyalar
router.get('/', async (req, res) => {
  try {
    const labs = await prisma.lab.findMany({ orderBy: { title: 'asc' } });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// Joriy foydalanuvchining bajargan laboratoriyalari (eng yaxshi ball bilan)
router.get('/results/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const rows = await prisma.labResult.findMany({ where: { userId: req.user.id }, orderBy: { completedAt: 'desc' } });
    const best = new Map<string, { labId: string; score: number; completedAt: Date }>();
    for (const r of rows) {
      const cur = best.get(r.labId);
      if (!cur || r.score > cur.score) best.set(r.labId, { labId: r.labId, score: r.score, completedAt: r.completedAt });
    }
    res.json([...best.values()]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Bitta laboratoriya
router.get('/:id', async (req, res) => {
  try {
    const lab = await prisma.lab.findUnique({ where: { id: req.params.id as string } });
    if (!lab) return res.status(404).json({ error: 'Lab not found' });
    res.json(lab);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
});

// Natijani saqlash. XP faqat birinchi marta beriladi.
router.post('/:id/complete', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const userId = req.user.id as string;

    const lab = await prisma.lab.findUnique({ where: { id } });
    if (!lab) return res.status(404).json({ error: 'Lab not found' });

    const raw = Number(req.body?.score);
    const score = Number.isFinite(raw) ? Math.max(0, Math.min(100, Math.round(raw))) : 100;

    const already = await prisma.labResult.findFirst({ where: { userId, labId: id } });
    const result = await prisma.labResult.create({ data: { userId, labId: id, score } });
    const progress = await grantXp(userId, already ? 0 : lab.rewardXp);

    res.status(200).json({ success: true, rewardXp: already ? 0 : lab.rewardXp, repeat: !!already, progress, result });
  } catch (error) {
    console.error('Completion error:', (error as Error).message);
    res.status(500).json({ error: 'Failed to complete lab' });
  }
});

export default router;

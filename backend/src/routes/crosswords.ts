import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { grantXp } from '../lib/xp';

const router = Router();

// Get all crosswords
router.get('/', async (req, res) => {
  try {
    const crosswords = await prisma.crossword.findMany({
      include: {
        _count: {
          select: { items: true }
        }
      }
    });
    
    if (crosswords.length === 0) {
      const mock = await prisma.crossword.create({
        data: {
          title: "Biologiya Asoslari",
          description: "Eng ko'p ishlatiladigan biologik atamalar.",
          items: {
            create: [
              { word: "YADRO", clue: "Hujayra markazi", direction: "HORIZONTAL", row: 0, col: 0 },
              { word: "DNK", clue: "Nasliy axborot tashuvchi", direction: "VERTICAL", row: 0, col: 2 }
            ]
          }
        },
        include: { _count: { select: { items: true } } }
      });
      return res.json([mock]);
    }
    
    res.json(crosswords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crosswords' });
  }
});

// Get single crossword
router.get('/:id', async (req, res) => {
  try {
    const cw = await prisma.crossword.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });
    if (!cw) return res.status(404).json({ error: 'Crossword not found' });
    res.json(cw);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crossword' });
  }
});

// Krossvord yakuni: XP har bir foydalanuvchiga faqat bir marta
router.post('/:id/submit', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id as string;
    const refId = req.params.id as string;
    const found = await prisma.crossword.findUnique({ where: { id: refId }, select: { id: true } });
    if (!found) return res.status(404).json({ error: 'Crossword not found' });

    const done = await prisma.completion.findUnique({ where: { userId_kind_refId: { userId, kind: 'CROSSWORD', refId } } });
    if (done) return res.json({ success: true, rewardXp: 0, repeat: true });

    await prisma.completion.create({ data: { userId, kind: 'CROSSWORD', refId } });
    const progress = await grantXp(userId, 50);
    res.json({ success: true, rewardXp: 50, progress });
  } catch (error) {
    console.error('Crossword submit error:', (error as Error).message);
    res.status(500).json({ error: 'Failed to complete crossword' });
  }
});

export default router;

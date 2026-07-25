import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

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

// Submit crossword for XP
router.post('/:id/submit', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Flat 50 XP for completing a crossword
    const rewardXp = 50;
    
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: rewardXp } }
    });

    res.json({ success: true, rewardXp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete crossword' });
  }
});

export default router;

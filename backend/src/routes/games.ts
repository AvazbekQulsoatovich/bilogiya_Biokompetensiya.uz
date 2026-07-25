import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    if (games.length === 0) {
      const mockGame = await prisma.game.create({
        data: {
          title: "Hujayra Qismlari Xotira O'yini",
          description: "Karta orqasidagi bir xil biologik atamalarni juftlang va xotirangizni charxlang.",
          type: "MEMORY",
          contentJson: JSON.stringify([
            { id: 1, name: "Mitoxondriya", emoji: "⚡" },
            { id: 2, name: "Yadro", emoji: "🧠" },
            { id: 3, name: "Xloroplast", emoji: "🍃" },
            { id: 4, name: "DNK", emoji: "🧬" },
            { id: 5, name: "Bakteriya", emoji: "🦠" },
            { id: 6, name: "Virus", emoji: "☣️" }
          ])
        }
      });
      return res.json([mockGame]);
    }
    
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: req.params.id }
    });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

export default router;

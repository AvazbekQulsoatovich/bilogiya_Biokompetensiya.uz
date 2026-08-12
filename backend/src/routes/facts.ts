import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all facts
router.get('/', async (req, res) => {
  try {
    let facts = await prisma.fact.findMany({ orderBy: { createdAt: 'desc' } });

    if (facts.length === 0) {
      await prisma.fact.createMany({
        data: [
          { title: "Miya quvvati", content: "Inson miyasi uyan paytda taxminan 23 vatt elektr energiyasi ishlab chiqaradi, bu bitta kichik lampochkani yoqishga yetadi." },
          { title: "DNK uzunligi", content: "Agar inson tanasidagi barcha DNK iplari yoyilib chiqilsa, ular yerdan quyoshgacha borib qaytish masofasiga 300 marta yetadi!" },
          { title: "Eng katta hujayra", content: "Tuyqush tuxumi dunyodagi mavjud bo'lgan eng katta yagona hujayradir." }
        ]
      });
      facts = await prisma.fact.findMany({ orderBy: { createdAt: 'desc' } });
    }

    res.json(facts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facts' });
  }
});

// Create a new fact
router.post('/', async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Sarlavha va matn kiritish majburiy' });
    }
    const fact = await prisma.fact.create({
      data: { title, content, category: category || 'GENERAL', imageUrl }
    });
    res.status(201).json(fact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create fact' });
  }
});

// Update a fact
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    const fact = await prisma.fact.update({
      where: { id: req.params.id },
      data: { title, content, category, imageUrl }
    });
    res.json(fact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fact' });
  }
});

// Delete a fact
router.delete('/:id', async (req, res) => {
  try {
    await prisma.fact.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fact' });
  }
});

export default router;

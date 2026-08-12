import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all glossary terms
router.get('/', async (req, res) => {
  try {
    let terms = await prisma.glossary.findMany({
      orderBy: { term: 'asc' }
    });

    if (terms.length === 0) {
      await prisma.glossary.createMany({
        data: [
          { term: "Gen", definition: "Irsiy ma'lumotning tuzilish va funksional birligi." },
          { term: "DNK", definition: "Dezoksiribonuklein kislota, barcha tirik organizmlarning irsiy belgilari tashuvchisi." },
          { term: "Hujayra", definition: "Tirik organizmlarning eng kichik tuzilish birligi." },
          { term: "Fotosintez", definition: "Yorug'lik energiyasi yordamida anorganik moddalardan organik moddalar sintezlash jarayoni." }
        ]
      });
      terms = await prisma.glossary.findMany({ orderBy: { term: 'asc' } });
    }

    res.json(terms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch glossary' });
  }
});

// Create a new term
router.post('/', async (req, res) => {
  try {
    const { term, definition, imageUrl } = req.body;
    if (!term || !definition) {
      return res.status(400).json({ error: 'Atama va ta\'rif kiritish majburiy' });
    }
    const entry = await prisma.glossary.create({
      data: { term, definition, imageUrl }
    });
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create glossary term' });
  }
});

// Update a term
router.put('/:id', async (req, res) => {
  try {
    const { term, definition, imageUrl } = req.body;
    const entry = await prisma.glossary.update({
      where: { id: req.params.id },
      data: { term, definition, imageUrl }
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update glossary term' });
  }
});

// Delete a term
router.delete('/:id', async (req, res) => {
  try {
    await prisma.glossary.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete glossary term' });
  }
});

export default router;

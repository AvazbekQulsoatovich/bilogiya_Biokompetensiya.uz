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

export default router;

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get facts
router.get('/', async (req, res) => {
  try {
    let facts = await prisma.fact.findMany();

    if (facts.length === 0) {
      await prisma.fact.createMany({
        data: [
          { title: "Miya quvvati", content: "Inson miyasi uyan paytda taxminan 23 vatt elektr energiyasi ishlab chiqaradi, bu bitta kichik lampochkani yoqishga yetadi." },
          { title: "DNK uzunligi", content: "Agar inson tanasidagi barcha DNK iplari yoyilib chiqilsa, ular yerdan quyoshgacha borib qaytish masofasiga 300 marta yetadi!" },
          { title: "Eng katta hujayra", content: "Tuyqush tuxumi dunyodagi mavjud bo'lgan eng katta yagona hujayradir." }
        ]
      });
      facts = await prisma.fact.findMany();
    }

    res.json(facts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facts' });
  }
});

export default router;

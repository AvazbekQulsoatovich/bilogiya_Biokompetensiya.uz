import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Simple mock AI response logic based on keywords
const generateAIResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hujayra') || lowerMsg.includes('cell')) {
    return "Hujayra barcha tirik organizmlarning eng kichik tuzilish va funksional birligidir. Hujayralar yadro, sitoplazma va qobiqdan iborat bo'ladi. Masalan, o'simlik hujayrasi xloroplastlari orqali fotosintez qiladi.";
  }
  if (lowerMsg.includes('dnk') || lowerMsg.includes('gen')) {
    return "DNK (Dezoksiribonuklein kislota) - bu irsiy ma'lumotlarni o'zida saqlaydigan va nasldan naslga o'tkazuvchi murakkab makromolekula. U ikkita spiral zanjirdan iborat bo'lib, adenin, timin, guanin va sitozin nukleotidlaridan tashkil topadi.";
  }
  if (lowerMsg.includes('yurak') || lowerMsg.includes('heart') || lowerMsg.includes('qon')) {
    return "Yurak qon aylanish sistemasining markaziy organi bo'lib, nasos vazifasini bajaradi. Odam yuragi 4 ta bo'lmachadan iborat (2 ta bo'lmacha, 2 ta qorincha). Qon tanaga kislorod va oziq moddalarni tashiydi.";
  }
  if (lowerMsg.includes('salom') || lowerMsg.includes('hello')) {
    return "Assalomu alaykum! Men sizning biologiya bo'yicha virtual yordamchingizman. Qaysi mavzuda savollaringiz bor? Masalan: Hujayra tuzilishi, DNK yoki odam anatomiyasi haqida so'rashingiz mumkin.";
  }
  
  return "Bu juda qiziqarli savol! Biologiyada bunday jarayonlar murakkab mexanizmlarga asoslanadi. Afsuski, hozirgi bazamda bu haqida to'liq ma'lumot yo'q, lekin 'Hujayra', 'DNK' yoki 'Yurak' haqida so'rab ko'rishingiz mumkin.";
};

router.post('/chat', authenticate, (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Simulate network delay for AI "thinking" effect
    setTimeout(() => {
      const responseText = generateAIResponse(message);
      res.json({ reply: responseText });
    }, 1500);

  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;

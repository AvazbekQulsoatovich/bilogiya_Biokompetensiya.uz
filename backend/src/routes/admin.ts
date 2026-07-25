import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Simulated AI Generator
const generateMockAIContent = (type: string, prompt: string): any => {
  const isBiology = prompt.toLowerCase().includes('anatomiya') || prompt.toLowerCase().includes('biolog');
  
  if (type === 'CROSSWORD') {
    return {
      title: isBiology ? "Odam Anatomiyasi" : "Krossvord",
      description: "Sun'iy Intelekt tomonidan tuzilgan boshqotirma",
      items: [
        { word: "YURAK", clue: "Qonni butun tanaga haydovchi a'zo", direction: "HORIZONTAL", row: 0, col: 0 },
        { word: "QON", clue: "Kislorod tashuvchi qizil suyuqlik", direction: "VERTICAL", row: 0, col: 5 }
      ]
    };
  } else if (type === 'LAB') {
    return {
      title: "Yangi Virtual Tajriba",
      description: "AI yordamida yaratilgan laboratoriya",
      rewardXp: 100,
      stepsJson: JSON.stringify([
        {
          title: "1. Mikroskopni tayyorlash",
          instruction: "Asbobni yoqing",
          tools: ["Mikroskop"],
          expectedAction: "POWER_ON"
        }
      ])
    };
  } else if (type === 'GAME') {
    return {
      title: "Xotira: Hujayra organoidlari",
      description: "Bir xil atamalarni toping",
      type: "MEMORY",
      contentJson: JSON.stringify([
        { id: 1, name: "Yadro", emoji: "🧬" },
        { id: 2, name: "Ribosoma", emoji: "🟡" },
        { id: 3, name: "Lizosoma", emoji: "🔴" }
      ])
    };
  } else if (type === 'QUIZ') {
    return {
      title: "AI Test: O'simliklar",
      questions: [
        {
          type: "MULTIPLE_CHOICE",
          content: "Fotosintez qayerda kechadi?",
          options: JSON.stringify(["Mitoxondriya", "Xloroplast", "Yadro", "Vakuola"]),
          correctAnswer: "Xloroplast"
        }
      ]
    };
  }
  return {};
};

// Generate Content via AI
router.post('/generate', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { type, prompt } = req.body;
    if (!type || !prompt) {
      return res.status(400).json({ error: "Type and prompt are required" });
    }

    // Simulate AI thinking time
    setTimeout(() => {
      const generated = generateMockAIContent(type, prompt);
      res.json(generated);
    }, 2000);

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Save Crossword
router.post('/crosswords', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, description, items } = req.body;
    const crossword = await prisma.crossword.create({
      data: {
        title,
        description,
        items: {
          create: items.map((item: any) => ({
            word: item.word,
            clue: item.clue,
            direction: item.direction,
            row: item.row,
            col: item.col
          }))
        }
      }
    });
    res.json(crossword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save crossword' });
  }
});

// Save Game
router.post('/games', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, description, type, contentJson } = req.body;
    const game = await prisma.game.create({
      data: { title, description, type, contentJson }
    });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Save Lab
router.post('/labs', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, description, rewardXp, stepsJson } = req.body;
    const lab = await prisma.lab.create({
      data: { title, description, rewardXp: Number(rewardXp), stepsJson }
    });
    res.json(lab);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save lab' });
  }
});

// Save Quiz
router.post('/quizzes', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, questions } = req.body;
    
    // Create a dummy lesson if none exists to attach the quiz to
    let lesson = await prisma.lesson.findFirst();
    if (!lesson) {
      let course = await prisma.course.findFirst();
      if (!course) {
        course = await prisma.course.create({ data: { title: "AI Course", gradeLevel: 10 } });
      }
      lesson = await prisma.lesson.create({ data: { title: "AI Lesson", contentMd: "...", courseId: course.id } });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        lessonId: lesson.id,
        questions: {
          create: questions.map((q: any) => ({
            type: q.type,
            content: q.content,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        }
      }
    });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save quiz' });
  }
});

export default router;

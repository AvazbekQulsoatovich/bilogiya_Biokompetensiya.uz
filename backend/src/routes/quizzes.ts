import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: true,
        _count: {
          select: { questions: true }
        }
      }
    });
    // Create mock if empty
    if (quizzes.length === 0) {
      const lesson = await prisma.lesson.findFirst() || await prisma.lesson.create({
        data: {
          title: "Dummy Lesson",
          contentMd: "Mock",
          course: {
            create: { title: "Biology 101", gradeLevel: 10 }
          }
        }
      });
      const mockQuiz = await prisma.quiz.create({
        data: {
          title: "Hujayra tuzilishi bo'yicha test",
          lessonId: lesson.id,
          questions: {
            create: [
              { type: 'MULTIPLE_CHOICE', content: 'Hujayraning quvvat stansiyasi nima?', options: JSON.stringify(['Yadro', 'Mitoxondriya', 'Vakuola', 'Ribosoma']), correctAnswer: 'Mitoxondriya' },
              { type: 'MULTIPLE_CHOICE', content: 'Oqsillar qayerda sintezlanadi?', options: JSON.stringify(['Yadro', 'Mitoxondriya', 'Vakuola', 'Ribosoma']), correctAnswer: 'Ribosoma' }
            ]
          }
        },
        include: { lesson: true, _count: { select: { questions: true } } }
      });
      return res.json([mockQuiz]);
    }
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get a single quiz with questions
router.get('/:id', async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true }
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    // Hide correct answers from the response payload for safety (or keep them if checking on frontend)
    // For this simple version, we'll keep them so frontend can evaluate.
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Submit quiz answers and get XP
router.post('/:id/submit', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { score, timeSpentSeconds, answers } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Calculate XP based on score
    const rewardXp = Math.round(score); // 1 score = 1 XP
    
    // Update progress
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: rewardXp } }
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: id,
        score,
        timeSpentSeconds,
        answers: JSON.stringify(answers)
      }
    });

    res.json({ success: true, attempt, rewardXp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Admin: Create Quiz
router.post('/', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, lessonId, questions } = req.body;
    const actualLessonId = lessonId || (await prisma.lesson.findFirst())?.id;
    
    const quiz = await prisma.quiz.create({
      data: {
        title,
        lessonId: actualLessonId,
        questions: {
          create: questions
        }
      }
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

export default router;

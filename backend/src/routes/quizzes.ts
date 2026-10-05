import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { grantXp } from '../lib/xp';

const router = Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: { include: { course: true } },
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
      where: { id: req.params.id as string },
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

// Javoblarni yuborish: ball serverda qayta hisoblanadi, XP faqat yaxshilangan natija uchun beriladi
router.post('/:id/submit', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const userId = req.user.id as string;
    const answers = req.body?.answers && typeof req.body.answers === 'object' ? req.body.answers : {};
    const spent = Number(req.body?.timeSpentSeconds);
    const timeSpentSeconds = Number.isFinite(spent) ? Math.max(0, Math.min(86400, Math.round(spent))) : 0;

    const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Har bir toʻgʻri javob = 10 ball
    let correct = 0;
    for (const q of quiz.questions) if (answers[q.id] === q.correctAnswer) correct += 1;
    const score = correct * 10;

    const prev = await prisma.quizAttempt.findMany({ where: { userId, quizId: id }, select: { score: true } });
    const best = prev.reduce((m, a) => Math.max(m, a.score), 0);
    const rewardXp = Math.max(0, score - best);

    const attempt = await prisma.quizAttempt.create({
      data: { userId, quizId: id, score, timeSpentSeconds, answers: JSON.stringify(answers) }
    });
    const progress = await grantXp(userId, rewardXp);

    res.json({ success: true, attempt, score, correct, total: quiz.questions.length, rewardXp, progress });
  } catch (error) {
    console.error('Quiz submit error:', (error as Error).message);
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

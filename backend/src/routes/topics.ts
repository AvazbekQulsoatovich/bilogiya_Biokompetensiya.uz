import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all topics (lessons)
router.get('/', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        attachments: true,
        course: true
      }
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get a single topic by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        attachments: true,
        course: true
      }
    });
    if (!lesson) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Create a topic (lesson)
router.post('/', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, contentMd, gradeLevel } = req.body;

    const targetGrade = gradeLevel ? Number(gradeLevel) : 5; // Default to 5-sinf

    let actualCourseId;
    const course = await prisma.course.findFirst({
      where: { gradeLevel: targetGrade }
    });
    
    if (course) {
      actualCourseId = course.id;
    } else {
      const newCourse = await prisma.course.create({
        data: { title: `${targetGrade}-sinf Biologiya`, gradeLevel: targetGrade, description: `${targetGrade}-sinf darsligi` }
      });
      actualCourseId = newCourse.id;
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title || 'New Topic',
        contentMd: contentMd || 'Content goes here...',
        courseId: actualCourseId
      }
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// Update a topic (e.g. add videoUrl, edit title/grade)
router.put('/:id', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    const { videoUrl, title, gradeLevel } = req.body;
    const updateData: any = {};
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (title !== undefined) updateData.title = title;
    
    if (gradeLevel !== undefined) {
      const targetGrade = Number(gradeLevel);
      let course = await prisma.course.findFirst({ where: { gradeLevel: targetGrade } });
      if (!course) {
        course = await prisma.course.create({
          data: { title: `${targetGrade}-sinf Biologiya`, gradeLevel: targetGrade, description: `${targetGrade}-sinf darsligi` }
        });
      }
      updateData.courseId = course.id;
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData
    });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// Delete a topic
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.attachment.deleteMany({ where: { lessonId: id } });
    await prisma.quiz.deleteMany({ where: { lessonId: id } }); // Quizzes related to this lesson might need cascading
    const lesson = await prisma.lesson.delete({
      where: { id }
    });
    res.json({ message: 'Deleted successfully', lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

export default router;

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
        attachments: true
      }
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Create a topic (lesson)
router.post('/', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, contentMd, courseId } = req.body;

    // Default to a dummy course if not provided
    let actualCourseId = courseId;
    if (!actualCourseId) {
      const course = await prisma.course.findFirst();
      if (course) {
        actualCourseId = course.id;
      } else {
        const newCourse = await prisma.course.create({
          data: { title: 'General Biology', gradeLevel: 10, description: 'Default Course' }
        });
        actualCourseId = newCourse.id;
      }
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

// Update a topic (e.g. add videoUrl)
router.put('/:id', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: { videoUrl }
    });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

export default router;

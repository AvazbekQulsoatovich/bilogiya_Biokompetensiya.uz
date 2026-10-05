import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Configure storage
const ALLOWED: Record<string, string[]> = {
  '.jpg': ['image/jpeg'], '.jpeg': ['image/jpeg'], '.png': ['image/png'], '.webp': ['image/webp'], '.gif': ['image/gif'],
  '.pdf': ['application/pdf'], '.mp4': ['video/mp4'], '.webm': ['video/webm'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024, files: 1 },
  // Faqat ruxsat etilgan turlar (HTML/JS/exe va h.k. yuklanmaydi)
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const ok = !!ALLOWED[ext] && ALLOWED[ext].includes(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error('Bu turdagi fayl ruxsat etilmagan.') as any, false);
  },
});

const guard = [authenticate, authorize(['SUPER_ADMIN'])];

// Generic file upload (for books, avatars, etc.)
router.post('/file', ...guard, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ fileUrl });
  } catch (error) {
    console.error('Generic upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload attachment to a lesson
router.post('/:lessonId', ...guard, upload.single('file'), async (req, res) => {
  try {
    const lessonId = req.params.lessonId as string;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Ensure lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      // Clean up file if lesson doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;
    const fileName = req.file.originalname;

    const attachment = await prisma.attachment.create({
      data: {
        lessonId,
        fileName,
        fileUrl,
        fileType
      }
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload main video to a lesson
router.post('/video/:lessonId', ...guard, upload.single('file'), async (req, res) => {
  try {
    const lessonId = req.params.lessonId as string;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Ensure lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      // Clean up file if lesson doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoUrl: fileUrl }
    });

    res.status(201).json(updatedLesson);
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});



// Get attachments for a lesson
router.get('/:lessonId', async (req, res) => {
  try {
    const lessonId = req.params.lessonId as string;
    
    const attachments = await prisma.attachment.findMany({
      where: { lessonId }
    });

    res.json(attachments);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

// Delete attachment
router.delete('/attachment/:id', ...guard, async (req, res) => {
  try {
    const id = req.params.id as string;
    
    const attachment = await prisma.attachment.findUnique({
      where: { id }
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Delete file
    const filePath = path.join(__dirname, '../..', 'uploads', path.basename(attachment.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete DB record
    await prisma.attachment.delete({
      where: { id }
    });

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

export default router;

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Configure storage
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
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload attachment to a lesson
router.post('/:lessonId', upload.single('file'), async (req, res) => {
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
router.delete('/attachment/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    
    const attachment = await prisma.attachment.findUnique({
      where: { id }
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Delete file
    const filePath = path.join(__dirname, '../..', attachment.fileUrl);
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

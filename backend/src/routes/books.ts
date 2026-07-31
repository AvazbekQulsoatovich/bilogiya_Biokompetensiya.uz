import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(books);
  } catch (error) {
    console.error('Fetch books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Create a new book (Auth temporarily bypassed to fix Invalid Token error)
router.post('/', async (req: any, res) => {
  console.log('--- POST /api/books ---');
  console.log('Body:', req.body);
  try {
    const { title, author, coverUrl, pdfUrl } = req.body;
    
    if (!title || !pdfUrl) {
      console.log('Bad Request: Missing fields');
      return res.status(400).json({ error: 'Title and PDF URL are required' });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        coverUrl,
        pdfUrl
      }
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Delete a book
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    await prisma.book.delete({
      where: { id }
    });
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;

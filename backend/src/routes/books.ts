import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(books);
  } catch (error) {
    console.error('Fetch books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Create a new book
router.post('/', authenticate, authorize(['SUPER_ADMIN']), async (req: any, res) => {
  try {
    const { title, author, coverUrl, pdfUrl } = req.body;
    if (!title || !pdfUrl) {
      return res.status(400).json({ error: 'Title and PDF URL are required' });
    }
    const book = await prisma.book.create({ data: { title, author, coverUrl, pdfUrl } });
    res.status(201).json(book);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Update a book
router.put('/:id', authenticate, authorize(['SUPER_ADMIN']), async (req: any, res) => {
  try {
    const { title, author, coverUrl, pdfUrl } = req.body;
    const book = await prisma.book.update({
      where: { id: req.params.id as string },
      data: { title, author, coverUrl, pdfUrl }
    });
    res.json(book);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete a book
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), async (req: any, res) => {
  try {
    await prisma.book.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;

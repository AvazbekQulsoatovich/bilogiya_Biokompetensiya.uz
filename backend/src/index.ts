import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import topicsRoutes from './routes/topics';
import labsRoutes from './routes/labs';
import quizzesRoutes from './routes/quizzes';
import crosswordsRoutes from './routes/crosswords';
import tutorRoutes from './routes/tutor';
import leaderboardRoutes from './routes/leaderboard';
import achievementsRoutes from './routes/achievements';
import progressRoutes from './routes/progress';
import glossaryRoutes from './routes/glossary';
import factsRoutes from './routes/facts';
import adminRoutes from './routes/admin';
import gamesRoutes from './routes/games';
import extracurricularRoutes from './routes/extracurricular';
import booksRoutes from './routes/books';
import { jwtSecret } from './middleware/auth';
import { rateLimit } from './middleware/rateLimit';

jwtSecret(); // zaif/yoʻq sir boʻlsa, darhol toʻxtaydi

const app = express();
const PORT = process.env.PORT || 5000;

// nginx orqasida: haqiqiy IP X-Forwarded-For dan olinadi
app.set('trust proxy', 1);
app.disable('x-powered-by');

const ORIGINS = ['https://biokompetensiya.uz', 'https://www.biokompetensiya.uz', 'http://biokompetensiya.uz', 'http://localhost:3000', 'http://localhost:3100'];
app.use(cors({ origin: (o, cb) => cb(null, !o || ORIGINS.includes(o)) }));

// Xavfsizlik sarlavhalari
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.use(rateLimit({ windowMs: 60_000, max: 600 }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Yuklangan fayllar
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), { index: false, dotfiles: 'deny' }));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/crosswords', crosswordsRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/glossary', glossaryRoutes);
app.use('/api/facts', factsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/extracurricular', extracurricularRoutes);
app.use('/api/books', booksRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BioEdu API is running' });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Topilmadi' }));

// Yagona xato ishlovchi (ichki tafsilotlar mijozga chiqmaydi)
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Soʻrov juda katta.' });
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Soʻrov formati notoʻgʻri.' });
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Fayl juda katta.' });
  if (err?.message === 'Bu turdagi fayl ruxsat etilmagan.') return res.status(400).json({ error: err.message });
  console.error('Unhandled error:', err?.message || err);
  res.status(500).json({ error: 'Serverda xatolik yuz berdi.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

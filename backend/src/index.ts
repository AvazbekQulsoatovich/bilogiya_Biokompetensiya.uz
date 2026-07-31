import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BioEdu API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

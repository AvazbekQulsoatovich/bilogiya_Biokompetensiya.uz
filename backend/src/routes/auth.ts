import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { authMiddleware, signToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max = 60) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const publicUser = (u: any) => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  avatarUrl: u.avatarUrl,
  role: u.role,
  xp: u.xp,
  level: u.level,
  streak: u.streak,
});

const regLimit = rateLimit({ windowMs: 15 * 60_000, max: 12 });
const loginLimit = rateLimit({ windowMs: 15 * 60_000, max: 15, key: (r) => String(r.body?.email || '').toLowerCase() });

router.post('/register', regLimit, async (req, res) => {
  try {
    const email = clean(req.body?.email, 120).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const firstName = clean(req.body?.firstName, 50);
    const lastName = clean(req.body?.lastName, 50);

    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Email manzili notoʻgʻri." });
    if (password.length < 6 || password.length > 100) return res.status(400).json({ error: "Parol kamida 6 ta belgidan iborat boʻlishi kerak." });
    if (!firstName) return res.status(400).json({ error: "Ismingizni kiriting." });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Bu email bilan roʻyxatdan oʻtilgan. Kirish sahifasiga oʻting." });

    const passwordHash = await bcrypt.hash(password, 10);
    // Rol har doim STUDENT — mijoz rolni tanlay olmaydi.
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName: lastName || '-', role: 'STUDENT' },
    });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    console.error('Register error:', (error as Error).message);
    res.status(500).json({ error: "Roʻyxatdan oʻtishda xatolik. Keyinroq urinib koʻring." });
  }
});

router.post('/login', loginLimit, async (req, res) => {
  try {
    const email = clean(req.body?.email, 120).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !ok) return res.status(400).json({ error: "Email yoki parol notoʻgʻri." });
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', (error as Error).message);
    res.status(500).json({ error: "Kirishda xatolik. Keyinroq urinib koʻring." });
  }
});

router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(401).json({ error: "Foydalanuvchi topilmadi. Qayta kiring." });
    res.json(publicUser(user));
  } catch {
    res.status(500).json({ error: 'Profilni yuklab boʻlmadi.' });
  }
});

router.put('/profile', authMiddleware, async (req: any, res) => {
  try {
    const data: any = {};
    const firstName = clean(req.body?.firstName, 50);
    const lastName = clean(req.body?.lastName, 50);
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;

    if (typeof req.body?.avatarUrl === 'string') {
      const a = req.body.avatarUrl.trim();
      if (a && !/^\/uploads\/[\w.\-]+$/.test(a)) return res.status(400).json({ error: "Rasm manzili notoʻgʻri." });
      data.avatarUrl = a || null;
    }

    const me = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!me) return res.status(401).json({ error: 'Qayta kiring.' });

    if (typeof req.body?.email === 'string' && req.body.email.trim().toLowerCase() !== me.email) {
      const email = req.body.email.trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Email manzili notoʻgʻri." });
      if (await prisma.user.findUnique({ where: { email } })) return res.status(400).json({ error: "Bu email band." });
      data.email = email;
    }

    const newPass = typeof req.body?.password === 'string' ? req.body.password : '';
    if (newPass) {
      if (newPass.length < 6) return res.status(400).json({ error: "Yangi parol kamida 6 ta belgi boʻlsin." });
      const cur = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
      if (!(await bcrypt.compare(cur, me.passwordHash))) return res.status(400).json({ error: "Joriy parol notoʻgʻri." });
      data.passwordHash = await bcrypt.hash(newPass, 10);
    }

    const updated = await prisma.user.update({ where: { id: me.id }, data });
    res.json(publicUser(updated));
  } catch (error) {
    console.error('Profile update error:', (error as Error).message);
    res.status(500).json({ error: 'Profilni yangilab boʻlmadi.' });
  }
});

export default router;

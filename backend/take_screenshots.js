const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforbioedu';
const token = jwt.sign({ id: 'ed71be41-d371-4a45-a0cd-ed8d7b590a51', role: 'SUPER_ADMIN' }, JWT_SECRET, { expiresIn: '1d' });
const userObj = { id: 'ed71be41-d371-4a45-a0cd-ed8d7b590a51', firstName: 'Jahongir', lastName: 'Omonov', email: 'admin@gmail.com', role: 'SUPER_ADMIN' };

const routes = [
  { path: '/dashboard', name: 'dashboard.png' },
  { path: '/profile', name: 'profile.png' },
  { path: '/topics', name: 'topics.png' },
  { path: '/books', name: 'books.png' },
  { path: '/labs', name: 'labs.png' },
  { path: '/models', name: 'models.png' },
  { path: '/quizzes', name: 'quizzes.png' },
  { path: '/extracurricular', name: 'extracurricular.png' },
  { path: '/crosswords', name: 'crosswords.png' },
  { path: '/games', name: 'games.png' },
  { path: '/tutor', name: 'tutor.png' },
  { path: '/glossary', name: 'glossary.png' },
  { path: '/facts', name: 'facts.png' },
  { path: '/progress', name: 'progress.png' },
  { path: '/achievements', name: 'achievements.png' },
  { path: '/leaderboard', name: 'leaderboard.png' },
  { path: '/goals', name: 'goals.png' },
  { path: '/settings', name: 'settings.png' },
  { path: '/admin', name: 'admin.png' }
];

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Setting up auth via API login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    
    // Inject CSS to disable animations and force opacity for clean screenshots
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .glass, [style*="opacity: 0"] {
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Perform API login directly
    await page.evaluate(async () => {
      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
      });
      if (!res.ok) {
        throw new Error('API Login failed');
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
    });

    console.log('API Login successful!');

    const outDir = path.join(__dirname, '../frontend/public/screenshots');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    for (const route of routes) {
      console.log(`Taking screenshot of ${route.path}...`);
      await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'domcontentloaded' });
      
      // Wait for React to re-render, data to fetch, and animations to finish
      await new Promise(r => setTimeout(r, 4000));
      
      await page.screenshot({ path: path.join(outDir, route.name) });
    }

    await browser.close();
    console.log('Successfully updated all screenshots!');
  } catch (error) {
    console.error('Error taking screenshots:', error);
    process.exit(1);
  }
})();

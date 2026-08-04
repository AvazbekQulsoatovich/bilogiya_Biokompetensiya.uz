const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

  console.log('Logging in...');
  await page.type('input[type="email"]', 'admin@bioedu.uz');
  await page.type('input[type="password"]', 'admin');
  
  await page.click('button[type="submit"]');

  console.log('Waiting for navigation...');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));

  const routes = [
    { url: 'http://localhost:3000/dashboard', name: 'dashboard' },
    { url: 'http://localhost:3000/profile', name: 'profile' },
    { url: 'http://localhost:3000/topics', name: 'topics' },
    { url: 'http://localhost:3000/books', name: 'books' },
    { url: 'http://localhost:3000/labs', name: 'labs' },
    { url: 'http://localhost:3000/models', name: 'models' },
    { url: 'http://localhost:3000/quizzes', name: 'quizzes' },
    { url: 'http://localhost:3000/extracurricular', name: 'extracurricular' },
    { url: 'http://localhost:3000/crosswords', name: 'crosswords' },
    { url: 'http://localhost:3000/games', name: 'games' },
    { url: 'http://localhost:3000/tutor', name: 'tutor' },
    { url: 'http://localhost:3000/glossary', name: 'glossary' },
    { url: 'http://localhost:3000/facts', name: 'facts' },
    { url: 'http://localhost:3000/progress', name: 'progress' },
    { url: 'http://localhost:3000/achievements', name: 'achievements' },
    { url: 'http://localhost:3000/leaderboard', name: 'leaderboard' },
    { url: 'http://localhost:3000/goals', name: 'goals' },
    { url: 'http://localhost:3000/settings', name: 'settings' },
    { url: 'http://localhost:3000/admin', name: 'admin' }
  ];

  for (const route of routes) {
    console.log(`Taking screenshot of ${route.name}...`);
    try {
      await page.goto(route.url, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(screenshotsDir, `${route.name}.png`), fullPage: true });
    } catch (e) {
      console.log(`Error on ${route.name}: ${e.message}`);
    }
  }

  console.log('Done!');
  await browser.close();
})();

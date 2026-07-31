const fs = require('fs');
const path = require('path');

const NEW_API = 'http://localhost:5000';
const OLD_API = 'https://biology-backend-vw8k.onrender.com';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(OLD_API)) {
        // Replace all exact instances of the old API URL
        const newContent = content.split(OLD_API).join(NEW_API);
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated:', fullPath);
      }
    }
  }
}

replaceInDir('c:/Users/user/Desktop/biology/frontend/src');
console.log('Done!');

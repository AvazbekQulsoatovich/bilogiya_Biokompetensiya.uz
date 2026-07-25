const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'topics', title: 'Mavzular', icon: 'BookOpen', desc: 'Biologiya fanidan darsliklar va o`quv materiallari.' },
  { path: 'labs', title: 'Virtual Laboratoriyalar', icon: 'Microscope', desc: 'Tajribalarni virtual muhitda o`tkazish.' },
  { path: 'models', title: '3D Modellar', icon: 'Box', desc: 'Biologik obyektlarning 3D modellari.' },
  { path: 'quizzes', title: 'Test Topshiriqlari', icon: 'ClipboardList', desc: 'Bilimingizni sinab ko`ring va XP ishlang.' },
  { path: 'crosswords', title: 'Krossvordlar', icon: 'LayoutGrid', desc: 'Atamalarni topish orqali xotirani mashq qiling.' },
  { path: 'games', title: 'O`yinlar', icon: 'Gamepad2', desc: 'Qiziqarli o`quv o`yinlari.' },
  { path: 'tutor', title: 'AI Yordamchi', icon: 'BrainCircuit', desc: 'Sun`iy idrok yordamchisidan savollaringizga javob oling.' },
  { path: 'glossary', title: 'Lug`at', icon: 'Library', desc: 'Biologik atamalar lug`ati.' },
  { path: 'facts', title: 'Qiziqarli Faktlar', icon: 'Lightbulb', desc: 'Biologiya olamidagi qiziqarli faktlar.' },
  { path: 'progress', title: 'O`zlashtirish', icon: 'Activity', desc: 'Sizning o`zlashtirish va faollik grafikingiz.' },
  { path: 'achievements', title: 'Yutuqlar', icon: 'Trophy', desc: 'Qo`lga kiritgan nishonlaringiz va medallaringiz.' },
  { path: 'leaderboard', title: 'Reyting', icon: 'Medal', desc: 'Kuchli o`quvchilar ro`yxati.' },
  { path: 'goals', title: 'Mening Maqsadlarim', icon: 'Target', desc: 'O`zingiz uchun belgilagan maqsadlar.' },
  { path: 'settings', title: 'Sozlamalar', icon: 'Settings', desc: 'Profil va tizim sozlamalari.' }
];

const basePath = path.join(__dirname, 'src', 'app');

pages.forEach(page => {
  const dirPath = path.join(basePath, page.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `"use client";

import { motion } from "framer-motion";
import { ${page.icon} } from "lucide-react";

export default function ${page.path.charAt(0).toUpperCase() + page.path.slice(1)}Page() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl border border-border/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-500/10 rounded-2xl">
            <${page.icon} className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">${page.title}</h1>
            <p className="text-foreground/60 mt-1">${page.desc}</p>
          </div>
        </div>

        <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-background/30">
          <p className="text-foreground/40 font-medium">Ushbu bo'lim tez orada ishga tushadi...</p>
        </div>
      </motion.div>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
  console.log(`Created ${page.path}/page.tsx`);
});

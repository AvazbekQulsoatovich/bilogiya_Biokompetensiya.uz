import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crossword definitions
const crosswordsData = [
  {
    title: "1. O'simliklar olami (5-sinf)",
    description: "O'simliklarning asosiy organlari haqida",
    items: [
      { word: "POYA", clue: "O'simlikning yer ustki tayanch organi", direction: "HORIZONTAL", row: 2, col: 1 },
      { word: "BARG", clue: "Fotosintez jarayoni o'tadigan yashil organ", direction: "VERTICAL", row: 1, col: 4 }, // POYA 'A' is (2,4). BARG 'A' is (2,4).
      { word: "GUL", clue: "O'simlikning ko'payish organi", direction: "HORIZONTAL", row: 4, col: 4 }, // BARG 'G' is (4,4). GUL 'G' is (4,4).
      { word: "URUG", clue: "Guddan keyin hosil bo'ladigan ko'payish qismi", direction: "VERTICAL", row: 4, col: 5 }, // GUL 'U' is (4,5). URUG 'U' is (4,5).
      { word: "TUXUM", clue: "Urug'chi ichidagi qism", direction: "HORIZONTAL", row: 6, col: 3 }, // URUG 'U' is (6,5). TUXUM 'U' is (6,4) and (6,6) wait.
      // Let's refine TUXUM: (6,2) T, (6,3) U, (6,4) X, (6,5) U, (6,6) M. Intersects URUG at (6,5) 'U'. Works!
    ]
  },
  {
    title: "2. Hujayra sirlari (5-sinf)",
    description: "Hujayra tuzilishi va uning organoidlari",
    items: [
      { word: "YADRO", clue: "Hujayraning boshqaruv markazi", direction: "HORIZONTAL", row: 3, col: 2 },
      { word: "MEMBRANA", clue: "Hujayrani tashqaridan o'rab turuvchi qobiq", direction: "VERTICAL", row: 0, col: 6 }, // YADRO 'O' is (3,6). MEMBRANA (0,6)=M, (1,6)=E, (2,6)=M, (3,6)=B. Wait, 'O' != 'B'.
    ]
  },
  // To avoid manual intersection errors, I'll use a simple auto-layout logic for a few predefined grids.
];

// Let's just define them perfectly.

const manualCrosswords = [
  {
    title: "1. O'simliklar olami (5-sinf)",
    description: "O'simlik organlari bo'yicha bilimlaringizni sinang",
    items: [
      { word: "POYA", clue: "O'simlikning yer ustki tayanch organi", direction: "HORIZONTAL", row: 2, col: 1 },
      { word: "BARG", clue: "Fotosintez jarayoni kechadigan qism", direction: "VERTICAL", row: 1, col: 4 },
      { word: "GULLAR", clue: "O'simliklarning chiroyi", direction: "HORIZONTAL", row: 4, col: 4 },
      { word: "URUG", clue: "Yangi o'simlik unib chiqadigan qism", direction: "VERTICAL", row: 4, col: 5 }
    ]
  },
  {
    title: "2. Hujayra tuzilishi (5-sinf)",
    description: "Hujayraning ichki qismlarini toping",
    items: [
      { word: "YADRO", clue: "Hujayra markazi, boshqaruvchi", direction: "HORIZONTAL", row: 3, col: 2 },
      { word: "POBIQ", clue: "Hujayra devori yoki...", direction: "VERTICAL", row: 1, col: 6 }, // (3,6) is O from YADRO
      { word: "SHIRA", clue: "Hujayra ichidagi suyuqlik (vakuolada)", direction: "HORIZONTAL", row: 1, col: 6 }, // S
    ] // Actually, let's just make non-intersecting crosswords if needed, but the UI expects intersections.
  }
];

// Better approach: Write a simple crossword generator algorithm.
function generateCrosswordItems(wordsWithClues: {word: string, clue: string}[]) {
  const items: any[] = [];
  const grid: string[][] = Array(20).fill(null).map(() => Array(20).fill(''));

  for (const {word, clue} of wordsWithClues) {
    let placed = false;
    const w = word.toUpperCase();
    
    if (items.length === 0) {
      // Place first word in middle horizontally
      const row = 10;
      const col = 10 - Math.floor(w.length / 2);
      for (let i = 0; i < w.length; i++) grid[row][col + i] = w[i];
      items.push({ word: w, clue, direction: "HORIZONTAL", row, col });
      continue;
    }

    // Try to intersect with existing items
    for (const item of items) {
      if (placed) break;
      for (let i = 0; i < item.word.length; i++) {
        if (placed) break;
        const letter = item.word[i];
        
        // Find if this letter exists in the new word
        const matchIdx = w.indexOf(letter);
        if (matchIdx !== -1) {
          // Try to place it intersecting here
          const isHoriz = item.direction === "HORIZONTAL";
          const newDir = isHoriz ? "VERTICAL" : "HORIZONTAL";
          
          let startRow = isHoriz ? item.row - matchIdx : item.row + i;
          let startCol = isHoriz ? item.col + i : item.col - matchIdx;
          
          // Check bounds
          if (startRow < 0 || startCol < 0 || startRow + (newDir === "VERTICAL" ? w.length : 1) > 20 || startCol + (newDir === "HORIZONTAL" ? w.length : 1) > 20) continue;
          
          // Check collision
          let canPlace = true;
          for (let j = 0; j < w.length; j++) {
            const r = startRow + (newDir === "VERTICAL" ? j : 0);
            const c = startCol + (newDir === "HORIZONTAL" ? j : 0);
            if (grid[r][c] !== '' && grid[r][c] !== w[j]) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            for (let j = 0; j < w.length; j++) {
              const r = startRow + (newDir === "VERTICAL" ? j : 0);
              const c = startCol + (newDir === "HORIZONTAL" ? j : 0);
              grid[r][c] = w[j];
            }
            items.push({ word: w, clue, direction: newDir, row: startRow, col: startCol });
            placed = true;
          }
        }
      }
    }
    
    // If couldn't intersect, place it somewhere empty (fallback)
    if (!placed) {
      let r = Math.floor(Math.random() * 15);
      let c = Math.floor(Math.random() * 10);
      items.push({ word: w, clue, direction: "HORIZONTAL", row: r, col: c });
    }
  }

  // Normalize grid to start from (0,0) or (1,1)
  let minRow = 20, minCol = 20;
  for (const item of items) {
    if (item.row < minRow) minRow = item.row;
    if (item.col < minCol) minCol = item.col;
  }
  for (const item of items) {
    item.row -= minRow;
    item.col -= minCol;
  }
  
  return items;
}

const quizTopics = [
  {
    title: "1. O'simliklar sirlari (5-sinf)",
    desc: "O'simliklar tuzilishi va hayotiy jarayonlari",
    words: [
      { word: "ILDIZ", clue: "O'simlikning tuproq osti organi" },
      { word: "POYA", clue: "O'simlikning tayanch organi" },
      { word: "BARG", clue: "Fotosintez qiluvchi yashil organ" },
      { word: "GUL", clue: "Ko'payish organi" },
      { word: "URUG", clue: "Yangi avlod kurtagi" }
    ]
  },
  {
    title: "2. Hujayra olami (5-sinf)",
    desc: "Tiriklikning eng kichik birligi",
    words: [
      { word: "YADRO", clue: "Hujayrani boshqaradi" },
      { word: "MEMBRANA", clue: "Hujayrani o'rab turuvchi parda" },
      { word: "VAKUOLA", clue: "Hujayra shirasi saqlanadigan joy" },
      { word: "PLASTIDA", clue: "Faqat o'simlik hujayrasida bo'ladi" },
      { word: "TOQIMA", clue: "Bir xil vazifani bajaruvchi hujayralar to'plami" }
    ]
  },
  {
    title: "3. Hayvonot olami (6-sinf)",
    desc: "Yovvoyi va uy hayvonlari sirlari",
    words: [
      { word: "ZOOLOGIYA", clue: "Hayvonlarni o'rganuvchi fan" },
      { word: "AMYOBA", clue: "Eng oddiy bir hujayrali hayvon" },
      { word: "GIDRA", clue: "Chuchuk suvda yashovchi ko'p hujayrali" },
      { word: "XITIN", clue: "Hasharotlarning tashqi qobig'i" },
      { word: "QANOT", clue: "Uchish organi" }
    ]
  },
  {
    title: "4. Suv havzasi (6-sinf)",
    desc: "Suvda yashovchilar sirlari",
    words: [
      { word: "BALIQ", clue: "Jabralar orqali nafas oluvchi suv hayvoni" },
      { word: "JABRA", clue: "Suvda nafas olish organi" },
      { word: "TUFELKA", clue: "Poyabzalga o'xshash infuzoriya" },
      { word: "BAQA", clue: "Ham suvda, ham quruqlikda yashovchi" },
      { word: "TimsOH", clue: "Katta sudralib yuruvchi suv hayvoni" }
    ]
  },
  {
    title: "5. Qushlar va parvoz (6-sinf)",
    desc: "Osmon egalari haqida krossvord",
    words: [
      { word: "BURGUT", clue: "Katta yirtqich qush" },
      { word: "PAT", clue: "Qushning tanasini qoplab turadi" },
      { word: "LAYLAK", clue: "Bahorda kelib, tomga in quruvchi qush" },
      { word: "TUMSHUQ", clue: "Qushlarning oziqlanish qismi" },
      { word: "KAPTAR", clue: "Xat tashuvchi tinchlik qushi" }
    ]
  },
  {
    title: "6. Ekologiya (5-sinf)",
    desc: "Tabiatni muhofaza qilish",
    words: [
      { word: "TABIAT", clue: "Atrofimizdagi borliq" },
      { word: "SUV", clue: "Hayot manbai" },
      { word: "TUPROQ", clue: "O'simliklar o'sadigan qatlam" },
      { word: "KISLOROD", clue: "Nafas olish uchun kerakli gaz" },
      { word: "OZYQ", clue: "O'sish va rivojlanish uchun energiya manbai" }
    ]
  },
  {
    title: "7. Hasharotlar (6-sinf)",
    desc: "Tabiatning mitti mo'jizalari",
    words: [
      { word: "ASALARI", clue: "Bol va mum yig'uvchi foydali hasharot" },
      { word: "KAPALAK", clue: "Chiroyli qanotli hasharot" },
      { word: "CHUMOLI", clue: "Mehnatkash, jamoa bo'lib yashovchi" },
      { word: "CHIGIRTKA", clue: "O'simliklarni yeb ziyon keltiruvchi" },
      { word: "PASHSHA", clue: "Kasallik tarqatuvchi uchuvchi hasharot" }
    ]
  },
  {
    title: "8. Yovvoyi sutemizuvchilar (6-sinf)",
    desc: "O'rmon va cho'l hayvonlari",
    words: [
      { word: "TULKI", clue: "Ayor o'rmon hayvoni" },
      { word: "AYIQ", clue: "Qishki uyquga ketuvchi polvon" },
      { word: "SHER", clue: "Hayvonlar podshosi" },
      { word: "KIYIK", clue: "Shoxdor va tez yuguruvchi" },
      { word: "QOBON", clue: "Yovvoyi cho'chqa" }
    ]
  },
  {
    title: "9. Zaharli va shifobaxsh (5-sinf)",
    desc: "O'simlik va hayvonlarning xossalari",
    words: [
      { word: "YALPIZ", clue: "Hidi o'tkir, choyi foydali o'simlik" },
      { word: "CHAKANDA", clue: "Tikanli, mevalari shifobaxsh (oblepixa)" },
      { word: "ILON", clue: "Zahari dori bo'ladigan sudralib yuruvchi" },
      { word: "ISIRIQ", clue: "Tutuni mikroblarni o'ldiruvchi o't" },
      { word: "CHAYON", clue: "Dumining uchida zahari bor" }
    ]
  },
  {
    title: "10. Inson va tabiat (5-6 sinflar)",
    desc: "Aralash biologik tushunchalar",
    words: [
      { word: "ANATOMIYA", clue: "Odam tuzilishini o'rganuvchi fan" },
      { word: "YURAK", clue: "Qon aylantiruvchi asosiy a'zo" },
      { word: "MEYA", clue: "Fikrlash va boshqarish organi" },
      { word: "KOZ", clue: "Ko'rish a'zosi" },
      { word: "TERI", clue: "Insonni tashqi muhitdan himoyalovchi qatlam" }
    ]
  }
];

async function main() {
  console.log("Seeding crosswords...");
  
  await prisma.crosswordItem.deleteMany();
  await prisma.crossword.deleteMany();
  
  for (const topic of quizTopics) {
    const items = generateCrosswordItems(topic.words);
    
    await prisma.crossword.create({
      data: {
        title: topic.title,
        description: topic.desc,
        items: {
          create: items
        }
      }
    });
  }
  
  console.log("Successfully created 10 crosswords!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

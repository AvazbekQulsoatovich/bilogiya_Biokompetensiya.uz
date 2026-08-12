process.env.DATABASE_URL = "file:C:/Users/Avaz/Desktop/biology/backend/prisma/dev.db";
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding all missing tables for 5th and 6th grade books...");

  // 1. Glossary (Lug'at)
  await prisma.glossary.createMany({
    data: [
      { term: 'Ekosistema', definition: 'Tirik organizmlar va jonsiz tabiatning o\'zaro ta\'siri natijasida hosil bo\'ladigan tizim.' },
      { term: 'Biosfera', definition: 'Yer yuzidagi barcha tirik organizmlar tarqalgan qavat.' },
      { term: 'Litosfera', definition: 'Yerning qattiq tosh qobig\'i.' },
      { term: 'Fotosintez', definition: 'Yorug\'lik ta\'sirida o\'simliklarda organik moddalar hosil bo\'lish jarayoni.' },
      { term: 'Atmosfera', definition: 'Yerning havo qobig\'i.' }
    ]
  });
  console.log("Glossary seeded.");

  // 2. Facts (Qiziqarli faktlar)
  await prisma.fact.createMany({
    data: [
      { title: 'Inson miyasi', content: 'Inson miyasi tana og\'irligining atigi 2% ni tashkil etsa ham, umumiy energiyaning 20% ni sarflaydi.', category: 'BIOLOGY' },
      { title: 'Daraxtlar aloqasi', content: 'Daraxtlar yer ostidagi qo\'ziqorin tolalari (mikoriza) orqali bir-biri bilan suhbatlasha oladi va ozuqa almashadi.', category: 'BOTANY' },
      { title: 'Bambuk tezligi', content: 'Ba\'zi bambuk turlari bir kunda 90 sm gacha o\'sishi mumkin. Ular tabiatdagi eng tez o\'suvchi o\'simliklardir.', category: 'BOTANY' }
    ]
  });
  console.log("Facts seeded.");

  // 3. Books (Darsliklar)
  await prisma.book.createMany({
    data: [
      { title: "Tabiiy fanlar (5-sinf)", author: "Respublika ta'lim markazi", pdfUrl: "/uploads/books/5-sinf.pdf" },
      { title: "Tabiiy fanlar (6-sinf)", author: "Respublika ta'lim markazi", pdfUrl: "/uploads/books/6-sinf.pdf" }
    ]
  });
  console.log("Books seeded.");

  // 4. ExtracurricularTasks (Darsdan tashqari topshiriqlar)
  await prisma.extracurricularTask.createMany({
    data: [
      { title: 'Uy o\'simligini kuzatish', description: 'Uyingizdagi istalgan bir xona guli yoki o\'simligini 3 kun kuzating. Qanday o\'zgarishlar bo\'layotganini yozing.', xpReward: 100 },
      { title: 'Hasratlilar tahlili', description: 'Hovlidagi chumolilar harakatini kuzatib, ular haqida qisqacha insho yozing.', xpReward: 150 }
    ]
  });
  console.log("Extracurricular Tasks seeded.");

  // 5. Game (Interaktiv mashqlar)
  await prisma.game.createMany({
    data: [
      { 
        title: "Biologiya Atamalari: Xotira O'yini", 
        description: "Rasmlar va ularning nomlarini toping.", 
        type: "MEMORY",
        contentJson: JSON.stringify([
          { word: "Hujayra", image: "/assets/cell.png" },
          { word: "Bakteriya", image: "/assets/bacteria.png" },
          { word: "Virus", image: "/assets/virus.png" }
        ])
      }
    ]
  });
  console.log("Games seeded.");

  // 6. Crossword
  const crossword = await prisma.crossword.create({
    data: {
      title: "Tabiat Krossvordi",
      description: "Tirik tabiat haqida krossvord",
    }
  });
  await prisma.crosswordItem.createMany({
    data: [
      { crosswordId: crossword.id, word: "SUV", clue: "Hayot manbai", direction: "HORIZONTAL", row: 1, col: 1 },
      { crosswordId: crossword.id, word: "KOSMOS", clue: "Yulduzlar makoni", direction: "VERTICAL", row: 1, col: 3 }
    ]
  });
  console.log("Crossword seeded.");

  console.log("All extra tables seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

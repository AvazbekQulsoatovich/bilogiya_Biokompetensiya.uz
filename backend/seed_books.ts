import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Reading extracted book data...");
  const dataPath = path.join(__dirname, 'books_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error("books_data.json not found");
    return;
  }
  
  const booksData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  // Get or Create Course for Grade 6
  let course6 = await prisma.course.findFirst({ where: { gradeLevel: 6 } });
  if (!course6) {
    course6 = await prisma.course.create({
      data: {
        title: '6-sinf Tabiiy fanlar',
        description: '6-sinf uchun tabiiy fanlar darsligi (1-chorak)',
        gradeLevel: 6
      }
    });
  }
  
  console.log("Seeding lessons...");
  
  // Insert lessons
  for (const item of booksData) {
    if (item.gradeLevel === 6) {
      await prisma.lesson.create({
        data: {
          title: item.title.replace(/\n/g, ' ').substring(0, 100),
          contentMd: item.contentMd,
          courseId: course6.id,
        }
      });
    }
  }

  // Create some sample quizzes based on the data
  const lesson = await prisma.lesson.findFirst({ where: { courseId: course6.id }});
  if (lesson) {
    const quiz = await prisma.quiz.create({
      data: {
        title: "Tabiatni o'rganish bo'yicha test",
        lessonId: lesson.id
      }
    });

    await prisma.question.createMany({
      data: [
        {
          quizId: quiz.id,
          type: "MULTIPLE_CHOICE",
          content: "Tabiiy fanlar qaysi ob'ektlarni o'rganadi?",
          options: JSON.stringify(["Faqat tirik organizmlar", "Faqat jonsiz jismlar", "Tirik va jonsiz tabiat hodisalari", "Ijtimoiy hodisalar"]),
          correctAnswer: "Tirik va jonsiz tabiat hodisalari"
        },
        {
          quizId: quiz.id,
          type: "MULTIPLE_CHOICE",
          content: "Qaysi biri o'lchov asbobi hisoblanadi?",
          options: JSON.stringify(["Mikroskop", "Chizg'ich", "Kompas", "Globus"]),
          correctAnswer: "Chizg'ich"
        }
      ]
    });
    
    // Create a Sample Lab
    await prisma.lab.create({
      data: {
        title: "Modda holatini kuzatish",
        description: "Qattiq, suyuq va gaz holatlarini o'rganamiz",
        rewardXp: 50,
        stepsJson: JSON.stringify([
          {
            id: "step1",
            instruction: "Stakandagi suvni idishga quying.",
            item: "suv",
            target: "idish"
          }
        ])
      }
    });
  }
  
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

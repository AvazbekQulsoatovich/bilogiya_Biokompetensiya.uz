import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const topics5 = [
  "Biologiya - hayot haqidagi fan",
  "O'simliklarning hujayraviy tuzilishi",
  "O'simliklarning to'qimalari",
  "Urug' va uning tuzilishi",
  "Ildiz va uning vazifalari"
];

const topics6 = [
  "Zoologiya faniga kirish",
  "Bir hujayrali hayvonlar (Sodda hayvonlar)",
  "Ko'p hujayrali hayvonlar. Bo'shliqichlilar",
  "Yassi chuvalchanglar",
  "To'garak chuvalchanglar"
];

async function main() {
  // 5-sinf uchun
  let course5 = await prisma.course.findFirst({ where: { gradeLevel: 5 } });
  if (!course5) {
    course5 = await prisma.course.create({
      data: { title: '5-sinf Botanika', gradeLevel: 5, description: '5-sinf darsligi' }
    });
  }

  for (const title of topics5) {
    await prisma.lesson.create({
      data: {
        title,
        contentMd: `# ${title}\nBu yerda mavzu bo'yicha ma'lumotlar bo'ladi...`,
        courseId: course5.id
      }
    });
  }

  // 6-sinf uchun
  let course6 = await prisma.course.findFirst({ where: { gradeLevel: 6 } });
  if (!course6) {
    course6 = await prisma.course.create({
      data: { title: '6-sinf Biologiya', gradeLevel: 6, description: '6-sinf darsligi' }
    });
  }

  for (const title of topics6) {
    await prisma.lesson.create({
      data: {
        title,
        contentMd: `# ${title}\nBu yerda mavzu bo'yicha ma'lumotlar bo'ladi...`,
        courseId: course6.id
      }
    });
  }

  console.log('Mavzular muvaffaqiyatli qo\'shildi!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

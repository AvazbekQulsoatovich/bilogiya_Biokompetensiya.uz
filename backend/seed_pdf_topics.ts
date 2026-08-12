import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PDF pages as topics...");

  // First, find or create the courses
  let course5 = await prisma.course.findFirst({ where: { title: "5-sinf Botanika" }});
  if (!course5) {
    course5 = await prisma.course.create({ data: { title: "5-sinf Botanika", description: "5-sinf o'quvchilari uchun", gradeLevel: 5 }});
  }

  // Not deleting existing topics so we keep the quizzes and labs intact.

  // 5th grade has 59 pages (images grade5_p0_0.png to grade5_p58_0.png usually, or jpg)
  const uploadsDir = path.join(__dirname, 'uploads', 'images');
  const files = fs.readdirSync(uploadsDir);
  
  const grade5Files = files.filter(f => f.startsWith('grade5_p')).sort((a, b) => {
    // extract page number
    const numA = parseInt(a.split('_p')[1].split('_')[0]);
    const numB = parseInt(b.split('_p')[1].split('_')[0]);
    return numA - numB;
  });

  let lessonOrder = 1;
  for (const file of grade5Files) {
    const pageNum = parseInt(file.split('_p')[1].split('_')[0]) + 1;
    
    // Skip cover pages if we want, but let's just add all of them.
    await prisma.lesson.create({
      data: {
        title: `${pageNum}-sahifa darsligi`,
        contentMd: `Ushbu mavzu darslikning ${pageNum}-sahifasidan olingan.\n\n![Sahifa rasm](http://localhost:5000/uploads/images/${file})`,
        courseId: course5.id,
      }
    });
  }
  
  console.log(`Created ${grade5Files.length} topics for 5-sinf.`);

  // 6th grade
  let course6 = await prisma.course.findFirst({ where: { title: "6-sinf Biologiya" }});
  if (!course6) {
    course6 = await prisma.course.create({ data: { title: "6-sinf Biologiya", description: "6-sinf o'quvchilari uchun", gradeLevel: 6 }});
  }
  
  // Not deleting existing topics

  const grade6Files = files.filter(f => f.startsWith('grade6_p')).sort((a, b) => {
    const numA = parseInt(a.split('_p')[1].split('_')[0]);
    const numB = parseInt(b.split('_p')[1].split('_')[0]);
    return numA - numB;
  });

  for (const file of grade6Files) {
    const pageNum = parseInt(file.split('_p')[1].split('_')[0]) + 1;
    await prisma.lesson.create({
      data: {
        title: `${pageNum}-sahifa darsligi`,
        contentMd: `Ushbu mavzu darslikning ${pageNum}-sahifasidan olingan.\n\n![Sahifa rasm](http://localhost:5000/uploads/images/${file})`,
        courseId: course6.id,
      }
    });
  }

  console.log(`Created ${grade6Files.length} topics for 6-sinf.`);
  console.log("Seeding complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

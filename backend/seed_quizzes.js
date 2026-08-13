const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { course: { gradeLevel: 6 } }
  });
  
  console.log(`Found ${lessons.length} lessons for 6-sinf`);
  
  let created = 0;
  for (let i = 0; i < Math.min(lessons.length, 50); i++) {
    const lesson = lessons[i];
    
    // Create quiz for this lesson
    const quiz = await prisma.quiz.create({
      data: {
        title: `${lesson.title} - Test`,
        lessonId: lesson.id,
      }
    });
    
    // Add 10 questions
    for (let j = 1; j <= 10; j++) {
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          content: `${lesson.title} bo'yicha ${j}-savol?`,
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify(['A variant', 'B variant', 'C variant', 'D variant']),
          correctAnswer: 'A variant'
        }
      });
    }
    created++;
  }
  console.log(`Created ${created} quizzes for 6-sinf`);
}

main().finally(() => prisma.$disconnect());

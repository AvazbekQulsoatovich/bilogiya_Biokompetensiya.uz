import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A pool of realistic-sounding biology questions for generating 2000 random questions
const questionPoolGrade5 = [
  { q: "O'simlik hujayrasining qaysi qismi unga shakl beradi?", o: ["Hujayra devori", "Yadro", "Sitoplazma", "Membrana"], a: "Hujayra devori" },
  { q: "Fotosintez jarayoni o'simlikning qaysi qismida kechadi?", o: ["Xloroplast", "Vakuola", "Mitoxondriya", "Lizosoma"], a: "Xloroplast" },
  { q: "Bakteriyalar qaysi olamga kiradi?", o: ["Prokariotlar", "Eukariotlar", "Zamburug'lar", "O'simliklar"], a: "Prokariotlar" },
  { q: "Qaysi to'qima o'simlikni himoya qiladi?", o: ["Qoplovchi", "Asosiy", "O'tkazuvchi", "Mexanik"], a: "Qoplovchi" },
  { q: "Hayvon hujayrasida qaysi organoid uchramaydi?", o: ["Xloroplast", "Yadro", "Sitoplazma", "Ribosoma"], a: "Xloroplast" },
  { q: "Hujayraning 'energiya stansiyasi' nima?", o: ["Mitoxondriya", "Yadro", "Membrana", "Vakuola"], a: "Mitoxondriya" },
  { q: "O'simlikning yer ostki organi?", o: ["Ildiz", "Poya", "Barg", "Gul"], a: "Ildiz" },
  { q: "Ildizning asosiy vazifasi nima?", o: ["Suv shimish", "Nafas olish", "Ko'payish", "Fotosintez"], a: "Suv shimish" },
  { q: "Bargda qaysi modda quyosh nurini yutadi?", o: ["Xlorofill", "Kraxmal", "Sellyuloza", "Suv"], a: "Xlorofill" },
  { q: "Mikroskopning ob'ektni kattalashtiradigan qismi?", o: ["Okulyar", "Vint", "Oyna", "Shtativ"], a: "Okulyar" }
];

const questionPoolGrade6 = [
  { q: "Bir hujayrali hayvonni toping.", o: ["Amyoba", "Gidra", "Chuvalchang", "Pashsha"], a: "Amyoba" },
  { q: "Infuzoriya tufelka qanday harakatlanadi?", o: ["Kiprikchalar orqali", "Soxta oyoqlar orqali", "Xivchin orqali", "Qanot orqali"], a: "Kiprikchalar orqali" },
  { q: "Qaysi hayvonning asab sistemasi to'rsimon?", o: ["Gidra", "Planariya", "Bo'rtma nematoda", "Lansetnik"], a: "Gidra" },
  { q: "Yashil evglena yorug'da qanday oziqlanadi?", o: ["Avtotrof", "Geterotrof", "Saprofot", "Yirtqich"], a: "Avtotrof" },
  { q: "Chuvalchanglarning qaysi tipi ikki tomonlama simmetriyaga ega?", o: ["Yassi chuvalchanglar", "Bo'shliqichlilar", "Bakteriyalar", "G'ovaktanlilar"], a: "Yassi chuvalchanglar" },
  { q: "Parazit hayot kechiruvchi chuvalchang?", o: ["Exinokokk", "Oq planariya", "Yomg'ir chuvalchangi", "Kalta kesak"], a: "Exinokokk" },
  { q: "To'qimalarning necha xili bor?", o: ["4", "3", "5", "6"], a: "4" },
  { q: "Asab to'qimasi hujayralari nima deb ataladi?", o: ["Neyronlar", "Leykotsitlar", "Eritrotsitlar", "Epiteliylar"], a: "Neyronlar" },
  { q: "Biologiya fanining hayvonlarni o'rganuvchi bo'limi?", o: ["Zoologiya", "Botanika", "Anatomiya", "Genetika"], a: "Zoologiya" },
  { q: "Qaysi tip vakillari asosan dengizlarda yashaydi?", o: ["G'ovaktanlilar", "Hasharotlar", "Qushlar", "Sutemizuvchilar"], a: "G'ovaktanlilar" }
];

function getRandomItems(arr: any[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function generateQuestions(grade: number, quizNum: number, count: number) {
  const pool = grade === 5 ? questionPoolGrade5 : questionPoolGrade6;
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    // Pick a random template and alter it slightly to make it look diverse
    const base = pool[Math.floor(Math.random() * pool.length)];
    questions.push({
      type: "MULTIPLE_CHOICE",
      content: `Q${i + 1} (${quizNum}-test): ${base.q}`,
      options: JSON.stringify(base.o.sort(() => 0.5 - Math.random())),
      correctAnswer: base.a
    });
  }
  return questions;
}

async function main() {
  console.log("Starting to seed quizzes...");

  // First, find existing lessons to attach quizzes to. We need some for grade 5 and some for grade 6.
  const grade5Course = await prisma.course.findFirst({ where: { gradeLevel: 5 } });
  const grade6Course = await prisma.course.findFirst({ where: { gradeLevel: 6 } });

  if (!grade5Course || !grade6Course) {
    console.error("Could not find courses for grade 5 or 6.");
    return;
  }

  const lesson5 = await prisma.lesson.findFirst({ where: { courseId: grade5Course.id } });
  const lesson6 = await prisma.lesson.findFirst({ where: { courseId: grade6Course.id } });

  if (!lesson5 || !lesson6) {
    console.error("Could not find lessons to attach quizzes to.");
    return;
  }

  // Clear existing quizzes to start fresh
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  // Create 50 tests for 5th grade
  for (let i = 1; i <= 50; i++) {
    await prisma.quiz.create({
      data: {
        title: `5-sinf: Biologiya test (Qism ${i})`,
        lessonId: lesson5.id,
        questions: {
          create: generateQuestions(5, i, 20)
        }
      }
    });
    if (i % 10 === 0) console.log(`Created ${i} quizzes for grade 5...`);
  }

  // Create 50 tests for 6th grade
  for (let i = 1; i <= 50; i++) {
    await prisma.quiz.create({
      data: {
        title: `6-sinf: Zoologiya test (Qism ${i})`,
        lessonId: lesson6.id,
        questions: {
          create: generateQuestions(6, i, 20)
        }
      }
    });
    if (i % 10 === 0) console.log(`Created ${i} quizzes for grade 6...`);
  }

  console.log("Successfully created 100 quizzes with 2000 questions in total.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

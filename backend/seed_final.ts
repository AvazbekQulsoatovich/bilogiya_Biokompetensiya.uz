import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting final seeding with high-quality data...");

  // 1. O'chirib yuborish (Oldingi ma'lumotlarni tozalash)
  await prisma.question.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.game.deleteMany();
  await prisma.labResult.deleteMany();
  await prisma.lab.deleteMany();

  // 2. Kurslarni olish yoki yaratish
  let course5 = await prisma.course.findFirst({ where: { gradeLevel: 5 } });
  if (!course5) {
    course5 = await prisma.course.create({ data: { title: "5-sinf Botanika", gradeLevel: 5, description: "O'simliklar olami" }});
  }

  let course6 = await prisma.course.findFirst({ where: { gradeLevel: 6 } });
  if (!course6) {
    course6 = await prisma.course.create({ data: { title: "6-sinf Biologiya", gradeLevel: 6, description: "Biologiya asoslari" }});
  }

  // 3. Mavzular (Lessons) - 5-sinf
  const lesson5_1 = await prisma.lesson.create({
    data: {
      courseId: course5.id,
      title: "1-mavzu: O'simliklar dunyosi",
      contentMd: `## O'simliklar dunyosi bilan tanishuv
O'simliklar Yer yuzida hayot mavjud bo'lishining asosiy omillaridan biridir. Ular barcha tirik mavjudotlarni kislorod va oziq-ovqat bilan ta'minlaydi.

### O'simliklarning turlari:
*   **Daraxtlar:** Qattiq yog'och poyaga ega o'simliklar.
*   **Butalar:** Bir nechta poyadan tashkil topgan, uncha baland bo'lmagan o'simliklar.
*   **O'tlar:** Yumshoq va yashil poyaga ega bo'lgan o'simliklar.

Yashil barglarda fotosintez deb ataladigan jarayon yuz beradi, buning natijasida kislorod ajralib chiqadi.`
    }
  });

  const lesson5_2 = await prisma.lesson.create({
    data: {
      courseId: course5.id,
      title: "2-mavzu: Hujayra tuzilishi",
      contentMd: `## Hujayra - tiriklikning asosiy qismi
Barcha tirik organizmlar hujayralardan tashkil topgan.

### O'simlik hujayrasining tarkibiy qismlari:
1.  **Qobiq (Hujayra devori):** Hujayrani himoya qiladi va shakl beradi.
2.  **Yadro:** Hujayraning markazi bo'lib, irsiy ma'lumotlarni saqlaydi.
3.  **Sitoplazma:** Hujayra ichini to'ldirib turadigan yarim suyuq modda.
4.  **Vakuola:** Hujayra shirasi saqlanadigan bo'shliq.
5.  **Xloroplastlar:** Yashil rang beruvchi va fotosintezni amalga oshiruvchi qismlar.`
    }
  });

  // 4. Mavzular (Lessons) - 6-sinf
  const lesson6_1 = await prisma.lesson.create({
    data: {
      courseId: course6.id,
      title: "1-mavzu: Biosfera va uning chegaralari",
      contentMd: `## Biosfera nima?
Biosfera - Yer sayyorasidagi barcha tirik organizmlar va ularning hayot faoliyati bilan bog'liq bo'lgan qobiq. 

U quyidagi qismlarni o'z ichiga oladi:
*   **Atmosfera:** Yerning quyi havo qobig'i (qushlar, hasharotlar uchadigan hududlar).
*   **Gidrosfera:** Barcha suv havzalari (okeanlar, dengizlar, daryolar).
*   **Litosfera:** Yerning qattiq sirt qatlami (tuproq va yer osti hayvonlari yashaydigan joy).`
    }
  });

  // 5. Testlar (Quizzes) - Ko'p va murakkab
  const quiz5_1 = await prisma.quiz.create({
    data: {
      lessonId: lesson5_2.id,
      title: "Hujayra tuzilishi bo'yicha test"
    }
  });
  await prisma.question.createMany({
    data: [
      { quizId: quiz5_1.id, type: "MULTIPLE_CHOICE", content: "Hujayraga yashil rang beruvchi va fotosintezda qatnashuvchi qism nima?", options: JSON.stringify(["Yadro", "Vakuola", "Xloroplast", "Sitoplazma"]), correctAnswer: "Xloroplast" },
      { quizId: quiz5_1.id, type: "MULTIPLE_CHOICE", content: "O'simlik hujayrasining qaysi qismida irsiy ma'lumotlar saqlanadi?", options: JSON.stringify(["Qobiq", "Yadro", "Sitoplazma", "Mikoriza"]), correctAnswer: "Yadro" },
      { quizId: quiz5_1.id, type: "MULTIPLE_CHOICE", content: "Hujayra shirasi qayerda saqlanadi?", options: JSON.stringify(["Xromosomada", "Yadroda", "Qobiqda", "Vakuolada"]), correctAnswer: "Vakuolada" },
      { quizId: quiz5_1.id, type: "MULTIPLE_CHOICE", content: "Hujayra ichini to'ldiruvchi yarim suyuq modda nima deyiladi?", options: JSON.stringify(["Xlorofill", "Sitoplazma", "Hujayra devori", "Plastida"]), correctAnswer: "Sitoplazma" }
    ]
  });

  const quiz6_1 = await prisma.quiz.create({
    data: {
      lessonId: lesson6_1.id,
      title: "Biosfera sirlari testi"
    }
  });
  await prisma.question.createMany({
    data: [
      { quizId: quiz6_1.id, type: "MULTIPLE_CHOICE", content: "Yerning havo qobig'i nima deb ataladi?", options: JSON.stringify(["Litosfera", "Biosfera", "Gidrosfera", "Atmosfera"]), correctAnswer: "Atmosfera" },
      { quizId: quiz6_1.id, type: "MULTIPLE_CHOICE", content: "Dengiz va okeanlar qaysi qobiqqa kiradi?", options: JSON.stringify(["Gidrosfera", "Litosfera", "Atmosfera", "Stratosfera"]), correctAnswer: "Gidrosfera" },
      { quizId: quiz6_1.id, type: "MULTIPLE_CHOICE", content: "Biosfera tushunchasi nimani anglatadi?", options: JSON.stringify(["Faqat o'simliklar", "Tirik organizmlar yashaydigan qobiq", "Toshlar va qumlar", "Kosmik bo'shliq"]), correctAnswer: "Tirik organizmlar yashaydigan qobiq" }
    ]
  });

  // 6. Games (O'yinlar) - Rasmlar bilan (emoji emas)
  await prisma.game.create({
    data: {
      title: "Mikroskopik Xotira O'yini",
      description: "Rasmlar ostiga yashiringan hujayra va mikrob turlarini juftlang.",
      type: "MEMORY",
      contentJson: JSON.stringify([
        { id: 1, name: "Virus", image: "https://cdn-icons-png.flaticon.com/512/2659/2659980.png" },
        { id: 2, name: "Bakteriya", image: "https://cdn-icons-png.flaticon.com/512/2750/2750697.png" },
        { id: 3, name: "DNK", image: "https://cdn-icons-png.flaticon.com/512/3035/3035414.png" },
        { id: 4, name: "Mikroskop", image: "https://cdn-icons-png.flaticon.com/512/3014/3014413.png" },
        { id: 5, name: "Hujayra", image: "https://cdn-icons-png.flaticon.com/512/4333/4333060.png" }
      ])
    }
  });

  // 7. Virtual Lab
  await prisma.lab.create({
    data: {
      title: "Piyoz po'stini mikroskopda kuzatish",
      description: "Hujayra qismlarini haqiqiy mikroskop ostida qanday ko'rinishini amalda sinab ko'ring.",
      rewardXp: 200,
      stepsJson: JSON.stringify([
        { id: 1, instruction: "Mikroskopni yoqing va yoritkichni to'g'rilang.", actionType: "DRAG", target: "switch", item: "hand" },
        { id: 2, instruction: "Piyoz po'stidan olingan namunani shisha ustiga qo'ying.", actionType: "DRAG", target: "glass", item: "onion" },
        { id: 3, instruction: "Namunaga bir tomchi yod tomizing (hujayra bo'yalishi uchun).", actionType: "CLICK", target: "pipette" },
        { id: 4, instruction: "Mikroskop ob'yektivini kattalashtirib kuzating.", actionType: "ZOOM", target: "lens" }
      ])
    }
  });

  console.log("Database perfectly seeded with rich content!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const tasks = [
    // 5-sinf (O'simliklar)
    {
        title: "1. Urug'ning unib chiqishini kuzatish",
        description: "Loviya yoki no'xat urug'ini nam paxta ustiga qo'ying. Uni issiq va yorug' joyda saqlang. Har kuni uning qanday o'zgarib borishini (ildiz va poya hosil bo'lishini) rasmini chizing yoki rasmga olib tahlil qiling. Necha kunda birinchi barg paydo bo'ldi?",
        xpReward: 150
    },
    {
        title: "2. Gerbariylar yig'ish siri",
        description: "Atrofingizdagi 3 xil turli xil daraxt yoki butaning bargini uzib oling. Ularni qalin kitob orasiga qo'yib quritishga tayyorlang. Barglarning shakli, tomirlanishi (to'rsimon, parallel yoki yoysimon) haqida yozma hisobot tayyorlang.",
        xpReward: 120
    },
    {
        title: "3. O'simlikning yorug'likka intilishi (Fototropizm)",
        description: "Kichik qutining bir tomoniga teshik oching. Ichiga unib chiqqan kichik o'simlikni (masalan, loviya) qo'ying. 5-7 kundan so'ng o'simlik poyasi qaysi tomonga o'sganini kuzating va buning sababini biologik tushuntiring.",
        xpReward: 200
    },
    {
        title: "4. Suvning o'simlik bo'ylab harakati",
        description: "Oq gulli o'simlikni (chinniyigul yoki boshqa) rangli suv (siyoh yoki bo'yoq qo'shilgan) solingan stakanga solib qo'ying. 24 soatdan so'ng gul barglarida qanday o'zgarish bo'lganini yozing. Ksilema naylari haqida ma'lumot izlang.",
        xpReward: 180
    },
    {
        title: "5. Kuzgi barg to'kilishi tahlili",
        description: "Kuz faslida yoki atrofdagi daraxtlarda barglarning rangi nima uchun o'zgarishini o'rganing. Xlorofill, karotin, ksantofill pigmentlari haqida qisqacha ma'ruza tayyorlang va 2 xil kuzgi barg namunasini ko'rsating.",
        xpReward: 100
    },
    {
        title: "6. Zog'ora gul (Makkajo'xori) tuzilishini o'rganish",
        description: "Makkajo'xori popugi (onaliq guli) va ro'vagining (otaliq guli) tuzilishini tahlil qiling. Nima uchun ularning gullari turli joyda joylashganini va shamol orqali qanday changlanishini o'rganing.",
        xpReward: 130
    },
    {
        title: "7. Qushlar va hasharotlar yordamida changlanish",
        description: "Hovli yoki bog'ingizdagi ochilgan gullarni kuzating. Kapalaklar, asalarilar gulning qaysi qismiga qo'nmoqda? Ular qanday qilib changlanishda yordam beradi? 10 daqiqalik kuzatuv xulosasini yozing.",
        xpReward: 150
    },
    {
        title: "8. Ildiz turlarini solishtirish",
        description: "Ildizmevalilar (sabzi yoki turp) bilan oddiy o't o'simligi ildizini (bug'doy yoki maysazor o'ti) solishtiring. O'q ildiz va popuk ildiz tizimining asosiy farqlarini yozib bering.",
        xpReward: 100
    },
    {
        title: "9. Urug'larning tarqalish usullari",
        description: "Qoqigul (dastarbosh) urug'ini topib unga puflab ko'ring. Yana qanday o'simliklar shamol yoki hayvonlar orqali tarqaladi? 3 ta turli o'simlik urug'ining tarqalish moslashuvini yozing.",
        xpReward: 120
    },
    {
        title: "10. Xona o'simliklarini parvarishlash xaritasi",
        description: "Uyingizdagi yoki maktabingizdagi 2 ta xona o'simligini tanlang. Ularning nomi, vatani, qancha suv va yorug'lik talab qilishi haqida ma'lumotnoma (pasport) tayyorlang.",
        xpReward: 140
    },
    // 6-sinf (Zoologiya)
    {
        title: "11. Hasharotlarning rivojlanish bosqichlari",
        description: "Kapalakning to'liq o'zgarish bilan rivojlanish tsiklini (tuxum -> lichinka (qurt) -> g'umbak -> imago) rasmda chizing yoki loydan yasab ko'rsating. Har bir bosqichning ahamiyatini yozing.",
        xpReward: 160
    },
    {
        title: "12. Chuvalchanglarning tuproqqa foydasi",
        description: "Yomg'irdan so'ng yuzaga chiqadigan yomg'ir chuvalchanglarini kuzating. Ular tuproqni qanday qilib yumshatishi va chirindiga (gumusga) boyitishi haqida kichik maqola yozing.",
        xpReward: 150
    },
    {
        title: "13. Qushlarning tumshuq turlari",
        description: "Turli qushlar (burgut, o'rdak, laylak, chumchuq) tumshuqlarini ularning oziqlanishiga qanday moslashgani haqida taqqoslang. Ularning rasmlarini topib yopishtiring va har biriga izoh bering.",
        xpReward: 180
    },
    {
        title: "14. Uy hayvonlarining fe'l-atvori (Etologiya)",
        description: "Mushuk yoki itning hatti-harakatlarini 2 kun davomida kuzating. Ular xursand bo'lganda, qo'rqqanda yoki ochiqqanda qanday harakatlar (tovushlar, dum qimirlatish) qilishini ro'yxat qilib yozing.",
        xpReward: 200
    },
    {
        title: "15. Suv havzasi ekosistemasi",
        description: "Agar yaqin atrofda ko'lmak, ariq yoki hovuz bo'lsa, u yerdagi tirik organizmlarni (itbaliq, suv qandalasi, mayda baliqlar, suv o'tlari) kuzating. Kim kim bilan oziqlanishi haqida oziq zanjiri tuzing.",
        xpReward: 170
    },
    {
        title: "16. Hasharotlarning tana tuzilishi",
        description: "O'lik qo'ng'iz yoki chigirtkani kattalashtiruvchi oyna (lupa) yordamida o'rganing. Uning bosh, ko'krak va qorin qismlarini, mo'ylovchalari va oyoqlarini sanab chiqing. O'rgimchakdan nima farqi bor?",
        xpReward: 160
    },
    {
        title: "17. Qushlarning uchishga moslashuvi",
        description: "Qushning patini toping va uni o'rganing. Patning yengilligi, qushning suyaklari ichi bo'shligi ularning uchishiga qanday yordam berishi haqida referat yozing.",
        xpReward: 150
    },
    {
        title: "18. Sutemizuvchilarning tish tuzilishi",
        description: "O'txo'r hayvonlar (sigir, qo'y) va yirtqich hayvonlar (bo'ri, sher) tishlari tuzilishidagi farqlarni tahlil qiling. Qoziqtish, kuraktish va oqlov tishlar kimda yaxshiroq rivojlangan?",
        xpReward: 140
    },
    {
        title: "19. Hayvonlarning qishga tayyorgarligi",
        description: "Ayrim hayvonlar nima uchun qishki uyquga ketadi? Ayiq, tipratikan va ilonning qishlash jarayoni haqida ma'lumot to'plab, ularning organizmida qanday o'zgarishlar bo'lishini yozing.",
        xpReward: 160
    },
    {
        title: "20. Parazit gijjalar profilaktikasi",
        description: "Odam organizmida yashovchi parazit chuvalchanglar (askariada, gijja) qanday qilib odamga yuqadi? Ulardan himoyalanish uchun qanday shaxsiy gigiyena qoidalariga rioya qilish kerakligini plakat shaklida chizing.",
        xpReward: 200
    }
];
async function main() {
    console.log("Seeding extracurricular tasks...");
    // Clean existing tasks
    await prisma.extracurricularTaskSubmission.deleteMany();
    await prisma.extracurricularTask.deleteMany();
    // Insert new tasks
    for (const task of tasks) {
        await prisma.extracurricularTask.create({
            data: task
        });
    }
    console.log(`Successfully added ${tasks.length} extracurricular tasks.`);
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

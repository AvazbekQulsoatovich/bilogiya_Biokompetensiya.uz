"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const glossaryData = [
    // 5-sinf Botanika va Umumiy Biologiya
    { term: "Biologiya", definition: "Tirik organizmlarni va ularning yashash muhitini o'rganuvchi fan." },
    { term: "Botanika", definition: "O'simliklar olamini o'rganuvchi fan." },
    { term: "Hujayra", definition: "Tirik organizmlarning eng kichik tuzilish va tiriklik birligi." },
    { term: "Yadro", definition: "Hujayraning markaziy qismi bo'lib, uning barcha jarayonlarini boshqaradi va irsiy ma'lumotni saqlaydi." },
    { term: "Sitoplazma", definition: "Hujayra ichini to'ldirib turuvchi, tinimsiz harakatdagi yopishqoq suyuqlik." },
    { term: "Vakuola", definition: "Ichida hujayra shirasi saqlanadigan bo'shliq." },
    { term: "Plastidalar", definition: "Faqat o'simlik hujayrasida uchraydigan, unga rang beruvchi organoidlar." },
    { term: "Xloroplast", definition: "O'simlikka yashil rang beruvchi va fotosintezda qatnashuvchi plastida." },
    { term: "Membrana", definition: "Hujayrani tashqi muhitdan ajratib, himoya qilib turuvchi yupqa qobiq." },
    { term: "To'qima", definition: "Tuzilishi va kelib chiqishi bir xil bo'lib, ma'lum bir vazifani bajaruvchi hujayralar to'plami." },
    { term: "Vegetativ organlar", definition: "O'simlikning o'sishi va oziqlanishini ta'minlovchi organlar (ildiz, poya, barg)." },
    { term: "Generativ organlar", definition: "O'simlikning ko'payishini ta'minlovchi organlar (gul, meva, urug')." },
    { term: "Ildiz", definition: "O'simlikni tuproqqa biriktirib turuvchi va suv, mineral moddalarni so'rib oluvchi organ." },
    { term: "Poya", definition: "O'simlikning ildizi bilan bargini bog'lovchi va tayanch vazifasini bajaruvchi organ." },
    { term: "Barg", definition: "Fotosintez jarayoni kechadigan, suv bug'latadigan va nafas oladigan organ." },
    { term: "Fotosintez", definition: "Yorug'lik ta'sirida o'simlik bargida karbonat angidrid va suvdan organik moddalar hosil bo'lish jarayoni." },
    { term: "Gul", definition: "Yopiq urug'li o'simliklarning ko'payish organi." },
    { term: "Changchi", definition: "Gulning otaliq jinsiy organi." },
    { term: "Urug'chi", definition: "Gulning onaliq jinsiy organi." },
    { term: "Changlanish", definition: "Chang donachasining changchidan urug'chi tumshuqchasiga tushishi." },
    { term: "Urug'lanish", definition: "Otaliq va onaliq jinsiy hujayralarining qo'shilishi." },
    { term: "Meva", definition: "O'simlik gulining tugunchasidan urug'langandan so'ng hosil bo'ladigan, ichida urug' saqlovchi organ." },
    { term: "Transpiratsiya", definition: "O'simlik barglari orqali suvning bug'lanish jarayoni." },
    { term: "Ochiq urug'lilar", definition: "Urug'i meva qobig'isiz, qubbalarda ochiq holda yetiladigan o'simliklar (masalan: archa, qarag'ay)." },
    { term: "Yopiq urug'lilar", definition: "Urug'i meva qobig'i ichida yashiringan o'simliklar." },
    { term: "Bakteriyalar", definition: "Yadrosi bo'lmagan, eng oddiy bir hujayrali mikroorganizmlar." },
    { term: "Zamburug'lar", definition: "O'simliklar va hayvonlar o'rtasidagi alohida olam, tarkibida xitin saqlaydi." },
    { term: "Lishayniklar", definition: "Zamburug' va suvo'tlarning o'zaro foydali (simbioz) yashashidan hosil bo'lgan organizm." },
    { term: "Simbioz", definition: "Ikki xil organizmning bir-biriga foyda keltirib, birgalikda yashashi." },
    { term: "Parazitizm", definition: "Bir organizmning ikkinchisi hisobiga yashashi va unga zarar keltirishi." },
    { term: "Atmosfera", definition: "Yerning havo qobig'i." },
    { term: "Biosfera", definition: "Yer yuzidagi barcha tirik organizmlar tarqalgan qavat." },
    { term: "Litosfera", definition: "Yerning qattiq tosh qobig'i." },
    { term: "Gidrosfera", definition: "Yerning suv qobig'i." },
    { term: "Ekosistema", definition: "Tirik organizmlar va jonsiz tabiatning o'zaro ta'siri natijasida hosil bo'ladigan tizim." },
    { term: "Qizil kitob", definition: "Yo'qolib ketish xavfi ostida bo'lgan nodir o'simlik va hayvonlar ro'yxati keltirilgan kitob." },
    { term: "Endemik", definition: "Faqatgina ma'lum bir hududda uchraydigan o'simlik yoki hayvon turi." },
    // 6-sinf Zoologiya
    { term: "Zoologiya", definition: "Hayvonlar olamini, ularning tuzilishi va hayot kechirishini o'rganuvchi fan." },
    { term: "Bir hujayralilar", definition: "Tanasi faqat bitta hujayradan iborat bo'lgan hayvonlar." },
    { term: "Amyoba", definition: "Doimiy tana shakliga ega bo'lmagan, soxta oyoqlari yordamida harakatlanuvchi eng oddiy hayvon." },
    { term: "Infuzoriya", definition: "Kiprikchalar yordamida harakatlanuvchi, murakkabroq tuzilgan bir hujayrali (masalan, Tufelka)." },
    { term: "Yashil evglena", definition: "Ham o'simlik, ham hayvon xususiyatlariga ega bo'lgan xivchinli organizm." },
    { term: "Regeneratsiya", definition: "Yo'qotilgan yoki shikastlangan tana qismlarining qayta tiklanishi." },
    { term: "Gidra", definition: "Chuchuk suvda yashovchi, paypaslagichli, ichakbo'shliqlilar tipiga mansub hayvon." },
    { term: "Meduza", definition: "Dengiz va okeanlarda yashovchi, soyabonsimon shakldagi ichakbo'shliqli." },
    { term: "Yassi chuvalchanglar", definition: "Tanasi yaproq yoki tasma shaklida bo'lgan chuvalchanglar." },
    { term: "To'garak chuvalchanglar", definition: "Tanasi shpindel shaklida bo'lib, ko'pchiligi parazitlik qiladi (masalan, askarida)." },
    { term: "Halqali chuvalchanglar", definition: "Tanasi halqalarga bo'lingan chuvalchanglar (masalan, yomg'ir chuvalchangi)." },
    { term: "Mollyuskalar", definition: "Tanasi yumshoq, ko'pincha chig'anoq bilan qoplangan hayvonlar (masalan, shilliqqurt, chig'anoq)." },
    { term: "Bo'g'imoyoqlilar", definition: "Oyoqlari bo'g'imlardan iborat bo'lgan, tanasi xitin bilan qoplangan hayvonlar." },
    { term: "Xitin qoplami", definition: "Bo'g'imoyoqlilarning tashqi skeleti vazifasini bajaruvchi qattiq qobiq." },
    { term: "Hasharotlar", definition: "Oltita oyog'i va qanotlari bo'lgan eng ko'p tarqalgan bo'g'imoyoqlilar sinfi." },
    { term: "Lichinka", definition: "Hasharotlarning tuxumdan chiqqan, voyaga yetmagan bosqichi (masalan, qurt)." },
    { term: "G'umbak", definition: "To'liq o'zgarish bilan rivojlanadigan hasharotlarning lichinka va yetuk zot o'rtasidagi harakatsiz bosqichi." },
    { term: "Xordalilar", definition: "Dastlabki yoki butun umri davomida tanasida o'q skelet (xorda) bo'lgan hayvonlar." },
    { term: "Lansetnik", definition: "Bosh suyagi bo'lmagan, dengizda yashovchi eng sodda xordali hayvon." },
    { term: "Baliqlar", definition: "Suvda yashovchi, jabra orqali nafas oluvchi va suzgichlari yordamida harakatlanuvchi umurtqalilar." },
    { term: "Jabra", definition: "Suvda erigan kislorod bilan nafas olishni ta'minlovchi organ." },
    { term: "Suvda va quruqlikda yashovchilar", definition: "Hayotining bir qismi suvda (itbaliq), yetuk zotlari quruqlikda o'tuvchi hayvonlar (baqalar)." },
    { term: "Sudralib yuruvchilar", definition: "Tanasi tangachalar bilan qoplangan, tuxum qo'yib ko'payuvchi sovuqqonli hayvonlar (ilon, toshbaqa, kaltakesak)." },
    { term: "Qushlar", definition: "Tanasi pat bilan qoplangan, oldingi oyoqlari qanotga aylangan issiqqonli hayvonlar." },
    { term: "Pat", definition: "Qushlar tanasini sovuqdan asrovchi va uchishda yordam beruvchi qoplama." },
    { term: "Sutemizuvchilar", definition: "Bolalarini tirik tug'ib, sut bilan boqadigan eng yuksak tuzilgan hayvonlar." },
    { term: "Yo'ldosh (Platsenta)", definition: "Sutemizuvchilar homilasi ona organizmi bilan oziq modda almashadigan maxsus organ." },
    { term: "Yirtqichlar", definition: "Boshqa hayvonlarni ovlab oziqlanuvchi hayvonlar." },
    { term: "Primatlar", definition: "Sutemizuvchilar ichida eng yuksak rivojlangan turkum (maymunlar va odamsimon maymunlar)." },
    { term: "Instinkt", definition: "Hayvonlarning tug'ma, avloddan avlodga o'tadigan murakkab xatti-harakatlari." },
    { term: "Refleks", definition: "Tashqi ta'sirga nisbatan organizmning nerv sistemasi orqali qaytaradigan javob reaksiyasi." },
    { term: "Etologiya", definition: "Hayvonlarning xulq-atvori va instinktlarini o'rganuvchi fan." }
];
async function main() {
    console.log("Seeding comprehensive glossary...");
    // Clean all existing
    await prisma.glossary.deleteMany();
    // Sort alphabetically so they appear nicely if backend doesn't sort
    const sortedData = glossaryData.sort((a, b) => a.term.localeCompare(b.term));
    for (const item of sortedData) {
        try {
            await prisma.glossary.create({
                data: item
            });
        }
        catch (e) {
            // Ignore unique constraint errors just in case
            console.log(`Skipped existing term: ${item.term}`);
        }
    }
    console.log(`Successfully added ${sortedData.length} dictionary terms!`);
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

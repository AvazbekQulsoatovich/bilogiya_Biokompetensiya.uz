"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const gamesData = [
    {
        title: "1. Xotira: Hujayra organoidlari (5-sinf)",
        description: "Bir xil atamalarni topib juftlang",
        type: "MEMORY",
        contentJson: JSON.stringify([
            { id: 1, name: "Yadro", emoji: "🧬" },
            { id: 2, name: "Ribosoma", emoji: "🟡" },
            { id: 3, name: "Lizosoma", emoji: "🔴" },
            { id: 4, name: "Mitoxondriya", emoji: "⚡" },
            { id: 5, name: "Vakuola", emoji: "💧" },
            { id: 6, name: "Xloroplast", emoji: "🌿" }
        ])
    },
    {
        title: "2. Xotira: Hayvonlar olami (6-sinf)",
        description: "Hayvonlarning yashirin rasmlarini toping",
        type: "MEMORY",
        contentJson: JSON.stringify([
            { id: 1, name: "Sher", emoji: "🦁" },
            { id: 2, name: "Yo'lbars", emoji: "🐅" },
            { id: 3, name: "Fil", emoji: "🐘" },
            { id: 4, name: "Jirafa", emoji: "🦒" },
            { id: 5, name: "Maymun", emoji: "🐒" },
            { id: 6, name: "Ayiq", emoji: "🐻" }
        ])
    },
    {
        title: "3. Harflarni yig'ing (5-sinf)",
        description: "Chalkashib ketgan harflardan biologik atamalarni tuzing",
        type: "SCRAMBLE",
        contentJson: JSON.stringify([
            { word: "ILDIZ", hint: "O'simlikning yer ostki organi" },
            { word: "POYA", hint: "O'simlikning tayanch organi" },
            { word: "BARG", hint: "Fotosintez jarayoni o'tadigan joy" },
            { word: "GUL", hint: "O'simlikning ko'payish organi" }
        ])
    },
    {
        title: "4. Harflarni yig'ing (6-sinf)",
        description: "Hayvonlar olamiga oid chalkash so'zlarni toping",
        type: "SCRAMBLE",
        contentJson: JSON.stringify([
            { word: "AMYOBA", hint: "Bir hujayrali oddiy hayvon" },
            { word: "GIDRA", hint: "Chuchuk suvda yashovchi hayvon" },
            { word: "BURGUT", clue: "Katta yirtqich qush" }, // using hint below
            { word: "XITIN", hint: "Hasharotlarning qoplag'ichi" }
        ].map(i => ({ ...i, hint: i.hint || i.clue })))
    },
    {
        title: "5. To'g'ri yoki Noto'g'ri? (5-sinf)",
        description: "Faktlarni o'qing va tezkor javob bering",
        type: "TRUE_FALSE",
        contentJson: JSON.stringify([
            { question: "Barcha o'simliklar zaharli hisoblanadi.", answer: false },
            { question: "Fotosintez jarayonida kislorod ajralib chiqadi.", answer: true },
            { question: "Ildiz orqali o'simlik suv ichadi.", answer: true },
            { question: "Barcha gullar faqat kunduz kuni ochiladi.", answer: false }
        ])
    },
    {
        title: "6. To'g'ri yoki Noto'g'ri? (6-sinf)",
        description: "Zoologiyaga oid qiziqarli faktlar",
        type: "TRUE_FALSE",
        contentJson: JSON.stringify([
            { question: "Ayiqlar qishki uyquga ketadi.", answer: true },
            { question: "Kitlar baliqlar sinfiga kiradi.", answer: false },
            { question: "Barcha hasharotlarning 6 ta oyog'i bor.", answer: true },
            { question: "Ilonlar ham sutemizuvchilar hisoblanadi.", answer: false }
        ])
    }
];
async function main() {
    console.log("Seeding games...");
    await prisma.game.deleteMany();
    for (const game of gamesData) {
        await prisma.game.create({
            data: game
        });
    }
    console.log("Successfully created games!");
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const labs = [
  {
    title: "Piyoz po'sti hujayralarini o'rganish",
    description: "Mikroskop yordamida piyoz po'sti hujayrasini o'rganing va yod yordamida bo'yash jarayonini amalda sinab ko'ring.",
    rewardXp: 100,
    stepsJson: JSON.stringify({
      type: "MICROSCOPE",
      target: "onion_cell",
      tools: ["piyoz", "oyna", "tomizgich", "qoplagich", "mikroskop"],
      instructions: [
        "Piyoz po'stidan kichik bo'lak kesib oling",
        "Bo'lakni predmet oynasiga joylashtiring",
        "Yod eritmasidan 1-2 tomchi tomizing",
        "Qoplagich oyna bilan yoping",
        "Mikroskop ostiga qo'yib kuzating"
      ]
    })
  },
  {
    title: "Bargda kraxmal hosil bo'lishi",
    description: "Yorug'likda turgan bargda kraxmal hosil bo'lganligini kimyoviy reaksiya orqali aniqlang.",
    rewardXp: 150,
    stepsJson: JSON.stringify({
      type: "CHEMISTRY",
      target: "starch_test",
      tools: ["barg", "issiq_suv", "spirt", "yod_tomizgich"],
      instructions: [
        "Bargni qaynayotgan suvga solib yumshating",
        "Bargni issiq spirtli kolbaga solib xlorofillni ajrating",
        "Bargni yuvib, idishga oling",
        "Bargga yod tomizib, ko'k rangga kirishini kuzating"
      ]
    })
  },
  {
    title: "Elodeyada fotosintez",
    description: "Suv o'simligi (Elodeya) misolida fotosintez tezligiga yorug'likning ta'sirini o'rganish.",
    rewardXp: 200,
    stepsJson: JSON.stringify({
      type: "SIMULATION",
      target: "photosynthesis",
      parameters: ["Yorug'lik", "Harorat"],
      instructions: [
        "Elodeya novdasini suvli idishga soling",
        "Yorug'likni 20% ga qo'yib pufakchalarni kuzating",
        "Yorug'likni 80% ga oshiring va farqni ko'ring",
        "Haroratni o'zgartirib jarayonga ta'sirini tekshiring"
      ]
    })
  },
  {
    title: "O'simlik hujayrasi modeli",
    description: "O'simlik hujayrasining barcha organellalarini to'g'ri joyiga joylashtirib chiqing.",
    rewardXp: 120,
    stepsJson: JSON.stringify({
      type: "ASSEMBLY",
      target: "plant_cell",
      parts: ["qobiq", "sitoplazma", "yadro", "vakuola", "xloroplast"],
      instructions: [
        "Hujayra qobig'ini tanlab asosi ustiga qo'ying",
        "Ichiga sitoplazmani quying",
        "Katta vakuolani joylashtiring",
        "Yadroni hujayra chetiga joylang",
        "Xloroplastlarni sitoplazma bo'ylab tarqating"
      ]
    })
  },
  {
    title: "Hayvon hujayrasi modeli",
    description: "Hayvon hujayrasi organellalarini tanib, ularni to'g'ri joylashtiring.",
    rewardXp: 120,
    stepsJson: JSON.stringify({
      type: "ASSEMBLY",
      target: "animal_cell",
      parts: ["membrana", "sitoplazma", "yadro", "mitoxondriya", "lizosoma"],
      instructions: [
        "Hujayra membranasini yarating",
        "Sitoplazmani kiriting",
        "Yadroni markazga joylashtiring",
        "Mitoxondriyalarni joylang",
        "Lizosomalarni qo'shing"
      ]
    })
  },
  {
    title: "Infuzoriya-tufelkani kuzatish",
    description: "Bir hujayrali hayvon Infuzoriya-tufelkaning harakati va tuzilishini mikroskop ostida kuzating.",
    rewardXp: 150,
    stepsJson: JSON.stringify({
      type: "MICROSCOPE",
      target: "infusoria",
      tools: ["suv_tomchisi", "oyna", "qoplagich", "mikroskop"],
      instructions: [
        "Turg'un suvdan bir tomchi olib oynaga tomizing",
        "Qoplagich oyna yoping",
        "Mikroskop ostida kattalashtirib kuzating",
        "Kiprikchalar yordamida harakatlanishini toping"
      ]
    })
  },
  {
    title: "Qon hujayralarini o'rganish",
    description: "Eritrotsitlar va leykotsitlarni mikroskop yordamida farqlash.",
    rewardXp: 180,
    stepsJson: JSON.stringify({
      type: "MICROSCOPE",
      target: "blood_cells",
      tools: ["qon_namunasi", "oyna", "mikroskop"],
      instructions: [
        "Tayyor qon surtmasi slaydini oling",
        "Slaydni mikroskop ostiga qo'ying",
        "Qizil qon tanachalari (Eritrotsitlar) ni toping",
        "Oq qon tanachalari (Leykotsitlar) ni toping"
      ]
    })
  },
  {
    title: "Urug' unishi sharoitlari",
    description: "Urug'larning unib chiqishi uchun zarur bo'lgan sharoitlarni simulyatsiya qiling.",
    rewardXp: 150,
    stepsJson: JSON.stringify({
      type: "SIMULATION",
      target: "seed_germination",
      parameters: ["Namlik", "Harorat", "Havo"],
      instructions: [
        "Urug'ni tuproqqa eking",
        "Namlikni oshiring va kuting",
        "Haroratni 25°C ga qo'ying",
        "Havo kirishini ta'minlab maysalar ko'rinishini kuzating"
      ]
    })
  },
  {
    title: "Transpiratsiya (Suv bug'latish)",
    description: "O'simlik barglari orqali suv bug'lanishini tekshirish tajribasi.",
    rewardXp: 100,
    stepsJson: JSON.stringify({
      type: "CHEMISTRY", // Using chemistry lab mechanics (idishlar, paket)
      target: "transpiration",
      tools: ["tuvakli_osimlik", "sellofan_paket", "ip", "quyosh_nuri"],
      instructions: [
        "Tuvakdagi o'simlikning bir novdasini tanlang",
        "Novdaga sellofan paket kiydiring",
        "Paket og'zini ip bilan bog'lang",
        "Quyosh nurida qoldirib, paket ichida suv tomchilari yig'ilishini kuzating"
      ]
    })
  },
  {
    title: "Barg og'izchalarini ko'rish",
    description: "O'simlik bargining ostki qismidagi og'izchalarni mikroskopda kuzatish.",
    rewardXp: 140,
    stepsJson: JSON.stringify({
      type: "MICROSCOPE",
      target: "stomata",
      tools: ["barg", "pinset", "oyna", "qoplagich", "mikroskop"],
      instructions: [
        "Bargning ostki po'stini pinset bilan shilib oling",
        "Po'stni predmet oynasidagi suv tomchisiga qo'ying",
        "Qoplagich oyna yoping",
        "Mikroskop ostida loviyasimon og'izcha hujayralarini toping"
      ]
    })
  }
];

async function main() {
  console.log("Seeding Virtual Labs...");
  
  // Clear existing labs
  await prisma.labResult.deleteMany();
  await prisma.lab.deleteMany();

  // Create new labs
  for (const lab of labs) {
    await prisma.lab.create({
      data: lab
    });
  }

  console.log(`Successfully created ${labs.length} labs.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

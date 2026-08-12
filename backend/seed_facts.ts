import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const factsData = [
  // 5-sinf (Botanika) faktlari
  {
    title: "Dunyodagi eng katta gul",
    content: "Raffleziya arnoldi - dunyodagi eng katta gul. Uning diametri 1 metrgacha yetadi va og'irligi 10 kilogramm atrofida bo'ladi.",
    category: "BOTANY"
  },
  {
    title: "Tabiatdagi eng qari daraxt",
    content: "AQShning Kaliforniya shtatida o'sadigan sekvoya daraxtlari 3000 yildan ortiq yashashi mumkin.",
    category: "BOTANY"
  },
  {
    title: "Suvsiz yashovchi o'simlik",
    content: "Velvichiya o'simligi cho'lda yashaydi va 1500 yildan ortiq umr ko'radi. U faqat ikkita katta bargga ega bo'lib, butun umri davomida shu barglar o'sadi.",
    category: "BOTANY"
  },
  {
    title: "Suv o'tlarining kislorodi",
    content: "Yer yuzidagi jami kislorodning qariyb 70% ini okean va dengizlarda yashovchi suv o'tlari ishlab chiqaradi.",
    category: "BOTANY"
  },
  {
    title: "Karnivor (Yirtqich) o'simliklar",
    content: "Venera pashshatutari kabi yirtqich o'simliklar hasharotlarni tutib, ulardan o'ziga kerakli oziq moddalarini oladi. Ular azot yetishmaydigan tuproqlarda o'sadi.",
    category: "BOTANY"
  },
  {
    title: "Dunyodagi eng tez o'sadigan o'simlik",
    content: "Bambuk aslida daraxt emas, balki ulkan o't hisoblanadi. Uning ba'zi turlari sutkasiga 90 sm dan ko'proq o'sishi mumkin.",
    category: "BOTANY"
  },
  {
    title: "Qalampirmunchoq",
    content: "Biz ziravor sifatida ishlatadigan qalampirmunchoq aslida daraxtning ochilmagan gul kurtaklaridir.",
    category: "BOTANY"
  },
  {
    title: "Gullarning soat kabi harakati",
    content: "Karl Linney gul soati yaratgan bo'lib, unda har bir o'simlik guli aniq bir vaqtda ochilib, aniq vaqtda yopilardi.",
    category: "BOTANY"
  },
  {
    title: "Nafas olayotgan barglar",
    content: "O'simlikning birgina bargida minglab mayda teshikchalar (og'izchalar) bo'lib, ular orqali o'simlik havodan karbonat angidrid olib, kislorod chiqaradi.",
    category: "BOTANY"
  },
  {
    title: "Dunyodagi eng katta urug'",
    content: "Seyshel palmasi urug'i dunyodagi eng katta urug' hisoblanadi. Uning og'irligi 20 kilogrammgacha yetishi mumkin.",
    category: "BOTANY"
  },
  {
    title: "10 000 yillik zamburug'",
    content: "Armillaria ostoyae nomli zamburug' dunyodagi eng yirik tirik organizm hisoblanadi. U 880 gektar maydonni egallaydi va minglab yillik umrga ega.",
    category: "BOTANY"
  },
  {
    title: "Olmaning suzishi",
    content: "Olma suvda cho'kmaydi. Chunki uning hajmining 25% qismini havo tashkil etadi.",
    category: "BOTANY"
  },
  {
    title: "Sabzining asl rangi",
    content: "Ilk sabzilar zarg'aldoq emas, balki binafsharang bo'lgan. Zarg'aldoq sabzilar 17-asrda Gollandiyada yetishtirilgan.",
    category: "BOTANY"
  },
  {
    title: "Kartoshka - inqilobiy oziq-ovqat",
    content: "Kartoshka aslida poyaning shakli o'zgargan tuganagidir. U Yevropaga keltirilgach, millionlab insonlarni ocharchilikdan saqlab qolgan.",
    category: "BOTANY"
  },
  {
    title: "Gullarning hidi nega kerak?",
    content: "Gullar chiroyli ranglari va shirin hidi yordamida changlatuvchi hasharotlarni (asalarilar, kapalaklar) o'ziga jalb qiladi.",
    category: "BOTANY"
  },
  {
    title: "O'simliklar eshita oladimi?",
    content: "Olimlarning izlanishlariga ko'ra, ayrim o'simliklar hasharotlar chaynayotgan ovozni his etib, barglarida maxsus himoya moddalari ishlab chiqara boshlaydi.",
    category: "BOTANY"
  },
  {
    title: "O'simliklardagi qon o'xshashi",
    content: "O'simliklar tarkibidagi xlorofill moddasining tuzilishi odam qonidagi gemoglobinga juda o'xshash, faqat unda temir o'rnida magniy bor.",
    category: "BOTANY"
  },
  {
    title: "Xurmo daraxti - hayot daraxti",
    content: "Cho'llarda xurmo daraxtlari eng kerakli o'simlik hisoblanadi. Uning barglaridan soyabon, mevasidan oziq-ovqat sifatida foydalaniladi.",
    category: "BOTANY"
  },
  {
    title: "Bodring meva hisoblanadi",
    content: "Botanika qoidalariga ko'ra, ichida urug'i bor bo'lgan va guldan hosil bo'ladigan barcha narsalar (bodring, pomidor, qovoq) meva hisoblanadi.",
    category: "BOTANY"
  },
  {
    title: "Yerning o'pkasi",
    content: "Amazonka o'rmonlari dunyodagi kislorodning taxminan 20 foizini ishlab chiqaradi va shu sababli 'Yer o'pkasi' deb ataladi.",
    category: "BOTANY"
  },
  {
    title: "Moxlarning ildizi yo'q",
    content: "Moxlarda haqiqiy ildiz bo'lmaydi. Ular suvni butun tanasi bilan shimiladi va tuproqqa rizoidlari orqali yopishadi.",
    category: "BOTANY"
  },
  {
    title: "Kaktuslarning himoyasi",
    content: "Kaktusning tikanlari aslida shakli o'zgargan barglar bo'lib, suv bug'lanishining oldini oladi va hayvonlardan himoya qiladi.",
    category: "BOTANY"
  },
  {
    title: "Qovunning qaysi oilaga kirishi",
    content: "Qovun va tarvuz qovoqdoshlar oilasiga kiradi. Ularning mevasi 'qovoq meva' deb ataladi.",
    category: "BOTANY"
  },
  {
    title: "Barglarning to'kilishi",
    content: "Kuzda o'simliklar suvsizlik va sovuqdan saqlanish uchun barglarini to'kadi. Bunga barg bandidagi maxsus ajratuvchi qavat sabab bo'ladi.",
    category: "BOTANY"
  },
  {
    title: "Lishaynik - tabiat barometri",
    content: "Lishayniklar faqat toza havoda yashay oladi. Agar shaharda lishaynik o'smayotgan bo'lsa, demak havo ifloslangan.",
    category: "BOTANY"
  },

  // 6-sinf (Zoologiya) faktlari
  {
    title: "Eng ko'p uxlash chempioni",
    content: "Koalalar sutkasiga 22 soatgacha uxlashadi. Ularning ozuqasi evkalipt barglari bo'lib, uning tarkibida energiya juda kam.",
    category: "ZOOLOGY"
  },
  {
    title: "Fillarning ajoyib xotirasi",
    content: "Fillar juda kuchli xotiraga ega. Ular yillar oldin ko'rgan suv manbalarini yoki boshqa fillarni darhol taniy oladilar.",
    category: "ZOOLOGY"
  },
  {
    title: "Sakkizoyoqning uchta yuragi",
    content: "Sakkizoyoqlarda uchta yurak bo'ladi. Ularning qoni esa tarkibidagi mis moddasi sababli ko'k rangda bo'ladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Tuyao'rkachining siri",
    content: "Tuyaning o'rkachida suv emas, balki yog' saqlanadi. Cho'l sharoitida oziq-ovqat topilmasa, bu yog' parchalanib energiya va suv beradi.",
    category: "ZOOLOGY"
  },
  {
    title: "Eng katta sutemizuvchi",
    content: "Ko'k kit Yer yuzidagi eng yirik hayvondir. Uning faqatgina tili o'rtacha bir filning og'irligiga teng.",
    category: "ZOOLOGY"
  },
  {
    title: "Qanotsiz hasharotlar",
    content: "Burgalar qanotsiz bo'lishiga qaramay, o'z bo'yidan 150 barobar balandroqqa sakray oladi. Bu xuddi odamning Eyfel minorasidan oshib sakrashidek gap.",
    category: "ZOOLOGY"
  },
  {
    title: "Bo'ri qadami",
    content: "Bo'rilar podasi harakatlanayotganda, orqadagi bo'rilar aynan oldindagining iziga qadam bosadi, shuning uchun izlarga qarab necha bo'ri o'tganini aniqlash qiyin.",
    category: "ZOOLOGY"
  },
  {
    title: "Pingvinlar uchmaydi, lekin...",
    content: "Pingvinlar qushlar sinfiga kirsa-da, ucha olmaydi. Ammo ular mukammal suzuvchilardir va qanotlari suv ostida suzgich vazifasini bajaradi.",
    category: "ZOOLOGY"
  },
  {
    title: "Qushlarning tishlari bormi?",
    content: "Zamonaviy qushlarning tishlari yo'q. Ular ovqatini chaynamasdan butunlay yutadi va u oshqozondagi mayda toshchalar yordamida eziladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Bukalamun tili",
    content: "Bukalamunning (xameleonning) tili uning butun tanasidan ikki barobar uzun bo'lishi mumkin va o'ljani juda katta tezlikda tutib oladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Gippopotamning pushtirang teri shirasi",
    content: "Begemotlar terisidan quyoshdan himoyalovchi maxsus qizg'ish-pushtirang shilimshiq modda ishlab chiqaradi. Bu ham krem, ham infeksiyaga qarshi dori vazifasini bajaradi.",
    category: "ZOOLOGY"
  },
  {
    title: "Tufelkaning qobig'i",
    content: "Infuzoriya-tufelka juda mayda bir hujayrali hayvon. Lekin uning tanasi 10 000 dan ortiq mikroskopik kiprikchalar bilan qoplangan.",
    category: "ZOOLOGY"
  },
  {
    title: "Shimpanze o'xshashligi",
    content: "Odam va shimpanzening DNK si taxminan 98% dan ko'proq bir-biriga mos keladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Ilonlar tili bilan hid biladi",
    content: "Ilonlar atrof-muhitdagi hidlarni ayri tili orqali sezadi. Til havodagi zarralarni ushlab, og'iz tepadagi maxsus sezgi organiga olib kiradi.",
    category: "ZOOLOGY"
  },
  {
    title: "Yomg'ir chuvalchangi qayta tiklanadimi?",
    content: "Agar yomg'ir chuvalchangi ikkiga bo'linib qolsa, bosh qismi yangi dumini o'stira oladi, lekin dum qismidan yangi bosh o'sib chiqmaydi.",
    category: "ZOOLOGY"
  },
  {
    title: "Gepard tezligi",
    content: "Gepard quruqlikdagi eng tez yuguruvchi hayvondir. U atigi 3 soniyada 100 km/soat tezlikka chiqa oladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Timsohlar ko'zyoshi",
    content: "Timsohlar ovqat yeyayotgan paytda haqiqatan ham ko'z yosh to'kadi. Lekin ular yig'lamaydi, balki chaynov muskullari yosh bezlarini siqib chiqaradi.",
    category: "ZOOLOGY"
  },
  {
    title: "Asalari raqsi",
    content: "Asalarilar ovqat manbaini topgach, uyadagi boshqa arilarga uning qayerdaligini ko'rsatish uchun havodagi o'ziga xos raqs harakatlaridan foydalanadi.",
    category: "ZOOLOGY"
  },
  {
    title: "Kaptarlarning kompassi",
    content: "Xat tashuvchi kaptarlar magnit maydonini sezish qobiliyatiga ega bo'lib, ular minglab kilometr uzoqlikdan ham uyini adashmay topib keladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Toshbaqa kiyimi",
    content: "Toshbaqaning kosasi uning skeletining bir qismi (qovurg'alar va umurtqaning o'zgarishi) hisoblanadi. Toshbaqa o'z kosasidan chiqib keta olmaydi.",
    category: "ZOOLOGY"
  },
  {
    title: "Suv otlarining asl nomi",
    content: "Dengiz otchalari aslida suyakli baliqlar turkumiga kiradi va erkaklari bolalarini qornidagi maxsus xaltachada ko'tarib yuradi.",
    category: "ZOOLOGY"
  },
  {
    title: "Uchuvchi itlar",
    content: "Ko'rshapalaklar sutemizuvchilar ichida haqiqiy ucha oladigan yagona hayvonlardir. Ularning qanotlari aslida barmoqlari orasidagi teridir.",
    category: "ZOOLOGY"
  },
  {
    title: "Asalarilar besh ko'zli",
    content: "Asalarilarda boshining yon tomonlarida ikkita katta murakkab ko'z va tepasida uchta kichik oddiy ko'z bo'ladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Yashab qolish ustasi",
    content: "Tardigradalar (suv ayiqlari) shunday chidamli mikroskopik jonivorlarki, ular qaynayotgan suvda, muz ichida va hatto ochiq kosmosda ham tirik qola oladi.",
    category: "ZOOLOGY"
  },
  {
    title: "Pashshaning oyog'idagi sezgi",
    content: "Pashshalar ovqatning ta'mini his qilish uchun uning ustiga qo'nadi, chunki ularning ta'm bilish retseptorlari oyoqlarida joylashgan.",
    category: "ZOOLOGY"
  }
];

async function main() {
  console.log("Seeding 50 interesting biology facts...");
  
  await prisma.fact.deleteMany();
  
  for (const fact of factsData) {
    await prisma.fact.create({
      data: fact
    });
  }
  
  console.log(`Successfully added ${factsData.length} facts!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

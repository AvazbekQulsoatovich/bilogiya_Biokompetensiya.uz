"use client";

import { useRef, useState } from "react";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

export default function GuidePage() {
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (typeof window === "undefined") return;
    setDownloading(true);
    try {
      const element = pdfRef.current;
      if (!element) return;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pdfWidth - margin * 2;
      const usableHeight = pdfHeight - margin * 2;
      let yOffset = margin;

      const addElementToPdf = async (el: Element, extraSpace = 10) => {
        const dataUrl = await toJpeg(el as HTMLElement, { 
          quality: 0.95, 
          backgroundColor: '#ffffff', 
          pixelRatio: 2 
        });
        
        const imgProps = pdf.getImageProperties(dataUrl);
        const imgHeight = (imgProps.height * usableWidth) / imgProps.width;

        // Agar yangi sahifa kerak bo'lsa
        if (yOffset + imgHeight > usableHeight && yOffset > margin) {
          pdf.addPage();
          yOffset = margin;
        }

        pdf.addImage(dataUrl, 'JPEG', margin, yOffset, usableWidth, imgHeight);
        yOffset += imgHeight + extraSpace;
      };

      // Header qismini olish
      const header = element.querySelector('.text-center');
      if (header) {
        await addElementToPdf(header, 5);
      }

      // Har bir blokni alohida rasmga aylantirib PDFga qo'shish
      const items = element.querySelectorAll('.feature-item');
      for (let i = 0; i < items.length; i++) {
        await addElementToPdf(items[i], 10);
      }

      pdf.save('Biokompetensiya_Qollanma.pdf');
    } catch (error: any) {
      console.error("PDF yuklashda xatolik:", error);
      alert("Xatolik yuz berdi: " + (error.message || "Yuklab olishda muammo."));
    } finally {
      setDownloading(false);
    }
  };

  const features = [
    {
      title: "1. Asosiy (Bosh sahifa)",
      description: "Platformaning markaziy oynasi. Tizimga kirishingiz bilan birinchi bo'lib aynan shu sahifa ochiladi. Bu yerda siz o'qish jarayoningizning umumiy xulosasini ko'rasiz.",
      subPoints: [
        "Xush kelibsiz paneli: Kunlik faolligingiz (Streak) va to'plangan tangalaringiz (Coins) ko'rsatiladi.",
        "Tezkor bo'limlar: Eng ko'p ishlatiladigan bo'limlarga (Mavzular, Testlar, Laboratoriya, Krossvordlar) tez o'tish tugmalari.",
        "Joriy taraqqiyot: O'quv yili davomidagi umumiy o'zlashtirish ko'rsatkichingiz foizlarda beriladi.",
        "So'nggi yutuqlar: Tizimda yaqinda qolga kiritgan mukofot va medallaringiz namoyish etiladi."
      ],
      image: "/screenshots/dashboard.png?v=2"
    },
    {
      title: "2. Profilim",
      description: "Sizning shaxsiy virtual xonangiz. Bu yerda butun o'qish davridagi natijalaringiz va shaxsiy ma'lumotlaringiz saqlanadi.",
      subPoints: [
        "Shaxsiy ma'lumotlar: Ism-sharifingiz, elektron pochtangiz va profilingizdagi rasm (avatar).",
        "Daraja (Level): To'plagan XP ballaringiz asosida qaysi darajaga yetganingiz.",
        "Xavfsizlik: Parolingizni istalgan vaqtda shu yerdan xavfsiz tarzda o'zgartirishingiz mumkin.",
        "Faollik tarixi: Barcha erishgan yutuqlaringiz bitta joyda jamlangan."
      ],
      image: "/screenshots/profile.png?v=2"
    },
    {
      title: "3. Mavzular",
      description: "Barcha biologiya darslari aynan shu yerda sinflar kesimida tartib bilan joylashgan.",
      subPoints: [
        "Sinflarga ajratilgan: 5-sinf (Botanika), 6-sinf (Zoologiya) kabi toifalangan.",
        "O'qish materiallari: Har bir mavzu ichida nazariy ma'lumotlar va rang-barang rasmlar mavjud.",
        "Videodarslar: Mavzuni yaxshiroq tushunish uchun qiziqarli va sifatli video materiallar.",
        "Tezkor yuklanish: Hech qanday qotishlarsiz, darslarni tez va qulay o'zlashtirasiz."
      ],
      image: "/screenshots/topics.png?v=2"
    },
    {
      title: "4. Darsliklar",
      description: "Maktab darsliklari va qo'shimcha kitoblarning elektron kutubxonasi.",
      subPoints: [
        "To'liq darsliklar: Barcha sinflar uchun rasmiy biologiya darsliklari.",
        "Varaqlab o'qish: Kitoblarni xuddi haqiqiy kitobdek elektron formatda varaqlab o'qiysiz.",
        "Yuklab olish: Internet bo'lmagan vaqtlarda o'qish uchun PDF formatida yuklab olish imkoniyati.",
        "Qidiruv tizimi: Kerakli adabiyotni tez va oson topish funksiyasi."
      ],
      image: "/screenshots/books.png?v=2"
    },
    {
      title: "5. Virtual Laboratoriyalar",
      description: "Xavfsiz va interaktiv muhitda kompyuter ekranida tajribalar o'tkazish bo'limi.",
      subPoints: [
        "Amaliy mashg'ulotlar: Fotosintez, hujayra bo'linishi kabi jarayonlarni amalda ko'rish.",
        "Bosqichma-bosqich: Har bir tajriba o'z ketma-ketligiga va ko'rsatmalariga ega.",
        "Natijani baholash: To'g'ri bajarilgan tajribalar uchun tizim sizga ballar beradi.",
        "Xavfsizlik: Hech qanday reaktivlarsiz, mutlaqo xavfsiz tarzda izlanish olib borasiz."
      ],
      image: "/screenshots/labs.png?v=2"
    },
    {
      title: "6. 3D Modellar",
      description: "Biologik obyektlarni haqiqiy o'lcham va shaklda, barcha tomonlardan ko'rish imkoniyati.",
      subPoints: [
        "Interaktivlik: Modellarni sichqoncha yordamida aylantirish, uzoqlashtirish va yaqinlashtirish mumkin.",
        "Tuzilmani o'rganish: Inson organlari, hayvonot olami va o'simlik hujayralarini qismlarga ajratib ko'rish.",
        "Tushuntirishlar: Har bir qism ustiga bosganda uning nomi va vazifasi chiqib keladi.",
        "Vizual xotira: Ko'rib o'rganish orqali ma'lumotlarni yodda saqlash samaradorligi oshadi."
      ],
      image: "/screenshots/models.png?v=2"
    },
    {
      title: "7. Test Topshiriqlari",
      description: "O'z bilimingizni sinab ko'rish va mustahkamlash uchun mo'ljallangan testlar tizimi.",
      subPoints: [
        "Turli qiyinchiliklar: Testlar oson, o'rta va qiyin darajalarga ajratilgan.",
        "Darhol natija: Testni tugatishingiz bilan ekranga sizning ballingiz va xatolaringiz chiqadi.",
        "Xatolar ustida ishlash: Qaysi savollarga noto'g'ri javob berganingizni aniq ko'rib olasiz.",
        "Mukofotlar: Yuqori natijalar uchun qo'shimcha XP ballari taqdim etiladi."
      ],
      image: "/screenshots/quizzes.png?v=2"
    },
    {
      title: "8. Darsdan tashqari topshiriqlar",
      description: "O'qituvchi tomonidan beriladigan maxsus ijodiy va amaliy vazifalar majmuasi.",
      subPoints: [
        "Tadqiqotlar: Tabiatni o'rganish bo'yicha kichik amaliy loyihalar.",
        "Fayl yuklash: Bajarilgan vazifani rasm yoki hujjat ko'rinishida tizimga biriktirish.",
        "O'qituvchi bahosi: Ustozingiz yuklagan ishingizni tekshirib, shaxsiy fikr va baho qoldiradi.",
        "Muloqot: Vazifa yuzasidan o'qituvchi bilan izohlar orqali fikr almashish."
      ],
      image: "/screenshots/extracurricular.png?v=2"
    },
    {
      title: "9. Krossvordlar",
      description: "Biologiyaga oid atamalarni o'yin orqali yodlashga yordam beruvchi bo'lim.",
      subPoints: [
        "Mantiqiy fikrlash: Atamalarning izohiga qarab, ularning qaysi so'z ekanligini topish.",
        "Lug'at boyligi: Har bir krossvord orqali yangi va murakkab ilmiy so'zlarni o'rganish.",
        "Avtomatik tekshirish: So'z to'g'ri yozilsa, katakchalar avtomatik ravishda yashil rangga kiradi.",
        "Qo'shimcha ballar: Krossvordni to'liq yechib bo'lgach maxsus yutuqlar beriladi."
      ],
      image: "/screenshots/crosswords.png?v=2"
    },
    {
      title: "10. O'yinlar",
      description: "Dam olish va mantiqni o'stirishga qaratilgan kichik ta'limiy o'yinlar.",
      subPoints: [
        "Moslashtirish: Rasm va atamalarni bir-biriga mos topish (Memory game).",
        "Tezkorlik: Vaqt chegaralangan holda berilgan savollarga eng to'g'ri javobni belgilash.",
        "Dam olish: Dars tayyorlashdan charchaganda miyani chalg'itish uchun ajoyib vosita.",
        "Qiziqishni oshirish: Ta'limni qiziqarli o'yinlarga aylantirish orqali fanga mehr uyg'otadi."
      ],
      image: "/screenshots/games.png?v=2"
    },
    {
      title: "11. AI Yordamchi",
      description: "Sizning sutkasiga 24 soat ishlaydigan shaxsiy virtual o'qituvchingiz (Sun'iy intellekt).",
      subPoints: [
        "Savol-javob: Istalgan biologik jarayon yoki atama haqida chat orqali savol berishingiz mumkin.",
        "Sodda tushuntirish: Eng qiyin mavzularni ham hayotiy misollar bilan oddiy tilda tushuntirib beradi.",
        "Tezkorlik: Savolingizga soniyalar ichida aniq javob olasiz.",
        "Tavsiyalar: Qanday qilib yaxshiroq o'qish bo'yicha maslahatlar ham beradi."
      ],
      image: "/screenshots/tutor.png?v=2"
    },
    {
      title: "12. Lug'at",
      description: "Biologiya fanidagi barcha ilmiy atama va so'zlarning izohli elektron lug'ati.",
      subPoints: [
        "Oson qidiruv: Kerakli so'zni yozishingiz bilan uning to'liq izohi chiqib keladi.",
        "Ma'nolari: So'zning qanday kelib chiqqani va nimani anglatishi tushuntiriladi.",
        "Misollar: So'zning gap ichida qanday ishlatilishi ko'rsatiladi.",
        "Alfavit tartibi: Barcha so'zlar A-Z tartibida chiroyli ro'yxat qilingan."
      ],
      image: "/screenshots/glossary.png?v=2"
    },
    {
      title: "13. Qiziqarli Faktlar",
      description: "Tabiat va hayvonot olami haqidagi ajoyib va hayratlanarli ma'lumotlar jamlanmasi.",
      subPoints: [
        "Noyob ma'lumotlar: Darsliklarda yozilmagan, lekin juda qiziqarli bo'lgan faktlar.",
        "Kunlik yangilanish: Tez-tez yangi faktlar qo'shilib turiladi.",
        "O'qishga oson: Ma'lumotlar qisqa, tushunarli va chiroyli rasmlar bilan bezatilgan.",
        "Bo'lishish: Bilganlaringizni do'stlaringizga aytib berish uchun ajoyib manba."
      ],
      image: "/screenshots/facts.png?v=2"
    },
    {
      title: "14. O'zlashtirish (Statistika)",
      description: "O'quv yili davomidagi ta'lim ko'rsatkichlaringizni tahlil qilib beruvchi sahifa.",
      subPoints: [
        "Vaqt hisobi: Platformada dars o'qish uchun sarflagan jami vaqtingiz.",
        "Test tahlili: Barcha ishlangan testlardagi o'rtacha foiz va to'g'ri javoblar nisbati.",
        "Grafiklar: O'sish yoki pasayishni yaqqol ko'rsatib beruvchi ustunli va chiziqli grafiklar.",
        "Kamchiliklar: Qaysi mavzularda ko'proq xato qilayotganingizni ko'rsatib turadi."
      ],
      image: "/screenshots/progress.png?v=2"
    },
    {
      title: "15. Yutuqlar",
      description: "Faolligingiz va yaxshi baholaringiz uchun beriladigan maxsus virtual mukofotlar.",
      subPoints: [
        "Medallar: Muayyan marralarni egallaganda tizim avtomatik nishonlar beradi.",
        "Unvonlar: Masalan, 'Biologiya bilimdoni', '100% natijachi' kabi maqomlar.",
        "Kolleksiya: Olingan barcha yutuqlar maxsus javonda chiroyli tarzda saqlanadi.",
        "Motivatsiya: Ko'proq yutuq yig'ish o'qishga bo'lgan ishtiyoqni oshiradi."
      ],
      image: "/screenshots/achievements.png?v=2"
    },
    {
      title: "16. Reyting",
      description: "Boshqa o'quvchilar bilan sog'lom raqobatlashish uchun yetakchilar jadvali.",
      subPoints: [
        "XP Ballari: To'plangan tajriba ballari asosida o'quvchilar reytingi tuziladi.",
        "O'z o'rningiz: Minglab o'quvchilar orasida nechinchi o'rinda ekanligingizni ko'rasiz.",
        "Top-10: Eng yaxshi natija ko'rsatgan peshqadamlar ro'yxati alohida ko'rsatiladi.",
        "Raqobat: Yuqori o'rinlarga chiqish uchun ko'proq vazifalarni to'g'ri bajarishga intilasiz."
      ],
      image: "/screenshots/leaderboard.png?v=2"
    },
    {
      title: "17. Mening Maqsadlarim",
      description: "O'z oldingizga reja qo'yish va ularga erishishni kuzatib boruvchi vosita.",
      subPoints: [
        "Rejalashtirish: Kunlik yoki haftalik vazifalarni belgilab olish (masalan, 2 ta test yechish).",
        "Taraqqiyot ko'rsatkichi: Rejaning necha foizi bajarilgani avtomatik hisoblanadi.",
        "Vaqtni boshqarish: Taym-menejment ko'nikmalarini shakllantirishga yordam beradi.",
        "Erishilgan maqsadlar: Bajarib bo'lingan rejalar ustiga chizilib, sizga mamnuniyat bag'ishlaydi."
      ],
      image: "/screenshots/goals.png?v=2"
    },
    {
      title: "18. Sozlamalar",
      description: "Platformani aynan o'zingizning xohishingizga moslashtirish (shaxsiylashtirish) oynasi.",
      subPoints: [
        "Tungi rejim: Kechasi ko'z toliqmasligi uchun sayt fonini qoraytirish (Dark mode).",
        "Bildirishnomalar: Tizimdan keladigan xabarlarni yoqish yoki o'chirish.",
        "Ovozlar: Tugmalarni bosgandagi va yutuq olingandagi ovozlarni boshqarish.",
        "Xavfsizlik sozlamalari: Akkauntni himoyalash va sessiyalarni nazorat qilish."
      ],
      image: "/screenshots/settings.png?v=2"
    },
    {
      title: "19. Boshqaruv Paneli (Admin)",
      description: "Ustozlar va platformani boshqaruvchilar uchun maxsus yopiq bo'lim.",
      subPoints: [
        "O'quvchilar nazorati: Barcha foydalanuvchilar ro'yxati, parolini tiklash va baholarini ko'rish.",
        "Kontent qo'shish: Yangi testlar, darslar va kitoblarni tizimga joylashtirish.",
        "Statistika: Butun platformaning umumiy faollik ko'rsatkichlarini kuzatish.",
        "Ruxsatlar: Oddiy o'quvchilarga bu bo'lim umuman ko'rinmaydi va faqat adminlar kira oladi."
      ],
      image: "/screenshots/admin.png?v=2"
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="text-primary-500" />
            Tizimdan Foydalanish Qo'llanmasi
          </h1>
          <p className="text-foreground/60 mt-2">Barcha funksiyalar va ularning vazifalari bilan tanishing.</p>
        </div>
        
        <button 
          onClick={downloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {downloading ? "Yuklanmoqda..." : "PDF yuklab olish"}
        </button>
      </div>

      <div 
        ref={pdfRef} 
        className="bg-white p-8 rounded-3xl border border-gray-200 text-black print:border-none print:p-0 print:m-0"
        style={{ fontFamily: "'Inter', 'Times New Roman', Times, serif", fontSize: "12pt", lineHeight: "1.5", color: "#111827" }}
      >
        <div className="text-center mb-12 border-b border-gray-200 pb-8">
          <h2 className="text-3xl font-extrabold mb-3 text-black">Biokompetensiya Tizimi</h2>
          <p className="text-gray-600 text-lg">Platformadan to'g'ri va samarali foydalanish bo'yicha to'liq qo'llanma</p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div key={index} className="feature-item pb-10" style={{ pageBreakInside: "avoid" }}>
              {/* Rasm qismi (Yuqorida) */}
              <div className="w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center justify-center relative mb-8 group p-2 bg-gray-50/50">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="max-w-full h-auto object-contain rounded-xl drop-shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 flex-col items-center justify-center text-gray-400 hidden">
                   <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                   <span className="font-medium text-sm">Rasm yuklanmadi</span>
                </div>
              </div>

              {/* Matn qismi (Rasm tagida) */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-2xl font-bold mb-3 text-primary-700">{feature.title}</h3>
                <p className="text-gray-700 mb-5 font-medium leading-relaxed text-[13pt]">
                  {feature.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feature.subPoints?.map((point, idx) => {
                    const [title, ...rest] = point.split(': ');
                    const content = rest.join(': ');
                    return (
                      <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600 text-[12pt] leading-relaxed">
                          <strong className="text-gray-900 font-semibold">{title}:</strong> {content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

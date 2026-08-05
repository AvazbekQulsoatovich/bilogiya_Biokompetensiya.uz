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

      pdf.save('BioEdu_Qollanma.pdf');
    } catch (error: any) {
      console.error("PDF yuklashda xatolik:", error);
      alert("Xatolik yuz berdi: " + (error.message || "Yuklab olishda muammo."));
    } finally {
      setDownloading(false);
    }
  };

  const features = [
    {
      title: "1. Asosiy Oyna (Dashboard)",
      description: "Platformaning markaziy axborot paneli. Bu yerda real vaqt rejimida foydalanuvchining o'quv jarayoni statistikasi, faollik ko'rsatkichlari (Activity metrics), to'plangan XP (Experience Points) va tangalar (Coins) miqdori vizual tarzda taqdim etiladi. Tizim avtomatik ravishda oxirgi o'zlashtirilgan materiallarni tahlil qilib, davomiylikni saqlash (Streak) uchun aqlli tavsiyalar beradi.",
      image: "/screenshots/dashboard.png"
    },
    {
      title: "2. Profilim",
      description: "Shaxsiy identifikatsiya va akkauntni boshqarish moduli. Foydalanuvchi o'zining biometrik va shaxsiy ma'lumotlarini tahrirlashi, xavfsizlik sozlamalarini (parolni yangilash) amalga oshirishi va o'quv natijalari tarixini kuzatishi mumkin. Barcha ma'lumotlar zamonaviy kriptografik usullar bilan himoyalangan.",
      image: "/screenshots/profile.png"
    },
    {
      title: "3. Mavzular va O'quv Materiallari",
      description: "Asosiy ta'lim kontenti arxitekturasi. Modul sinflar (masalan, 5-sinf Botanika, 6-sinf Biologiya) bo'yicha tizimlashtirilgan. Har bir mavzu multimedia fayllari (videodarslar, interaktiv taqdimotlar) va nazariy matnlar bilan boyitilgan. Materiallar asinxron tarzda yuklanadi, bu esa tizim ishlash tezligi (Performance) va foydalanuvchi tajribasini (UX) sezilarli darajada oshiradi.",
      image: "/screenshots/topics.png"
    },
    {
      title: "4. Darsliklar",
      description: "Raqamlashtirilgan adabiyotlar bazasi (E-Library). Respublika davlat ta'lim standartlariga mos maktab darsliklari hamda qo'shimcha ilmiy-ommabop kitoblar integratsiya qilingan. Kitoblarni oflayn o'qish imkoniyati hamda interaktiv sahifalash tizimi joriy etilgan.",
      image: "/screenshots/books.png"
    },
    {
      title: "5. Virtual Laboratoriyalar",
      description: "Amaliy mashg'ulotlarni simulyatsiya qiluvchi raqamli muhit. O'quvchilar xavfsiz sharoitda, interaktiv tarzda murakkab biologik va kimyoviy jarayonlarni (masalan, fotosintez, hujayra bo'linishi) modellashtirishi mumkin. Har bir eksperiment natijalari tizim tomonidan avtomatik tarzda tahlil qilinadi va baholanadi.",
      image: "/screenshots/labs.png"
    },
    {
      title: "6. 3D Modellar",
      description: "Fazo-vizual o'rganish moduli. Inson anatomiyasi, hujayra organoidlari va mikroskopik hayvonlar tuzilishini WebGL texnologiyasi asosida uch o'lchamli (3D) formatda chuqur o'rganish imkonini beradi. Obyektlarni har tomondan aylantirish, masshtablash va qismlarga ajratib ko'rish funksiyalari mavjud.",
      image: "/screenshots/models.png"
    },
    {
      title: "7. Test Topshiriqlari",
      description: "Bilimlarni tekshirish va baholash (Assessment) tizimi. Testlar kognitiv qiyinchilik darajalariga bo'lingan bo'lib, adaptiv xarakterga ega. Natijalar real vaqtda hisoblanib, foydalanuvchining kuchli va zaif tomonlari bo'yicha batafsil statistik analitika taqdim etiladi.",
      image: "/screenshots/quizzes.png"
    },
    {
      title: "8. Darsdan tashqari topshiriqlar",
      description: "Mustaqil ta'limni rivojlantirish bloki. O'qituvchilar tomonidan loyihaviy va tadqiqotga yo'naltirilgan vazifalar taqdim etiladi. Topshiriq fayllarini serverga yuklash va pedagog tomonidan baholanish jarayoni to'liq avtomatlashtirilgan.",
      image: "/screenshots/extracurricular.png"
    },
    {
      title: "9. Krossvordlar",
      description: "Gamifikatsiya (Gamification) elementlariga asoslangan terminologik mashqlar. Biologik atamalar, tushunchalar va ularning qonuniyatlarini kognitiv usulda yodlashga ko'maklashuvchi, intellektual salohiyatni oshiruvchi interaktiv krossvordlar to'plami.",
      image: "/screenshots/crosswords.png"
    },
    {
      title: "10. O'yinlar",
      description: "Ta'limiy-ko'ngilochar modul (Edutainment). Mantiqiy va xotirani charxlovchi maxsus o'yinlar orqali foydalanuvchining biologiya faniga bo'lgan qiziqishini orttirish hamda akademik o'rganish jarayonini qiziqarli ko'rinishga keltirish maqsad qilingan.",
      image: "/screenshots/games.png"
    },
    {
      title: "11. AI Yordamchi",
      description: "Generativ sun'iy intellekt (LLM) asosida ishlovchi virtual repetitor (Smart Tutor). O'quvchi tomonidan berilgan har qanday murakkab biologik savollarga ilmiy asoslangan, ammo auditoriya yoshiga moslashtirilgan, kontekstni tushungan holda zudlik bilan aniq javoblar shakllantiradi.",
      image: "/screenshots/tutor.png"
    },
    {
      title: "12. Lug'at",
      description: "Markazlashtirilgan va keng qamrovli terminologik ma'lumotlar bazasi. Lotin va o'zbek tillaridagi ilmiy atamalarning izohli lug'ati bo'lib, tezkor qidiruv (Live Search) algoritmi yordamida kerakli so'zni soniyaning ulushlarida topish va uning ilmiy talqinini o'rganish mumkin.",
      image: "/screenshots/glossary.png"
    },
    {
      title: "13. Qiziqarli Faktlar",
      description: "Kognitiv qiziqishni orttiruvchi mikro-ta'lim (Microlearning) bloki. Biologiya olamidagi so'nggi ilmiy kashfiyotlar, noyob flora va fauna vakillari hamda genetik mo'jizalar haqidagi tasdiqlangan infografik va matnli ma'lumotlar davriy ravishda yangilanib boradi.",
      image: "/screenshots/facts.png"
    },
    {
      title: "14. O'zlashtirish",
      description: "Chuqurlashtirilgan analitika (Data Analytics) paneli. Foydalanuvchining ta'lim traektoriyasi, o'qishga sarflagan jami vaqti, testlardagi o'rtacha muvaffaqiyat ko'rsatkichi va o'zlashtirish dinamikasi maxsus interaktiv grafiklar (Charts) orqali batafsil aks ettiriladi.",
      image: "/screenshots/progress.png"
    },
    {
      title: "15. Yutuqlar",
      description: "Motivatsion mukofotlash tizimi. Tizimda belgilangan muayyan akademik maqsadlarga erishganda (masalan, barcha modulni 100% natija bilan yopish yoki uzluksiz 7 kunlik faollik) avtomatik ravishda beriladigan raqamli nishonlar (Digital Badges) va unvonlar to'plami.",
      image: "/screenshots/achievements.png"
    },
    {
      title: "16. Reyting",
      description: "Raqobat muhitini shakllantiruvchi reyting moduli (Leaderboard). Barcha foydalanuvchilarning ta'limiy faoliyati va to'plagan XP ballari asosida hisoblanadigan global va hududiy reyting jadvali bo'lib, o'quvchilar o'rtasida sog'lom intellektual bellashuvni rag'batlantiradi.",
      image: "/screenshots/leaderboard.png"
    },
    {
      title: "17. Mening Maqsadlarim",
      description: "Shaxsiy taym-menejment va vazifalarni belgilash (Goal Setting) moduli. Foydalanuvchi o'zi uchun kunlik, haftalik yoki oylik o'quv maqsadlarini (masalan, 5 ta mavzu o'qish, 100 ball to'plash) shakllantirishi va maqsadlarga erishish foizini tizim orqali monitoring qilib borishi ko'zda tutilgan.",
      image: "/screenshots/goals.png"
    },
    {
      title: "18. Sozlamalar",
      description: "Ilova arxitekturasi va interfeysini shaxsiylashtirish (Customization) moduli. Qorong'u/Yorug' (Dark/Light) vizual mavzularni o'zgartirish, tizim bildirishnomalarini optimallashtirish, xavfsizlik sozlamalari va til preferensiyalarini adaptatsiya qilish imkoniyatlarini taqdim etadi.",
      image: "/screenshots/settings.png"
    },
    {
      title: "19. Boshqaruv Paneli (Admin)",
      description: "Super Admin hamda kontent-menejerlar uchun yopiq ma'lumotlarni boshqarish tizimi (CMS - Content Management System). Foydalanuvchilarga ruxsatlarni (Role-based Access Control) taqsimlash, yangi ta'limiy kontentlar yaratish (CRUD operatsiyalari), to'lov yoki obuna monitoringini yuritish va tizim barqarorligi loglarini (System Logs) markazlashgan holda boshqarishni ta'minlaydi.",
      image: "/screenshots/admin.png"
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
        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "14pt", lineHeight: "1.15", color: "#000000" }}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2 text-black">BioEdu Tizim Qo'llanmasi</h2>
          <p className="text-gray-700">Platformadan qanday foydalanish haqida to'liq ma'lumot.</p>
        </div>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <div key={index} className="feature-item border-b border-gray-200 pb-10 last:border-0 last:pb-0" style={{ pageBreakInside: "avoid" }}>
              <h3 className="text-xl font-bold mb-4 text-black">{feature.title}</h3>
              
              {/* Screenshot Image */}
              <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-border/50 bg-foreground/5 min-h-[200px] flex items-center justify-center relative mb-6">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }} 
                />
                <div className="absolute inset-0 flex-col items-center justify-center text-foreground/40 hidden">
                   <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                   <span className="font-medium text-sm">Rasm yuklanmadi yoki topilmadi</span>
                </div>
              </div>

              <p className="text-black" style={{ textAlign: "justify", color: "#000000" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

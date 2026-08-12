"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Box, Search, Info, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";

// A neat 3D Tilt Card component
function TiltCard({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full h-full cursor-pointer"
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export default function ModelsPage() {
  const models = [
    {
      id: "plant-cell",
      title: "O'simlik Hujayrasi",
      description: "O'simlik hujayrasining o'ziga xos organellalari: xloroplast, yirik vakuola va qalin sellyuloza qobig'i bilan tanishing.",
      image: "/images/plant_cell_3d_1786544055211.jpg",
      details: "O'simlik hujayralari to'g'ri to'rtburchak shaklga ega bo'lib, ular asosan hujayra devori orqali mustahkamlanadi. Xloroplastlar yordamida quyosh nuridan energiya olib fotosintez jarayonini amalga oshiradi."
    },
    {
      id: "animal-cell",
      title: "Hayvon Hujayrasi",
      description: "Hayvon hujayrasi tuzilishi, membranasi, yadrosi va energiya manbai bo'lgan mitoxondriyalar.",
      image: "/images/animal_cell_3d_1786544097855.jpg",
      details: "Hayvon hujayrasida mustahkam qobiq yo'q, shuning uchun ular turli shakllarga kira oladi. Ular oziq moddalarni tashqaridan o'zlashtiradi."
    },
    {
      id: "amoeba",
      title: "Amyoba (Amoeba proteus)",
      description: "Oddiy bir hujayrali hayvon, soxta oyoqlari yordamida harakatlanadi.",
      image: "/images/amoeba_3d_1786544132964.jpg",
      details: "Amyoba shaklsiz mikroskopik organizm bo'lib, o'zining sitoplazmasini bir tomonga oqizish orqali soxta oyoqlar hosil qiladi va shu orqali harakatlanadi hamda oziqlanadi."
    },
    {
      id: "infusoria",
      title: "Infuzoriya-tufelka",
      description: "Kiprikchali bir hujayrali hayvon. Tuzilishi poyabzal iziga o'xshaydi.",
      image: "/images/paramecium_3d_1786544182313.jpg",
      details: "Tufelka shaklidagi bu organizm butun tanasini qoplagan minglab kiprikchalar yordamida tez harakatlanadi. Uning ikkita yadrosi bor: katta va kichik."
    },
    {
      id: "leaf-structure",
      title: "Bargning Ichki Tuzilishi",
      description: "Barg po'sti, ustunsimon va g'ovak to'qimalar hamda barg og'izchalari.",
      image: "/images/leaf_structure_3d_1786544229321.jpg",
      details: "Barg qalinligi kichik bo'lishiga qaramay, u murakkab qatlamlardan iborat. Ustki qismida ko'p xloroplast tutuvchi ustunsimon to'qima, ostki qismida esa karbonat angidrid kirishi uchun og'izchalar joylashgan."
    },
    {
      id: "dna",
      title: "DNK Spirali",
      description: "Barcha tirik organizmlarning irsiy axborotini saqlovchi qo'sh spiralli molekula.",
      image: "/images/dna_3d_1786544264801.jpg",
      details: "Dezoksiribonuklein kislotasi (DNK) — bu organizmning rivojlanishi va ishlashi uchun zarur bo'lgan genetik ko'rsatmalarni o'z ichiga olgan makromolekuladir."
    }
  ];

  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20 text-white">
            <Box className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">3D Modellar</h1>
            <p className="text-gray-500 mt-2 font-medium">Biologik obyektlarning 3D ko'rinishlari, batafsil izohlari va tuzilishini interaktiv tarzda o'rganing.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {models.map((model, idx) => (
          <motion.div 
            key={model.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            {/* 3D Tilt Card Area */}
            <div className="relative aspect-[4/3] perspective-1000">
              <TiltCard onClick={() => { setSelectedModel(model); setZoom(1); }}>
                <div className="absolute inset-0 bg-white rounded-3xl p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 transition-all duration-300">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100 group">
                    <img 
                      src={model.image} 
                      alt={model.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ transform: "translateZ(50px)" }} // Adds depth to the image during tilt
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* View Button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold flex items-center gap-2 border border-white/30 shadow-2xl" style={{ transform: "translateZ(80px)" }}>
                        <Maximize2 className="w-5 h-5" /> Kengaytirish
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Description Area */}
            <div className="mt-6 flex flex-col flex-1 px-2">
              <h3 className="text-2xl font-black text-gray-900 mb-2">{model.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{model.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Model Viewer Modal */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-6xl max-h-full overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row relative"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedModel(null)}
              className="absolute top-4 right-4 z-20 w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Left: Interactive 3D/Zoom View */}
            <div className="w-full lg:w-3/5 bg-gray-900 relative min-h-[400px] lg:min-h-[600px] flex items-center justify-center overflow-hidden rounded-t-[2.5rem] lg:rounded-l-[2.5rem] lg:rounded-tr-none">
              <motion.div 
                className="relative w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                drag
                dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                style={{ scale: zoom }}
              >
                <img 
                  src={selectedModel.image} 
                  alt={selectedModel.title}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </motion.div>
              
              {/* Zoom Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="text-white hover:text-purple-400 transition-colors p-2"><ZoomOut className="w-6 h-6" /></button>
                <span className="text-white font-mono font-bold w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
                <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="text-white hover:text-purple-400 transition-colors p-2"><ZoomIn className="w-6 h-6" /></button>
              </div>

              <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/80 text-sm font-medium">
                <Search className="w-4 h-4" /> Sichqoncha bilan suring
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="w-full lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-full mb-6 w-max">
                <Info className="w-5 h-5" /> Batafsil Ma'lumot
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{selectedModel.title}</h2>
              
              <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                {selectedModel.description}
              </p>
              
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
                <h4 className="font-bold text-gray-900 mb-4 text-lg uppercase tracking-wider text-sm">Ilmiy Izoh</h4>
                <p className="text-gray-600 leading-loose">
                  {selectedModel.details}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

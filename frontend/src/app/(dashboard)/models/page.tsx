"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Maximize2 } from "lucide-react";

export default function ModelsPage() {
  const models = [
    {
      id: "animal-cell",
      title: "Hayvon Hujayrasi (3D Animatsiya)",
      description: "Hujayra organellalari bilan tanishing",
      embedId: "URUJD5NEXC8",
    },
    {
      id: "dna",
      title: "DNK Spirali (3D Animatsiya)",
      description: "Irsiyat tashuvchisi bo'lgan molekula",
      embedId: "8kK2zwjRV0M",
    },
    {
      id: "human-heart",
      title: "Odam Yuragi (3D Animatsiya)",
      description: "Qon aylanish sistemasi markazi",
      embedId: "CWFyxn0qDEU",
    },
    {
      id: "virus",
      title: "Viruslar Tuzilishi (3D Animatsiya)",
      description: "Viruslarning umumiy tuzilishi",
      embedId: "8FqlTslU22s",
    }
  ];

  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary-500/10 rounded-2xl">
          <Box className="w-8 h-8 text-primary-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">3D Modellar</h1>
          <p className="text-foreground/60 mt-1">Biologik obyektlarni 360 daraja aylantirib, batafsil o'rganing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {models.map((model, idx) => (
          <motion.div 
            key={model.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-3xl border border-border/50 overflow-hidden group shadow-lg"
          >
            <div className="relative w-full aspect-video bg-background/50">
              {selectedModel === model.id ? (
                <iframe 
                  title={model.title}
                  frameBorder="0"
                  allowFullScreen
                  mozallowfullscreen="true"
                  webkitallowfullscreen="true"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  src={`https://www.youtube.com/embed/${model.embedId}?autoplay=1`}
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 group-hover:bg-background/60 transition-all cursor-pointer" onClick={() => setSelectedModel(model.id)}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform">
                      <Maximize2 className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-lg">Ko'rish</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{model.title}</h3>
              <p className="text-foreground/70">{model.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Grid3x3, Play } from "lucide-react";
import Link from "next/link";
import { Page, PageHeader, EmptyState, CardGridSkeleton } from "@/components/ui";

export default function CrosswordsPage() {
  const [crosswords, setCrosswords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/crosswords`);
        const data = await res.json();
        setCrosswords(Array.isArray(data) ? data : data?.crosswords || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Page>
      <PageHeader
        icon={Grid3x3}
        eyebrow="Sinov va mashq"
        title="Krossvordlar"
        subtitle="Biologik atamalarni topib, xotirangizni mashq qildiring. Toʻliq yechilgan krossvord uchun 50 XP beriladi."
      />

      {loading ? (
        <CardGridSkeleton />
      ) : crosswords.length === 0 ? (
        <EmptyState icon={Grid3x3} title="Hozircha krossvordlar mavjud emas" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {crosswords.map((cw, i) => (
            <motion.div
              key={cw.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04 }}
              className="card card-hover flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                  <Grid3x3 className="w-5 h-5" />
                </span>
                <span className="chip chip-accent">★ +50 XP</span>
              </div>
              <h2 className="font-display text-lg font-semibold leading-snug mb-1.5">{cw.title}</h2>
              <p className="text-muted text-sm flex-1 mb-5">{cw.description}</p>
              <Link href={`/crosswords/${cw.id}`} className="btn btn-primary w-full">
                <Play className="w-4 h-4 fill-current" /> Yechish
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </Page>
  );
}

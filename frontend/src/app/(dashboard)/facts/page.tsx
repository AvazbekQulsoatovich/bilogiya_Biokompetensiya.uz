"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Leaf, PawPrint } from "lucide-react";
import { Page, PageHeader, Segmented, EmptyState, CardGridSkeleton } from "@/components/ui";

const CATEGORY: Record<string, { label: string; icon: typeof Leaf }> = {
  BOTANY: { label: "Botanika", icon: Leaf },
  ZOOLOGY: { label: "Zoologiya", icon: PawPrint },
};

export default function FactsPage() {
  const [facts, setFacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/facts`);
        const data = await res.json();
        setFacts(Array.isArray(data) ? data : data?.facts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const list = useMemo(() => facts.filter((f) => filter === "ALL" || f.category === filter), [facts, filter]);

  return (
    <Page>
      <PageHeader
        icon={Lightbulb}
        eyebrow="Oʻrganish"
        title="Qiziqarli faktlar"
        subtitle="Oʻsimliklar va hayvonlar olamidan ilmiy asoslangan qiziqarli maʼlumotlar."
      >
        <Segmented
          label="Yoʻnalish"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "ALL", label: "Hammasi" },
            { value: "BOTANY", label: "Botanika" },
            { value: "ZOOLOGY", label: "Zoologiya" },
          ]}
        />
      </PageHeader>

      {loading ? (
        <CardGridSkeleton />
      ) : list.length === 0 ? (
        <EmptyState icon={Lightbulb} title="Hozircha faktlar yoʻq" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((fact, i) => {
            const cat = CATEGORY[fact.category] || { label: "Umumiy", icon: Lightbulb };
            const Icon = cat.icon;
            return (
              <motion.article
                key={fact.id || i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i % 9, 8) * 0.04 }}
                className={`${fact.category === "ZOOLOGY" ? "tone-amber" : "tone-green"} card card-hover relative flex flex-col p-6 pt-7 overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="chip chip-brand">
                    <Icon className="w-3.5 h-3.5" /> {cat.label}
                  </span>
                  <span className="font-display text-3xl font-semibold text-brand/25 tabular-nums leading-none">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="font-display text-xl font-semibold leading-snug mb-2.5">{fact.title}</h2>
                <p className="text-ink-2 text-[0.95rem] leading-relaxed whitespace-pre-wrap">{fact.content}</p>
              </motion.article>
            );
          })}
        </div>
      )}
    </Page>
  );
}

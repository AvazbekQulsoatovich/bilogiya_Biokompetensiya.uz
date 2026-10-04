"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Microscope, Play, FlaskConical, Ruler, Sprout, Network, Droplets, Sun, Flower2, Dna, HeartPulse, Atom,
} from "lucide-react";
import { Page, PageHeader, Segmented, EmptyState, CardGridSkeleton } from "@/components/ui";

const LAB_ICON: Record<string, typeof Microscope> = {
  MICROSCOPE: Microscope,
  CHEMISTRY: FlaskConical,
  MEASUREMENT: Ruler,
  GERMINATION: Sprout,
  FOODWEB: Network,
  OSMOSIS: Droplets,
  PHOTOSYNTHESIS: Sun,
  DISSECTION: Flower2,
  DNA_EXTRACTION: Dna,
  GENETICS: Dna,
  HEARTRATE: HeartPulse,
  CELLBUILDER: Atom,
};

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<5 | 6>(5);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/labs`);
        const data = await res.json();
        setLabs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Laboratoriyalarni yuklab boʻlmadi", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = labs.filter((l) => l.gradeLevel === activeTab);

  return (
    <Page>
      <PageHeader
        icon={Microscope}
        eyebrow="Amaliyot"
        title="Virtual laboratoriyalar"
        subtitle="Biologik jarayonlarni xavfsiz muhitda, oʻz qoʻlingiz bilan bajarib oʻrganing. Har bir qadam tekshiriladi."
      >
        <Segmented
          label="Sinf"
          value={activeTab}
          onChange={(v) => setActiveTab(v as 5 | 6)}
          options={[
            { value: 5, label: "5-sinf", hint: "Tabiiy fanlar" },
            { value: 6, label: "6-sinf", hint: "Biologiya" },
          ]}
        />
      </PageHeader>

      {loading ? (
        <CardGridSkeleton count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Microscope} title={`${activeTab}-sinf uchun hali tajribalar yoʻq`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((lab, i) => {
            const Icon = LAB_ICON[lab.type] || Microscope;
            const [num, ...rest] = String(lab.title).split(": ");
            const title = rest.length ? rest.join(": ") : lab.title;
            return (
              <motion.article
                key={lab.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card card-hover flex flex-col overflow-hidden"
              >
                <div className="lab-bench m-3 mb-0 h-28 flex items-center justify-center relative">
                  <Icon className="w-12 h-12 text-brand" strokeWidth={1.4} />
                  <span className="absolute top-3 left-3 chip">{rest.length ? num : `${i + 1}-mashgʻulot`}</span>
                  <span className="absolute top-3 right-3 chip chip-accent">★ +{lab.rewardXp} XP</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-display text-lg font-semibold leading-snug mb-2">{title}</h2>
                  <p className="text-muted text-sm flex-1 mb-5">{lab.description}</p>
                  <Link href={`/labs/${lab.id}`} className="btn btn-primary w-full">
                    <Play className="w-4 h-4 fill-current" /> Tajribani boshlash
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </Page>
  );
}

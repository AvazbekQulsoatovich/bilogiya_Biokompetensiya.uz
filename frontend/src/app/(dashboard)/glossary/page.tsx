"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Library, Search } from "lucide-react";
import { Page, PageHeader, EmptyState, CardGridSkeleton } from "@/components/ui";
import { includesUz, normalizeUz } from "@/lib/text";

export default function GlossaryPage() {
  const [terms, setTerms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/glossary`);
        const data = await res.json();
        setTerms(Array.isArray(data) ? data : data?.terms || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const firstLetter = (t: string) => normalizeUz(t).replace(/[^a-zʻ']/i, "").charAt(0).toUpperCase() || "#";

  const sorted = useMemo(() => [...terms].sort((a, b) => a.term.localeCompare(b.term, "uz")), [terms]);
  const letters = useMemo(() => Array.from(new Set(sorted.map((t) => firstLetter(t.term)))), [sorted]);

  const filtered = sorted.filter(
    (t) =>
      (!letter || firstLetter(t.term) === letter) &&
      (!search.trim() || includesUz(t.term, search) || includesUz(t.definition, search))
  );

  return (
    <Page narrow>
      <PageHeader
        icon={Library}
        eyebrow="Oʻrganish"
        title="Biologik atamalar lugʻati"
        subtitle={`${terms.length || ""} ${terms.length ? "ta atama va ularning" : "Atamalar va"} ilmiy izohlari. Harf boʻyicha tanlang yoki qidiring.`}
      />

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="search"
          className="input !pl-12 !py-3.5"
          placeholder="Atama yoki izoh boʻyicha qidirish…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Atama qidirish"
        />
      </div>

      {letters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-8" role="group" aria-label="Harf boʻyicha filtr">
          <button
            onClick={() => setLetter(null)}
            className={`chip cursor-pointer ${letter === null ? "chip-brand" : ""}`}
            aria-pressed={letter === null}
          >
            Hammasi
          </button>
          {letters.map((l) => (
            <button
              key={l}
              onClick={() => setLetter(letter === l ? null : l)}
              className={`chip cursor-pointer min-w-8 justify-center ${letter === l ? "chip-brand" : ""}`}
              aria-pressed={letter === l}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <CardGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Atama topilmadi" text="Qidiruv soʻzini oʻzgartirib koʻring." />
      ) : (
        <dl className="grid gap-3">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 10) * 0.025 }}
              className="card px-6 py-5 grid grid-cols-1 sm:grid-cols-[13rem_1fr] gap-x-6 gap-y-1"
            >
              <dt className="font-display text-lg font-semibold text-brand">{t.term}</dt>
              <dd className="text-ink-2 leading-relaxed">{t.definition}</dd>
            </motion.div>
          ))}
        </dl>
      )}
    </Page>
  );
}

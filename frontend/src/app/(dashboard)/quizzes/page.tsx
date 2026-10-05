"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Play, Plus, BookOpen, Layers, Search } from "lucide-react";
import Link from "next/link";
import { Page, PageHeader, Segmented, EmptyState, CardGridSkeleton, Modal, Field } from "@/components/ui";
import { includesUz } from "@/lib/text";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [activeGrade, setActiveGrade] = useState<number>(5);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      setUserRole(localStorage.getItem("userRole"));
      setToken(localStorage.getItem("token"));
      const saved = sessionStorage.getItem("quizzesActiveGrade");
      if (saved) setActiveGrade(Number(saved));
    } catch {}
    fetchQuizzes();
  }, []);

  const handleGrade = (grade: number) => {
    setActiveGrade(grade);
    try {
      sessionStorage.setItem("quizzesActiveGrade", String(grade));
    } catch {}
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`/api/quizzes`);
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : data?.quizzes || []);
    } catch (e) {
      console.error("Testlarni yuklab boʻlmadi", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          title: newTitle,
          questions: [
            { type: "MULTIPLE_CHOICE", content: "Yangi savol?", options: JSON.stringify(["A", "B"]), correctAnswer: "A" },
          ],
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle("");
        fetchQuizzes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const groups = useMemo(() => {
    const filtered = quizzes
      .filter((q) => (q.lesson?.course?.gradeLevel || 5) === activeGrade)
      .filter((q) => !query.trim() || includesUz(q.title, query) || includesUz(q.lesson?.title || "", query));
    const acc: Record<string, any[]> = {};
    for (const q of filtered) {
      const k = q.lesson?.title || "Umumiy testlar";
      (acc[k] ||= []).push(q);
    }
    return Object.entries(acc);
  }, [quizzes, activeGrade, query]);

  const topicGroups = groups.filter(([k]) => !/^\d+-sahifa/.test(k));
  const pageGroups = groups.filter(([k]) => /^\d+-sahifa/.test(k));

  const renderCard = (quiz: any, i: number) => {
          const n = quiz._count?.questions || 0;
          return (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 9) * 0.03 }}
              className="h-full"
            >
              <Link href={`/quizzes/${quiz.id}`} className="card card-hover group relative flex h-full flex-col p-6 overflow-hidden">
                <div
                  className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--brand) 16%, transparent), transparent)" }}
                  aria-hidden
                />
                <div className="relative flex items-center justify-between mb-5">
                  <span className="tile w-11 h-11 font-display text-lg font-semibold">{i + 1}</span>
                  <span className="chip chip-accent">★ {n * 10} XP gacha</span>
                </div>
                <h3 className="relative font-display text-lg font-semibold leading-snug line-clamp-2 min-h-[3.2rem] text-balance">{quiz.title}</h3>
                <p className="relative text-muted text-sm mt-2 mb-5 flex-1">
                  Mavzu boʻyicha test ishlab, oʻzlashtirgan bilimlaringizni tekshiring.
                </p>
                <div className="relative flex items-center justify-between pt-4 border-t border-line">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
                    <Layers className="w-4 h-4" /> {n} savol
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                    Boshlash <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        };

  const renderGroup = (lessonTitle: string, lessonQuizzes: any[]) => (
    <section key={lessonTitle}>
      <h2 className="font-display text-xl md:text-2xl font-semibold mb-5 flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </span>
        {lessonTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lessonQuizzes.map(renderCard)}
      </div>
    </section>
  );

  return (
    <Page>
      <PageHeader
        icon={ClipboardList}
        eyebrow="Sinov va mashq"
        title="Test topshiriqlari"
        subtitle="Mavzu boʻyicha bilimingizni tekshiring. Har bir toʻgʻri javob uchun 10 XP beriladi."
        actions={
          userRole === "SUPER_ADMIN" && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" /> Yangi test
            </button>
          )
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Segmented
          label="Sinf"
          value={activeGrade}
          onChange={handleGrade}
          options={[
            { value: 5, label: "5-sinf testlari" },
            { value: 6, label: "6-sinf testlari" },
          ]}
        />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="input !pl-10"
            placeholder="Test qidirish…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Test qidirish"
          />
        </div>
      </div>

      {loading ? (
        <CardGridSkeleton />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={query ? "Hech narsa topilmadi" : "Hali testlar qoʻshilmagan"}
          text={query ? "Boshqa soʻz bilan qidirib koʻring." : `Tez orada ${activeGrade}-sinf uchun testlar yuklanadi.`}
        />
      ) : (
        <div className="flex flex-col gap-12">
          {topicGroups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {topicGroups.flatMap(([, list]) => list).map(renderCard)}
            </div>
          )}

          {pageGroups.length > 0 && (
            <details className="card p-5 md:p-6 group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span>
                  <span className="font-display text-lg font-semibold block">Darslik sahifalari boʻyicha umumiy testlar</span>
                  <span className="text-sm text-muted">{pageGroups.length} ta sahifa · umumiy tabiiy fanlar savollaridan tuzilgan</span>
                </span>
                <span className="chip">Koʻrsatish</span>
              </summary>
              <div className="flex flex-col gap-10 mt-8">{pageGroups.map(([title, list]) => renderGroup(title, list))}</div>
            </details>
          )}
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yangi test">
        <p className="text-muted text-sm mb-5">Tizimga yangi test toʻplamini qoʻshish.</p>
        <form onSubmit={handleCreate}>
          <Field label="Test sarlavhasi">
            <input
              className="input"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Masalan: Hujayra tuzilishi testi"
            />
          </Field>
          <button type="submit" className="btn btn-primary w-full">Yaratish va saqlash</button>
        </form>
      </Modal>
    </Page>
  );
}

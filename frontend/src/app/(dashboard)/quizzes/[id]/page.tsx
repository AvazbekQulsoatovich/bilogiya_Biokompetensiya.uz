"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import confetti from "canvas-confetti";
import { Page, Loading, BackButton, EmptyState } from "@/components/ui";
import { shuffle } from "@/lib/text";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizSolverPage() {
  const params = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const startedAt = useRef<number>(Date.now());

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${params.id}`);
      const data = await res.json();
      if (data?.questions && Array.isArray(data.questions)) {
        data.questions = shuffle(data.questions).map((q: any) => {
          let opts: string[] = [];
          try {
            opts = q.options ? JSON.parse(q.options) : [];
          } catch {}
          return { ...q, parsedOptions: shuffle(opts) };
        });
      }
      setQuiz(data?.id ? data : null);
      startedAt.current = Date.now();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setIsSubmitted(false);
    setResult(null);
    setCorrectCount(0);
    load();
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    let score = 0;
    let corrects = 0;
    quiz.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) {
        score += 10;
        corrects++;
      }
    });
    setCorrectCount(corrects);
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));

    let data: any = {};
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/quizzes/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ score, timeSpentSeconds, answers }),
      });
      data = await res.json().catch(() => ({}));
    } catch (e) {
      console.error("Natijani saqlab boʻlmadi", e);
    }

    setIsSubmitted(true);
    setResult({ ...data, rewardXp: score, timeSpentSeconds });
    if (corrects / quiz.questions.length >= 0.5) confetti({ particleCount: 160, spread: 80, origin: { y: 0.55 } });
  };

  if (loading) return <Page narrow><Loading /></Page>;
  if (!quiz || !quiz.questions?.length)
    return (
      <Page narrow>
        <EmptyState icon={ClipboardList} title="Test topilmadi" text="Bu testda savollar yoʻq yoki test oʻchirilgan." />
        <div className="text-center mt-6">
          <button className="btn btn-primary" onClick={() => router.push("/quizzes")}>Testlar roʻyxatiga qaytish</button>
        </div>
      </Page>
    );

  const total = quiz.questions.length;
  const q = quiz.questions[current];
  const options: string[] = q?.parsedOptions || [];
  const answered = Object.keys(answers).length;
  const pct = Math.round((correctCount / total) * 100);
  const mm = result ? Math.floor(result.timeSpentSeconds / 60) : 0;
  const ss = result ? result.timeSpentSeconds % 60 : 0;

  return (
    <Page narrow>
      <BackButton onClick={() => router.push("/quizzes")}>Testlar roʻyxatiga qaytish</BackButton>

      <div className="mb-8">
        <p className="eyebrow mb-2">{quiz.lesson?.title || "Test"}</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight">{quiz.title}</h1>
      </div>

      {!isSubmitted ? (
        <div className="card p-6 md:p-9">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-semibold text-ink-2">
              Savol {current + 1} / {total}
            </span>
            <span className="text-muted">Javob berilgan: {answered}</span>
          </div>
          <div className="h-2 rounded-full bg-surface-2 overflow-hidden mb-8" role="progressbar" aria-valuenow={answered} aria-valuemax={total}>
            <div className="h-full bg-brand transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.18 }}
            >
              <h2 className="font-display text-2xl md:text-[1.7rem] font-semibold leading-snug mb-7">{q.content}</h2>

              <div className="grid gap-3 mb-8" role="radiogroup" aria-label="Javob variantlari">
                {options.map((opt, idx) => {
                  const sel = answers[q.id] === opt;
                  return (
                    <button
                      key={idx}
                      role="radio"
                      aria-checked={sel}
                      onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                      className={`flex items-center gap-4 text-left rounded-2xl border-2 px-5 py-4 transition-all ${
                        sel
                          ? "border-brand bg-brand-soft text-ink shadow-[var(--shadow-sm)]"
                          : "border-line bg-surface hover:border-line-strong hover:bg-surface-2"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold ${
                          sel ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted"
                        }`}
                      >
                        {LETTERS[idx] || idx + 1}
                      </span>
                      <span className="font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Savollar navigatori */}
          <div className="flex flex-wrap gap-1.5 mb-8" aria-label="Savollar">
            {quiz.questions.map((qq: any, i: number) => (
              <button
                key={qq.id}
                onClick={() => setCurrent(i)}
                aria-label={`${i + 1}-savol`}
                aria-current={i === current}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  i === current
                    ? "bg-ink text-bg"
                    : answers[qq.id]
                    ? "bg-brand-soft text-brand"
                    : "bg-surface-2 text-muted hover:bg-line"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-between gap-3 pt-6 border-t border-line">
            <button className="btn btn-ghost" onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0}>
              <ArrowLeft className="w-4 h-4" /> Oldingi
            </button>
            {current === total - 1 ? (
              <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                Yakunlash
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setCurrent((p) => Math.min(total - 1, p + 1))}>
                Keyingi <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          {current === total - 1 && answered < total && (
            <p className="text-sm text-accent mt-3 text-right">Javob berilmagan savollar: {total - answered}</p>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
          <div className="card p-8 md:p-10 text-center">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--line)" strokeWidth="9" />
                <circle
                  cx="50" cy="50" r="45" fill="none" strokeLinecap="round"
                  stroke={pct >= 70 ? "var(--ok)" : pct >= 40 ? "var(--accent)" : "var(--danger)"}
                  strokeWidth="9"
                  strokeDasharray={`${pct * 2.827} 282.7`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-semibold">{pct}%</span>
              </div>
            </div>

            <h2 className="font-display text-3xl font-semibold mb-2">
              {pct >= 80 ? "Ajoyib natija!" : pct >= 50 ? "Yaxshi natija!" : "Yana bir urinib koʻring!"}
            </h2>
            <p className="text-muted mb-6">
              Sarflangan vaqt: {mm} daq {ss} soniya
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="chip !text-sm !px-4 !py-2" style={{ background: "var(--ok-soft)", color: "var(--ok)", borderColor: "transparent" }}>
                <CheckCircle2 className="w-4 h-4" /> {correctCount} ta toʻgʻri
              </span>
              <span className="chip !text-sm !px-4 !py-2" style={{ background: "var(--danger-soft)", color: "var(--danger)", borderColor: "transparent" }}>
                <XCircle className="w-4 h-4" /> {total - correctCount} ta xato
              </span>
              <span className="chip chip-accent !text-sm !px-4 !py-2">
                <Trophy className="w-4 h-4" /> +{result?.rewardXp} XP
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn btn-primary" onClick={restart}>
                <RotateCcw className="w-4 h-4" /> Qayta ishlash
              </button>
              <button className="btn btn-ghost" onClick={() => router.push("/quizzes")}>
                Boshqa testlar
              </button>
            </div>
          </div>

          {/* Xatolar tahlili */}
          <section className="card p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold mb-5">Javoblar tahlili</h3>
            <ol className="grid gap-4">
              {quiz.questions.map((qq: any, i: number) => {
                const ok = answers[qq.id] === qq.correctAnswer;
                return (
                  <li key={qq.id} className="rounded-xl border border-line p-4 bg-surface-2/50">
                    <div className="flex items-start gap-3">
                      {ok ? (
                        <CheckCircle2 className="w-5 h-5 text-ok mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-danger mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug">
                          {i + 1}. {qq.content}
                        </p>
                        {!ok && (
                          <p className="text-sm mt-1.5 text-muted">
                            Sizning javobingiz: <span className="text-danger font-medium">{answers[qq.id] || "javob berilmagan"}</span>
                          </p>
                        )}
                        <p className="text-sm mt-1 text-muted">
                          Toʻgʻri javob: <span className="text-ok font-semibold">{qq.correctAnswer}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </motion.div>
      )}
    </Page>
  );
}

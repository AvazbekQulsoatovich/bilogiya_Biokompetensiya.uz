"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Trophy, RotateCcw, Play, CheckCircle2, XCircle, ArrowLeft, Brain, Type, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { Page, PageHeader, EmptyState, CardGridSkeleton } from "@/components/ui";
import { shuffle, normalizeUz } from "@/lib/text";

const TYPE_META: Record<string, { label: string; long: string; icon: typeof Brain }> = {
  MEMORY: { label: "Xotira", long: "Xotira oʻyini", icon: Brain },
  SCRAMBLE: { label: "Soʻz topish", long: "Soʻz topish oʻyini", icon: Type },
  TRUE_FALSE: { label: "Faktlar", long: "Toʻgʻri / Notoʻgʻri", icon: HelpCircle },
};

/** Harflari aralashtirilgan soʻz (asl soʻzdan farq qilishi kafolatlanadi). */
function scrambleWord(word: string) {
  const letters = word.split("");
  if (letters.length < 2 || new Set(letters).size < 2) return word.toUpperCase();
  let out = word;
  let guard = 0;
  while (out === word && guard++ < 20) out = shuffle(letters).join("");
  return out.toUpperCase();
}

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [activeGame, setActiveGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState<any[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Xotira
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  // Soʻz topish
  const [scrIdx, setScrIdx] = useState(0);
  const [scrLetters, setScrLetters] = useState("");
  const [scrInput, setScrInput] = useState("");
  const [scrError, setScrError] = useState("");

  // Toʻgʻri / notoʻgʻri
  const [tfIdx, setTfIdx] = useState(0);
  const [tfScore, setTfScore] = useState(0);
  const [tfFeedback, setTfFeedback] = useState<"correct" | "wrong" | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/games`);
        if (res.ok) {
          const data = await res.json();
          setGames(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Oʻyinlarni yuklab boʻlmadi", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const startGame = (game: any) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setActiveGame(game);
    setIsWon(false);
    setLocked(false);
    try {
      const parsed = JSON.parse(game.contentJson);
      setContent(parsed);
      if (game.type === "MEMORY") {
        setCards(shuffle([...parsed, ...parsed]).map((c: any) => ({ ...c, uid: Math.random() })));
        setFlipped([]);
        setSolved([]);
        setMoves(0);
      } else if (game.type === "SCRAMBLE") {
        setScrIdx(0);
        setScrLetters(scrambleWord(parsed[0]?.word || ""));
        setScrInput("");
        setScrError("");
      } else if (game.type === "TRUE_FALSE") {
        setTfIdx(0);
        setTfScore(0);
        setTfFeedback(null);
      }
    } catch {
      console.error("Oʻyin maʼlumotlari yaroqsiz");
    }
  };

  const winGame = () => {
    setIsWon(true);
    later(() => confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } }), 100);
  };

  /* ───── Xotira ───── */
  const onCard = (index: number) => {
    if (locked || flipped.includes(index) || solved.includes(index)) return;
    const nf = [...flipped, index];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = nf;
      if (cards[a].id === cards[b].id) {
        const ns = [...solved, a, b];
        setSolved(ns);
        setFlipped([]);
        setLocked(false);
        if (ns.length === cards.length) winGame();
      } else {
        later(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  /* ───── Soʻz topish ───── */
  const onScramble = (e: React.FormEvent) => {
    e.preventDefault();
    const target = content[scrIdx]?.word || "";
    if (normalizeUz(scrInput.trim()) === normalizeUz(target)) {
      setScrError("");
      if (scrIdx + 1 >= content.length) winGame();
      else {
        const next = scrIdx + 1;
        setScrIdx(next);
        setScrLetters(scrambleWord(content[next].word));
        setScrInput("");
      }
    } else {
      setScrError("Notoʻgʻri, qayta urinib koʻring!");
      later(() => setScrError(""), 1800);
    }
  };

  /* ───── Toʻgʻri / notoʻgʻri ───── */
  const onTF = (answer: boolean) => {
    if (locked) return;
    setLocked(true);
    const ok = content[tfIdx].answer === answer;
    setTfFeedback(ok ? "correct" : "wrong");
    if (ok) setTfScore((s) => s + 1);
    later(() => {
      setTfFeedback(null);
      setLocked(false);
      if (tfIdx + 1 >= content.length) winGame();
      else setTfIdx((i) => i + 1);
    }, 1300);
  };

  /* ───────── Roʻyxat ───────── */
  if (!activeGame) {
    return (
      <Page>
        <PageHeader
          icon={Gamepad2}
          eyebrow="Sinov va mashq"
          title="Interaktiv oʻyinlar"
          subtitle="Oʻynab turib atamalar va faktlarni mustahkamlang."
        />
        {loading ? (
          <CardGridSkeleton count={3} />
        ) : games.length === 0 ? (
          <EmptyState icon={Gamepad2} title="Hozircha oʻyinlar yoʻq" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {games.map((game, i) => {
              const meta = TYPE_META[game.type] || TYPE_META.TRUE_FALSE;
              const Icon = meta.icon;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card card-hover flex flex-col p-7"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
                      <Icon className="w-6 h-6" strokeWidth={1.8} />
                    </span>
                    <span className="chip">{meta.label}</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold leading-snug mb-2">{game.title}</h2>
                  <p className="text-muted flex-1 mb-6">{game.description}</p>
                  <button onClick={() => startGame(game)} className="btn btn-primary w-full">
                    <Play className="w-4 h-4 fill-current" /> Oʻynash
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </Page>
    );
  }

  /* ───────── Oʻyin maydoni ───────── */
  const meta = TYPE_META[activeGame.type] || TYPE_META.TRUE_FALSE;
  const progress =
    activeGame.type === "SCRAMBLE" ? (scrIdx / Math.max(1, content.length)) * 100
    : activeGame.type === "TRUE_FALSE" ? (tfIdx / Math.max(1, content.length)) * 100
    : (solved.length / Math.max(1, cards.length)) * 100;

  return (
    <Page narrow>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setActiveGame(null)} className="btn btn-ghost btn-sm" aria-label="Orqaga">
            <ArrowLeft className="w-4 h-4" /> Orqaga
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold truncate">{activeGame.title}</h1>
            <span className="chip chip-brand mt-1">{meta.long}</span>
          </div>
        </div>
        <button onClick={() => startGame(activeGame)} className="btn btn-ghost btn-sm">
          <RotateCcw className="w-4 h-4" /> Qaytadan
        </button>
      </div>

      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-6">
        <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="card relative p-6 md:p-10 min-h-[460px] flex flex-col justify-center overflow-hidden">
        <AnimatePresence>
          {isWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-surface/95 backdrop-blur p-6"
            >
              <Trophy className="w-20 h-20 text-accent mb-5" strokeWidth={1.4} />
              <h2 className="font-display text-4xl font-semibold mb-3">Ajoyib natija!</h2>
              {activeGame.type === "TRUE_FALSE" && (
                <p className="text-xl font-semibold text-ok mb-2">
                  {content.length} tadan {tfScore} tasiga toʻgʻri javob berdingiz
                </p>
              )}
              {activeGame.type === "MEMORY" && <p className="text-xl font-semibold text-ok mb-2">Urinishlar soni: {moves}</p>}
              <p className="text-muted mb-8">Barcha bosqichlarni muvaffaqiyatli yakunladingiz.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setActiveGame(null)} className="btn btn-ghost">Boshqa oʻyinlar</button>
                <button onClick={() => startGame(activeGame)} className="btn btn-primary">Yana oʻynash</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XOTIRA */}
        {activeGame.type === "MEMORY" && (
          <div>
            <p className="text-sm text-muted text-center mb-5">Urinishlar: <b className="text-ink">{moves}</b> · Topildi: <b className="text-ink">{solved.length / 2}</b> / {cards.length / 2}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-w-3xl mx-auto">
              {cards.map((card, index) => {
                const up = flipped.includes(index) || solved.includes(index);
                const done = solved.includes(index);
                return (
                  <button
                    key={card.uid}
                    onClick={() => onCard(index)}
                    aria-label={up ? card.name : "Yopiq karta"}
                    className="relative aspect-square [perspective:900px]"
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotateY: up ? 180 : 0 }}
                      transition={{ duration: 0.45, type: "spring", stiffness: 240, damping: 22 }}
                      className="w-full h-full relative"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0b7a5c] to-[#075c45] flex items-center justify-center shadow-[var(--shadow-sm)]"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <Brain className="w-8 h-8 text-white/50" />
                      </div>
                      <div
                        className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 ${
                          done ? "border-ok bg-ok-soft" : "border-brand bg-surface"
                        }`}
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        {card.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.image} alt="" className="w-10 h-10 object-contain mb-1" />
                        ) : (
                          <span className="text-3xl mb-1" aria-hidden>{card.emoji}</span>
                        )}
                        <span className="font-semibold text-[0.7rem] text-center leading-tight text-ink-2">{card.name}</span>
                      </div>
                    </motion.div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SOʻZ TOPISH */}
        {activeGame.type === "SCRAMBLE" && !isWon && (
          <div className="max-w-xl mx-auto w-full text-center">
            <span className="chip chip-info mb-4">Bosqich {scrIdx + 1} / {content.length}</span>
            <h2 className="font-display text-2xl font-semibold mb-8">{content[scrIdx]?.hint}</h2>
            <div className="flex justify-center flex-wrap gap-2.5 mb-10" aria-label="Aralashtirilgan harflar">
              {scrLetters.split("").map((ch, i) => (
                <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-surface-2 border border-line-strong flex items-center justify-center font-display text-2xl font-semibold shadow-[var(--shadow-sm)]">
                  {ch}
                </div>
              ))}
            </div>
            <form onSubmit={onScramble} className="grid gap-3 max-w-md mx-auto">
              <input
                className="input !text-center !text-xl !font-bold uppercase tracking-widest !py-3.5"
                value={scrInput}
                onChange={(e) => setScrInput(e.target.value.toUpperCase())}
                placeholder="Soʻzni yozing…"
                autoFocus
                autoComplete="off"
                aria-label="Topilgan soʻz"
              />
              <p className={`text-danger font-semibold min-h-6 ${scrError ? "" : "invisible"}`} role="alert">{scrError || "."}</p>
              <button type="submit" className="btn btn-primary btn-lg">Tekshirish</button>
            </form>
          </div>
        )}

        {/* TOʻGʻRI / NOTOʻGʻRI */}
        {activeGame.type === "TRUE_FALSE" && !isWon && (
          <div className="max-w-2xl mx-auto w-full text-center">
            <div className="flex justify-between items-center mb-7">
              <span className="chip">Savol {tfIdx + 1} / {content.length}</span>
              <span className="chip chip-brand">Ball: {tfScore}</span>
            </div>

            <div className="relative rounded-3xl border border-line bg-surface-2 px-6 py-12 md:px-10 mb-8 overflow-hidden">
              <AnimatePresence>
                {tfFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/95"
                  >
                    {tfFeedback === "correct" ? (
                      <>
                        <CheckCircle2 className="w-20 h-20 text-ok" />
                        <p className="font-display text-2xl font-semibold text-ok mt-2">Toʻgʻri!</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-20 h-20 text-danger" />
                        <p className="font-display text-2xl font-semibold text-danger mt-2">
                          Notoʻgʻri. Aslida: {content[tfIdx]?.answer ? "toʻgʻri" : "notoʻgʻri"}
                        </p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <h2 className="font-display text-2xl md:text-3xl font-semibold leading-snug">«{content[tfIdx]?.question}»</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button onClick={() => onTF(true)} disabled={locked} className="btn btn-lg !bg-ok !text-white hover:opacity-90">
                Toʻgʻri
              </button>
              <button onClick={() => onTF(false)} disabled={locked} className="btn btn-lg !bg-danger !text-white hover:opacity-90">
                Notoʻgʻri
              </button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

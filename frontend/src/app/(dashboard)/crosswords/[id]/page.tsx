"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, Check, Grid3x3, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { Page, Loading, BackButton, EmptyState } from "@/components/ui";
import { normalizeUz } from "@/lib/text";

type Cell = { letter: string; words: { itemIdx: number; indexInWord: number }[] };

/** Harf taqqoslash: apostrof turlari va registrdan qatʼi nazar */
const same = (a: string, b: string) => normalizeUz(a) === normalizeUz(b);

export default function CrosswordSolverPage() {
  const params = useParams();
  const router = useRouter();

  const [crossword, setCrossword] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [off, setOff] = useState({ r: 0, c: 0 });
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [msg, setMsg] = useState<{ type: "err" | "info"; text: string } | null>(null);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/crosswords/${params.id}`);
        const data = await res.json();
        if (data?.items) {
          setCrossword(data);
          buildGrid(data.items);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildGrid = (items: any[]) => {
    // Boʻsh qator va ustunlarni qirqib tashlaymiz: tor, ixcham toʻr hosil qilamiz
    let minR = Infinity, minC = Infinity, maxR = 0, maxC = 0;
    items.forEach((it) => {
      const len = it.word.length;
      const r2 = it.direction === "HORIZONTAL" ? it.row : it.row + len - 1;
      const c2 = it.direction === "HORIZONTAL" ? it.col + len - 1 : it.col;
      minR = Math.min(minR, it.row);
      minC = Math.min(minC, it.col);
      maxR = Math.max(maxR, r2);
      maxC = Math.max(maxC, c2);
    });
    setOff({ r: minR, c: minC });
    const g: (Cell | null)[][] = Array.from({ length: maxR - minR + 1 }, () => Array(maxC - minC + 1).fill(null));
    items.forEach((it, itemIdx) => {
      for (let i = 0; i < it.word.length; i++) {
        const r = (it.direction === "HORIZONTAL" ? it.row : it.row + i) - minR;
        const c = (it.direction === "HORIZONTAL" ? it.col + i : it.col) - minC;
        if (!g[r][c]) g[r][c] = { letter: it.word[i], words: [] };
        g[r][c]!.words.push({ itemIdx, indexInWord: i });
      }
    });
    setGrid(g);
  };

  const items: any[] = crossword?.items || [];

  const cellsOfItem = (idx: number) => {
    const it = items[idx];
    if (!it) return [] as string[];
    return Array.from({ length: it.word.length }, (_, i) => {
      const r = (it.direction === "HORIZONTAL" ? it.row : it.row + i) - off.r;
      const c = (it.direction === "HORIZONTAL" ? it.col + i : it.col) - off.c;
      return `${r}-${c}`;
    });
  };

  const activeCells = useMemo(() => new Set(activeItem != null ? cellsOfItem(activeItem) : []), [activeItem, crossword, off]); // eslint-disable-line react-hooks/exhaustive-deps

  const focusCell = (key: string) => refs.current[key]?.focus();

  const onChange = (r: number, c: number, raw: string) => {
    const key = `${r}-${c}`;
    // Oxirgi kiritilgan belgini olamiz (almashtirish qulay boʻlishi uchun)
    const ch = raw.slice(-1).toUpperCase();
    setChecked(false);
    setInputs((p) => ({ ...p, [key]: ch }));
    if (!ch || activeItem == null) return;
    const cells = cellsOfItem(activeItem);
    const pos = cells.indexOf(key);
    if (pos >= 0 && pos < cells.length - 1) focusCell(cells[pos + 1]);
  };

  const onKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    const key = `${r}-${c}`;
    if (e.key === "Backspace" && !inputs[key] && activeItem != null) {
      const cells = cellsOfItem(activeItem);
      const pos = cells.indexOf(key);
      if (pos > 0) focusCell(cells[pos - 1]);
      return;
    }
    const delta: Record<string, [number, number]> = {
      ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0],
    };
    const d = delta[e.key];
    if (d) {
      e.preventDefault();
      let nr = r + d[0];
      let nc = c + d[1];
      while (nr >= 0 && nc >= 0 && nr < grid.length && nc < (grid[0]?.length || 0)) {
        if (grid[nr][nc]) {
          focusCell(`${nr}-${nc}`);
          break;
        }
        nr += d[0];
        nc += d[1];
      }
    }
  };

  const onFocusCell = (cell: Cell) => {
    // Agar katak ikki soʻzga tegishli boʻlsa, joriy faol soʻzni saqlab qolamiz
    if (activeItem != null && cell.words.some((w) => w.itemIdx === activeItem)) return;
    setActiveItem(cell.words[0].itemIdx);
  };

  const selectClue = (idx: number) => {
    setActiveItem(idx);
    const first = cellsOfItem(idx)[0];
    if (first) setTimeout(() => focusCell(first), 0);
  };

  const check = () => {
    let allCorrect = true;
    let empty = false;
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (!cell) return;
        const v = inputs[`${r}-${c}`];
        if (!v) empty = true;
        if (!v || !same(v, cell.letter)) allCorrect = false;
      })
    );
    setChecked(true);
    if (allCorrect && !isRevealed) {
      setMsg(null);
      submit();
    } else {
      setMsg({
        type: "err",
        text: empty
          ? "Baʼzi kataklar hali toʻldirilmagan. Xato kataklar qizil rangda belgilandi."
          : "Baʼzi harflar notoʻgʻri. Xato kataklar qizil rangda belgilandi.",
      });
    }
  };

  const reveal = () => {
    const next: Record<string, string> = {};
    grid.forEach((row, r) => row.forEach((cell, c) => cell && (next[`${r}-${c}`] = cell.letter.toUpperCase())));
    setInputs(next);
    setIsRevealed(true);
    setChecked(false);
    setMsg({ type: "info", text: "Javoblar ochildi. Bu urinish uchun XP berilmaydi." });
  };

  const reset = () => {
    setInputs({});
    setIsRevealed(false);
    setChecked(false);
    setMsg(null);
  };

  const submit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/crosswords/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        setIsCompleted(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Page><Loading /></Page>;
  if (!crossword)
    return (
      <Page narrow>
        <EmptyState icon={Grid3x3} title="Krossvord topilmadi" />
      </Page>
    );

  const clueList = (dir: "HORIZONTAL" | "VERTICAL", title: string) => {
    const list = items.map((it, idx) => ({ it, idx })).filter((x) => x.it.direction === dir);
    if (!list.length) return null;
    return (
      <div>
        <h3 className="eyebrow !text-muted mb-2.5">{title}</h3>
        <ul className="grid gap-2">
          {list.map(({ it, idx }) => (
            <li key={it.id ?? idx}>
              <button
                onClick={() => selectClue(idx)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                  activeItem === idx ? "border-brand bg-brand-soft" : "border-line bg-surface hover:bg-surface-2"
                }`}
              >
                <span className="font-display font-semibold text-brand mr-2">{idx + 1}.</span>
                <span className="text-sm">{it.clue}</span>
                <span className="text-xs text-muted ml-2">({it.word.length} harf)</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Page>
      <BackButton onClick={() => router.push("/crosswords")}>Krossvordlar roʻyxatiga qaytish</BackButton>

      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold">{crossword.title}</h1>
        {crossword.description && <p className="text-muted mt-2 max-w-2xl">{crossword.description}</p>}
      </div>

      {!isCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6">
          <div className="card p-5 md:p-8 flex justify-center overflow-x-auto">
            <div className="flex flex-col gap-1" role="grid" aria-label="Krossvord toʻri">
              {grid.map((row, r) => (
                <div key={r} className="flex gap-1" role="row">
                  {row.map((cell, c) => {
                    const key = `${r}-${c}`;
                    if (!cell) return <div key={key} className="w-11 h-11 md:w-12 md:h-12 shrink-0" />;
                    const startNum = cell.words.find((w) => w.indexInWord === 0);
                    const val = inputs[key] || "";
                    const wrong = checked && (!val || !same(val, cell.letter));
                    const right = checked && !wrong;
                    return (
                      <div key={key} className="relative w-11 h-11 md:w-12 md:h-12 shrink-0">
                        {startNum && (
                          <span className="absolute top-0.5 left-1 text-[10px] font-bold text-muted z-10 pointer-events-none">
                            {startNum.itemIdx + 1}
                          </span>
                        )}
                        <input
                          ref={(el) => {
                            refs.current[key] = el;
                          }}
                          value={val}
                          maxLength={2}
                          onChange={(e) => onChange(r, c, e.target.value)}
                          onKeyDown={(e) => onKeyDown(e, r, c)}
                          onFocus={(e) => {
                            onFocusCell(cell);
                            e.currentTarget.select();
                          }}
                          disabled={isRevealed}
                          aria-label={`${r + 1}-qator, ${c + 1}-ustun`}
                          autoComplete="off"
                          className={`w-full h-full text-center text-lg md:text-xl font-bold uppercase rounded-lg border-2 outline-none transition-colors ${
                            isRevealed
                              ? "border-accent bg-accent-soft text-accent"
                              : wrong
                              ? "border-danger bg-danger-soft text-danger"
                              : right
                              ? "border-ok bg-ok-soft text-ok"
                              : activeCells.has(key)
                              ? "border-brand bg-brand-soft text-ink"
                              : "border-line-strong bg-surface text-ink"
                          } focus:border-brand focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand)_20%,transparent)]`}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <aside className="card p-5 md:p-6 h-fit lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold mb-4">Savollar</h2>
            <div className="grid gap-5 max-h-[46vh] overflow-y-auto pr-1">
              {clueList("HORIZONTAL", "Yotiq (→)")}
              {clueList("VERTICAL", "Tik (↓)")}
            </div>

            {msg && (
              <p
                role="status"
                className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  msg.type === "err" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className="mt-5 grid gap-2.5">
              <button className="btn btn-primary" onClick={check} disabled={isRevealed}>
                <Check className="w-4 h-4" /> Tekshirish
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button className="btn btn-ghost btn-sm" onClick={reveal} disabled={isRevealed}>
                  <Eye className="w-4 h-4" /> Javobni koʻrish
                </button>
                <button className="btn btn-ghost btn-sm" onClick={reset}>
                  <RotateCcw className="w-4 h-4" /> Tozalash
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-10 md:p-14 text-center max-w-2xl mx-auto">
          <CheckCircle2 className="w-16 h-16 text-ok mx-auto mb-5" />
          <h2 className="font-display text-3xl font-semibold mb-3">Ajoyib natija!</h2>
          <p className="text-lg text-muted mb-8">
            Krossvordni muvaffaqiyatli yechdingiz va <span className="font-bold text-accent">+50 XP</span> oldingiz.
          </p>
          <button onClick={() => router.push("/crosswords")} className="btn btn-primary btn-lg">
            Roʻyxatga qaytish
          </button>
        </motion.div>
      )}
    </Page>
  );
}

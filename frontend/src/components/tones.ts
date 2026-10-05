export type Tone = "green" | "teal" | "blue" | "violet" | "amber" | "rose" | "orange";

/** Har bir boʻlimning aksent rangi (CSS: .tone-*) */
export const SECTION_TONE: Record<string, Tone> = {
  dashboard: "green",
  topics: "green",
  books: "orange",
  glossary: "teal",
  facts: "amber",
  labs: "teal",
  models: "violet",
  extracurricular: "blue",
  quizzes: "rose",
  crosswords: "blue",
  games: "violet",
};

export function toneForPath(pathname: string | null): Tone {
  const seg = (pathname || "").split("/")[1] || "dashboard";
  return SECTION_TONE[seg] ?? "green";
}

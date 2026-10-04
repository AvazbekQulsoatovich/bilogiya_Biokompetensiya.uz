/**
 * Oʻzbek lotin imlosi: oʻ, gʻ (U+02BB) va tutuq belgisi (U+02BC).
 * Qidiruvda foydalanuvchi oddiy ' belgisini yozishi mumkin, shuning uchun
 * barcha variantlarni bitta ko‘rinishga keltiramiz.
 */
export function normalizeUz(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[ʻʼ‘ʼ`´]/g, "'")
    .normalize("NFC");
}

export function includesUz(haystack: string, needle: string): boolean {
  return normalizeUz(haystack).includes(normalizeUz(needle));
}

/** "2024-05-01T..." → "1-may, 2024" */
const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];
export function formatDateUz(iso: string | Date): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

/** Fisher–Yates aralashtirish (Array.sort(random) notekis taqsimot beradi). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

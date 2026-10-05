/** Laboratoriya turlari haqida qoʻshimcha maʼlumot (kartalar va sarlavhalar uchun). */
export const LAB_META: Record<string, { minutes: number; level: string; dots: 1 | 2 | 3; tag: string }> = {
  MICROSCOPE: { minutes: 12, level: "Oʻrta", dots: 2, tag: "Mikroskopiya" },
  MEASUREMENT: { minutes: 8, level: "Oson", dots: 1, tag: "Oʻlchash" },
  OSMOSIS: { minutes: 10, level: "Oʻrta", dots: 2, tag: "Hujayra fiziologiyasi" },
  CHEMISTRY: { minutes: 8, level: "Oson", dots: 1, tag: "Fizik jarayonlar" },
  GERMINATION: { minutes: 10, level: "Oson", dots: 1, tag: "Oʻsimliklar" },
  PHOTOSYNTHESIS: { minutes: 12, level: "Qiyin", dots: 3, tag: "Fotosintez" },
  DISSECTION: { minutes: 10, level: "Oʻrta", dots: 2, tag: "Anatomiya" },
  FOODWEB: { minutes: 12, level: "Qiyin", dots: 3, tag: "Ekologiya" },
};

const KEY = "lab-done";

export function getDoneLabs(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function markLabDone(id: string) {
  try {
    const d = getDoneLabs();
    if (!d.includes(id)) localStorage.setItem(KEY, JSON.stringify([...d, id]));
  } catch {}
}

"use client";

import type { ReactNode } from "react";

export type PartDef = { id: string; name: string; text: string; color: string };
export type DiagramProps = { active: string | null; onPick: (id: string) => void };

/** Faol boʻlmagan qismlarni xiralashtiradigan oʻram. */
function Part({
  id, active, onPick, label, children,
}: DiagramProps & { id: string; label: string; children: ReactNode }) {
  const dim = active && active !== id;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active === id}
      onClick={(e) => {
        e.stopPropagation();
        onPick(id);
      }}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(id))}
      style={{ cursor: "pointer", opacity: dim ? 0.28 : 1, transition: "opacity 0.25s", outline: "none" }}
    >
      {children}
      {active === id && <title>{label}</title>}
    </g>
  );
}

const glow = (on: boolean, c: string) => (on ? { filter: `drop-shadow(0 0 6px ${c})` } : undefined);

/* ═════════════════ OʻSIMLIK HUJAYRASI ═════════════════ */
export const PLANT_PARTS: PartDef[] = [
  { id: "wall", name: "Hujayra devori", color: "#2b7a3b", text: "Sellyulozadan iborat qalin, mustahkam qobiq. Hujayraga shakl beradi va himoya qiladi. Hayvon hujayrasida u yoʻq." },
  { id: "membrane", name: "Hujayra membranasi", color: "#6fbf73", text: "Devor ostidagi yupqa parda. Hujayraga kiradigan va undan chiqadigan moddalarni tanlab oʻtkazadi." },
  { id: "cytoplasm", name: "Sitoplazma", color: "#9cc6a0", text: "Hujayra ichini toʻldirib turuvchi yarim suyuq muhit. Barcha organoidlar shu muhitda joylashadi." },
  { id: "nucleus", name: "Yadro", color: "#8d6fd0", text: "Hujayra faoliyatini boshqaradi va irsiy axborot (DNK) ni saqlaydi. Ichida yadrocha bor." },
  { id: "vacuole", name: "Markaziy vakuola", color: "#4aa3d8", text: "Hujayra shirasi bilan toʻlgan yirik boʻshliq. Suv va moddalar zaxirasini saqlaydi, hujayra tarangligini (turgor) taʼminlaydi." },
  { id: "chloroplast", name: "Xloroplast", color: "#2f9e44", text: "Yashil plastida. Tarkibidagi xlorofill yorugʻlik energiyasini yutib, fotosintezni amalga oshiradi." },
  { id: "mito", name: "Mitoxondriya", color: "#e07a3a", text: "Hujayraning „energiya stansiyasi“: organik moddalarni parchalab, hayot uchun zarur energiya hosil qiladi." },
];

export function PlantCell({ active, onPick }: DiagramProps) {
  const p = { active, onPick };
  const chloro = (x: number, y: number, r = 0) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`} style={glow(active === "chloroplast", "#2f9e44")}>
      <ellipse rx="26" ry="14" fill="#3fae52" stroke="#1d6b2b" strokeWidth="2" />
      {[-12, -4, 4, 12].map((dx) => (
        <rect key={dx} x={dx - 3} y="-5" width="6" height="10" rx="1.5" fill="#1d7a32" opacity="0.8" />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 420 320" className="w-full h-auto" role="img" aria-label="Oʻsimlik hujayrasi sxemasi" onClick={() => onPick("")}>
      <Part id="wall" label="Hujayra devori" {...p}>
        <rect x="10" y="12" width="400" height="296" rx="34" fill="#c5e3a5" stroke="#2b7a3b" strokeWidth="13" style={glow(active === "wall", "#2b7a3b")} />
      </Part>
      <Part id="membrane" label="Hujayra membranasi" {...p}>
        <rect x="23" y="25" width="374" height="270" rx="26" fill="none" stroke="#6fbf73" strokeWidth="4" style={glow(active === "membrane", "#6fbf73")} />
      </Part>
      <Part id="cytoplasm" label="Sitoplazma" {...p}>
        <rect x="27" y="29" width="366" height="262" rx="22" fill="#e4f3d6" style={glow(active === "cytoplasm", "#9cc6a0")} />
      </Part>
      <Part id="vacuole" label="Markaziy vakuola" {...p}>
        <path d="M222 70 C300 52 372 92 366 160 C362 226 296 262 232 250 C176 240 160 190 168 140 C174 100 190 78 222 70Z" fill="#b6def2" stroke="#4aa3d8" strokeWidth="3" style={glow(active === "vacuole", "#4aa3d8")} />
      </Part>
      <Part id="nucleus" label="Yadro" {...p}>
        <g style={glow(active === "nucleus", "#8d6fd0")}>
          <circle cx="92" cy="130" r="46" fill="#b9a4e6" stroke="#8d6fd0" strokeWidth="3" />
          <circle cx="92" cy="130" r="14" fill="#6d4bb8" />
          <path d="M62 112 q10 -8 20 0 M104 150 q12 8 22 -2 M64 148 q8 10 18 4" stroke="#7a5cc4" strokeWidth="2" fill="none" />
        </g>
      </Part>
      <Part id="chloroplast" label="Xloroplast" {...p}>
        {chloro(100, 54, -8)}
        {chloro(70, 252, 14)}
        {chloro(196, 272, -4)}
        {chloro(350, 52, 10)}
      </Part>
      <Part id="mito" label="Mitoxondriya" {...p}>
        {[[96, 214, 20], [150, 52, -35], [338, 276, 18]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} style={glow(active === "mito", "#e07a3a")}>
            <ellipse rx="19" ry="10" fill="#f2a56d" stroke="#c4571a" strokeWidth="2" />
            <path d="M-12 0 q3 -6 6 0 q3 6 6 0 q3 -6 6 0 q3 6 6 0" stroke="#c4571a" strokeWidth="1.6" fill="none" />
          </g>
        ))}
      </Part>
    </svg>
  );
}

/* ═════════════════ HAYVON HUJAYRASI ═════════════════ */
export const ANIMAL_PARTS: PartDef[] = [
  { id: "membrane", name: "Hujayra membranasi", color: "#d6577a", text: "Hujayrani oʻrab turuvchi yupqa parda. Hayvon hujayrasida qalin devor yoʻq, shuning uchun u shaklini oʻzgartira oladi." },
  { id: "cytoplasm", name: "Sitoplazma", color: "#f3c9d1", text: "Hujayra ichidagi yarim suyuq muhit; organoidlar shu yerda joylashgan." },
  { id: "nucleus", name: "Yadro", color: "#8d6fd0", text: "Irsiy axborot (DNK) ni saqlaydi va hujayra faoliyatini boshqaradi. Ichida yadrocha boʻladi." },
  { id: "mito", name: "Mitoxondriya", color: "#e07a3a", text: "Oziq moddalarni parchalab, energiya hosil qiladi („hujayra energiya stansiyasi“)." },
  { id: "golgi", name: "Golji apparati", color: "#d29a2e", text: "Hujayrada hosil boʻlgan moddalarni toʻplab, qadoqlaydi va kerakli joyga yuboradi." },
  { id: "lysosome", name: "Lizosoma", color: "#5aa65c", text: "Ichida parchalovchi fermentlar bor: eskirgan organoidlar va hujayraga tushgan zarralarni hazm qiladi." },
  { id: "er", name: "Endoplazmatik toʻr", color: "#3f88c5", text: "Hujayra ichida moddalar tashiladigan naychalar va yassi xaltachalar tizimi; yadro bilan tutashgan." },
];

export function AnimalCell({ active, onPick }: DiagramProps) {
  const p = { active, onPick };
  return (
    <svg viewBox="0 0 420 320" className="w-full h-auto" role="img" aria-label="Hayvon hujayrasi sxemasi" onClick={() => onPick("")}>
      <Part id="membrane" label="Hujayra membranasi" {...p}>
        <path d="M70 160 C60 80 140 28 220 32 C312 36 372 90 366 172 C360 252 296 296 212 290 C128 284 78 240 70 160Z" fill="#f9dde2" stroke="#d6577a" strokeWidth="7" style={glow(active === "membrane", "#d6577a")} />
      </Part>
      <Part id="cytoplasm" label="Sitoplazma" {...p}>
        <path d="M82 160 C74 90 148 44 220 46 C304 50 356 98 352 170 C348 240 290 280 212 276 C138 272 90 232 82 160Z" fill="#fbe9ec" style={glow(active === "cytoplasm", "#f3c9d1")} />
      </Part>
      <Part id="er" label="Endoplazmatik toʻr" {...p}>
        <g style={glow(active === "er", "#3f88c5")} fill="none" stroke="#3f88c5" strokeWidth="5" strokeLinecap="round">
          <path d="M150 112 q-20 20 -4 40 q20 22 -6 46" />
          <path d="M160 100 q-26 26 -8 54 q22 28 -2 56" opacity="0.7" />
          <path d="M250 82 q30 6 40 28 q8 22 -14 36" />
        </g>
      </Part>
      <Part id="nucleus" label="Yadro" {...p}>
        <g style={glow(active === "nucleus", "#8d6fd0")}>
          <circle cx="200" cy="160" r="50" fill="#b9a4e6" stroke="#8d6fd0" strokeWidth="4" />
          <circle cx="206" cy="154" r="16" fill="#6d4bb8" />
        </g>
      </Part>
      <Part id="mito" label="Mitoxondriya" {...p}>
        {[[110, 230, 25], [290, 214, -30], [276, 90, 40]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} style={glow(active === "mito", "#e07a3a")}>
            <ellipse rx="24" ry="12" fill="#f2a56d" stroke="#c4571a" strokeWidth="2.5" />
            <path d="M-14 0 q3 -7 7 0 q3 7 7 0 q3 -7 7 0 q3 7 7 0" stroke="#c4571a" strokeWidth="1.8" fill="none" />
          </g>
        ))}
      </Part>
      <Part id="golgi" label="Golji apparati" {...p}>
        <g style={glow(active === "golgi", "#d29a2e")} fill="none" stroke="#d29a2e" strokeWidth="6" strokeLinecap="round">
          <path d="M296 150 q20 -14 36 0" />
          <path d="M292 164 q24 -16 44 0" />
          <path d="M290 178 q26 -18 48 0" />
        </g>
      </Part>
      <Part id="lysosome" label="Lizosoma" {...p}>
        {[[130, 140], [250, 244], [138, 258]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="11" fill="#7cc47e" stroke="#3f8a41" strokeWidth="2.5" style={glow(active === "lysosome", "#5aa65c")} />
        ))}
      </Part>
    </svg>
  );
}

/* ═════════════════ AMYOBA ═════════════════ */
export const AMOEBA_PARTS: PartDef[] = [
  { id: "pseudopod", name: "Soxta oyoq", color: "#6a8fc7", text: "Sitoplazmaning chiqiq oqimi. Amyoba shu oqim bilan harakatlanadi va oziq zarralarini oʻrab oladi." },
  { id: "membrane", name: "Hujayra membranasi", color: "#4a6fa5", text: "Hujayrani tashqi muhitdan ajratib turadigan yupqa parda; orqali gazlar va suv oʻtadi." },
  { id: "cytoplasm", name: "Sitoplazma", color: "#bcd0ec", text: "Doimiy harakatdagi yopishqoq muhit; amyobaning shakli oʻzgarib turishiga sabab boʻladi." },
  { id: "nucleus", name: "Yadro", color: "#8d6fd0", text: "Bitta yadro hujayra hayotini boshqaradi, boʻlinib koʻpayishda ishtirok etadi." },
  { id: "food", name: "Hazm vakuolasi", color: "#d29a2e", text: "Amyoba oʻrab olgan oziq (bakteriya, suvoʻt) atrofida hosil boʻladi; unda oziq hazm qilinadi." },
  { id: "contractile", name: "Qisqaruvchi vakuola", color: "#3f88c5", text: "Ortiqcha suvni vaqti-vaqti bilan tashqariga chiqarib turadi (chuchuk suvda yashovchilar uchun muhim)." },
];

export function Amoeba({ active, onPick }: DiagramProps) {
  const p = { active, onPick };
  return (
    <svg viewBox="0 0 420 320" className="w-full h-auto" role="img" aria-label="Amyoba sxemasi" onClick={() => onPick("")}>
      <Part id="membrane" label="Hujayra membranasi" {...p}>
        <path d="M112 90 C150 40 230 56 260 38 C300 18 352 56 336 100 C326 132 380 156 360 200 C342 240 290 232 270 262 C246 298 190 292 170 262 C150 232 88 252 62 214 C38 176 86 150 82 124 C80 108 98 104 112 90Z" fill="#dbe7f7" stroke="#4a6fa5" strokeWidth="5" style={glow(active === "membrane", "#4a6fa5")} />
      </Part>
      <Part id="pseudopod" label="Soxta oyoq" {...p}>
        <path d="M336 100 C326 132 380 156 360 200 C342 240 330 214 322 188 C318 160 330 124 336 100Z" fill="#c6d9f1" stroke="#6a8fc7" strokeWidth="3" style={glow(active === "pseudopod", "#6a8fc7")} />
        <path d="M62 214 C38 176 86 150 82 124 C84 150 70 176 94 196 C88 214 72 220 62 214Z" fill="#c6d9f1" stroke="#6a8fc7" strokeWidth="3" style={glow(active === "pseudopod", "#6a8fc7")} />
      </Part>
      <Part id="cytoplasm" label="Sitoplazma" {...p}>
        <path d="M120 100 C154 56 228 70 258 52 C292 36 336 66 322 104 C312 138 362 158 346 196 C330 228 284 220 262 250 C240 280 194 276 178 252 C158 224 104 240 80 208 C60 180 100 154 98 128 C96 114 110 110 120 100Z" fill="#cfdff3" opacity="0.9" style={glow(active === "cytoplasm", "#bcd0ec")} />
      </Part>
      <Part id="nucleus" label="Yadro" {...p}>
        <g style={glow(active === "nucleus", "#8d6fd0")}>
          <circle cx="200" cy="150" r="30" fill="#b9a4e6" stroke="#8d6fd0" strokeWidth="3" />
          <circle cx="204" cy="146" r="10" fill="#6d4bb8" />
        </g>
      </Part>
      <Part id="food" label="Hazm vakuolasi" {...p}>
        {[[140, 170, 14], [262, 120, 11]].map(([x, y, r], i) => (
          <g key={i} style={glow(active === "food", "#d29a2e")}>
            <circle cx={x} cy={y} r={r + 5} fill="#f6e1ad" stroke="#d29a2e" strokeWidth="2.5" />
            <circle cx={x} cy={y} r={r - 5} fill="#4cae5c" />
          </g>
        ))}
      </Part>
      <Part id="contractile" label="Qisqaruvchi vakuola" {...p}>
        <circle cx="262" cy="214" r="15" fill="#e3f1fb" stroke="#3f88c5" strokeWidth="3" style={glow(active === "contractile", "#3f88c5")} />
      </Part>
    </svg>
  );
}

/* ═════════════════ INFUZORIYA-TUFELKA ═════════════════ */
export const PARAMECIUM_PARTS: PartDef[] = [
  { id: "cilia", name: "Kipriklar", color: "#6a8fc7", text: "Tanani qoplab turuvchi minglab mayda tukchalar. Ular toʻlqinsimon harakat qilib, infuzoriyani suzdiradi." },
  { id: "pellicle", name: "Pellikula (qobiq)", color: "#4a6fa5", text: "Hujayra membranasi ostidagi elastik qavat; tufelkaning doimiy, poyabzalsimon shaklini saqlaydi." },
  { id: "macro", name: "Katta yadro (makronukleus)", color: "#8d6fd0", text: "Hujayraning hayotiy jarayonlarini boshqaradi." },
  { id: "micro", name: "Kichik yadro (mikronukleus)", color: "#b08be0", text: "Jinsiy jarayon (konyugatsiya) va irsiy axborotni yangilashda ishtirok etadi." },
  { id: "mouth", name: "Hujayra ogʻzi va halqum", color: "#d6577a", text: "Kipriklar bakteriyalarni shu chuqurchaga haydaydi; oziq halqum orqali ichkariga tushadi." },
  { id: "food", name: "Hazm vakuolasi", color: "#d29a2e", text: "Oziq zarralari oʻralgan pufakcha; unda oziq hazm boʻladi, hazm boʻlmagan qoldiq tanadan chiqariladi." },
  { id: "contractile", name: "Qisqaruvchi vakuolalar", color: "#3f88c5", text: "Ikkita yulduzsimon vakuola navbat bilan qisqarib, ortiqcha suv va zararli moddalarni chiqaradi." },
];

export function Paramecium({ active, onPick }: DiagramProps) {
  const p = { active, onPick };
  const body = "M70 170 C50 110 120 70 210 76 C300 82 370 110 360 160 C352 206 280 246 200 244 C130 242 82 220 70 170Z";
  const cilia = Array.from({ length: 56 }, (_, i) => {
    const a = (i / 56) * Math.PI * 2;
    const x = 212 + Math.cos(a) * 150;
    const y = 160 + Math.sin(a) * 82;
    const nx = Math.cos(a);
    const ny = Math.sin(a);
    return <line key={i} x1={x} y1={y} x2={x + nx * 11} y2={y + ny * 11} />;
  });
  return (
    <svg viewBox="0 0 420 320" className="w-full h-auto" role="img" aria-label="Infuzoriya-tufelka sxemasi" onClick={() => onPick("")}>
      <Part id="cilia" label="Kipriklar" {...p}>
        <g stroke="#6a8fc7" strokeWidth="2" strokeLinecap="round" style={glow(active === "cilia", "#6a8fc7")}>{cilia}</g>
      </Part>
      <Part id="pellicle" label="Pellikula" {...p}>
        <path d={body} transform="translate(0 0)" fill="#e6eef9" stroke="#4a6fa5" strokeWidth="6" style={glow(active === "pellicle", "#4a6fa5")} />
      </Part>
      <Part id="mouth" label="Hujayra ogʻzi va halqum" {...p}>
        <g style={glow(active === "mouth", "#d6577a")}>
          <path d="M150 232 C160 200 190 190 214 178" stroke="#d6577a" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
          <circle cx="150" cy="236" r="9" fill="#f6c3d0" stroke="#d6577a" strokeWidth="3" />
        </g>
      </Part>
      <Part id="macro" label="Katta yadro" {...p}>
        <ellipse cx="236" cy="150" rx="36" ry="22" fill="#b9a4e6" stroke="#8d6fd0" strokeWidth="3" style={glow(active === "macro", "#8d6fd0")} />
      </Part>
      <Part id="micro" label="Kichik yadro" {...p}>
        <circle cx="246" cy="176" r="9" fill="#d3c1f0" stroke="#8d6fd0" strokeWidth="2.5" style={glow(active === "micro", "#b08be0")} />
      </Part>
      <Part id="food" label="Hazm vakuolasi" {...p}>
        {[[160, 150, 15], [186, 128, 12], [290, 200, 13]].map(([x, y, r], i) => (
          <g key={i} style={glow(active === "food", "#d29a2e")}>
            <circle cx={x} cy={y} r={r} fill="#f6e1ad" stroke="#d29a2e" strokeWidth="2.5" />
            <circle cx={x} cy={y} r={r / 2.6} fill="#4cae5c" />
          </g>
        ))}
      </Part>
      <Part id="contractile" label="Qisqaruvchi vakuolalar" {...p}>
        {[[110, 150], [320, 168]].map(([x, y], i) => (
          <g key={i} style={glow(active === "contractile", "#3f88c5")}>
            <circle cx={x} cy={y} r="12" fill="#e3f1fb" stroke="#3f88c5" strokeWidth="3" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <line key={a} x1={x} y1={y} x2={x + Math.cos((a * Math.PI) / 180) * 24} y2={y + Math.sin((a * Math.PI) / 180) * 24} stroke="#3f88c5" strokeWidth="2.5" strokeLinecap="round" />
            ))}
          </g>
        ))}
      </Part>
    </svg>
  );
}

/* ═════════════════ BARG KESIMI ═════════════════ */
export const LEAF_PARTS: PartDef[] = [
  { id: "cuticle", name: "Kutikula va yuqori epidermis", color: "#8db75c", text: "Bargning ustki himoya qavati. Kutikula mumsimon parda boʻlib, suvning ortiqcha bugʻlanishini kamaytiradi." },
  { id: "palisade", name: "Ustunsimon toʻqima", color: "#2f9e44", text: "Zich joylashgan, xloroplastlarga boy hujayralar. Fotosintez asosan shu yerda boradi." },
  { id: "spongy", name: "Gʻovak toʻqima", color: "#7cc47e", text: "Hujayralar orasida havo boʻshliqlari koʻp; gazlar almashinuvi va fotosintezda ishtirok etadi." },
  { id: "vein", name: "Oʻtkazuvchi tutam (tomir)", color: "#d29a2e", text: "Suv va mineral moddalar (ksilema) hamda organik moddalar (floema) ni tashiydi." },
  { id: "lower", name: "Pastki epidermis", color: "#8db75c", text: "Bargning pastki himoya qavati; unda koʻplab ogʻizchalar joylashadi." },
  { id: "stoma", name: "Ogʻizcha (qoʻriqchi hujayralar)", color: "#d6577a", text: "Ikki qoʻriqchi hujayra oraligʻidagi tirqish. U orqali CO₂ kiradi, kislorod va suv bugʻi chiqadi (transpiratsiya)." },
];

export function LeafSection({ active, onPick }: DiagramProps) {
  const p = { active, onPick };
  return (
    <svg viewBox="0 0 420 320" className="w-full h-auto" role="img" aria-label="Bargning koʻndalang kesimi" onClick={() => onPick("")}>
      <Part id="cuticle" label="Kutikula va yuqori epidermis" {...p}>
        <g style={glow(active === "cuticle", "#8db75c")}>
          <rect x="20" y="40" width="380" height="7" fill="#e9d878" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={22 + i * 31.6} y="48" width="29" height="26" rx="4" fill="#d9eab4" stroke="#8db75c" strokeWidth="2" />
          ))}
        </g>
      </Part>
      <Part id="palisade" label="Ustunsimon toʻqima" {...p}>
        <g style={glow(active === "palisade", "#2f9e44")}>
          {Array.from({ length: 17 }, (_, i) => (
            <g key={i}>
              <rect x={22 + i * 22.4} y="78" width="20" height="62" rx="6" fill="#bfe3a0" stroke="#2f9e44" strokeWidth="2" />
              <ellipse cx={32 + i * 22.4} cy="96" rx="5" ry="3" fill="#2f9e44" />
              <ellipse cx={32 + i * 22.4} cy="118" rx="5" ry="3" fill="#2f9e44" />
            </g>
          ))}
        </g>
      </Part>
      <Part id="spongy" label="Gʻovak toʻqima" {...p}>
        <g style={glow(active === "spongy", "#7cc47e")}>
          {Array.from({ length: 22 }, (_, i) => {
            const r = Math.floor(i / 8);
            const c = i % 8;
            return (
              <ellipse key={i} cx={46 + c * 46 + (r % 2) * 20} cy={160 + r * 28} rx="19" ry="12" fill="#d7efc4" stroke="#7cc47e" strokeWidth="2" />
            );
          })}
        </g>
      </Part>
      <Part id="vein" label="Oʻtkazuvchi tutam" {...p}>
        <g style={glow(active === "vein", "#d29a2e")}>
          <circle cx="206" cy="184" r="27" fill="#f6e1ad" stroke="#d29a2e" strokeWidth="3" />
          <circle cx="196" cy="180" r="7" fill="#c8884a" />
          <circle cx="212" cy="176" r="6" fill="#c8884a" />
          <circle cx="206" cy="196" r="8" fill="#fff3c8" stroke="#d29a2e" strokeWidth="1.5" />
        </g>
      </Part>
      <Part id="lower" label="Pastki epidermis" {...p}>
        <g style={glow(active === "lower", "#8db75c")}>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={22 + i * 31.6} y="248" width="29" height="22" rx="4" fill="#d9eab4" stroke="#8db75c" strokeWidth="2" />
          ))}
          <rect x="20" y="271" width="380" height="6" fill="#e9d878" />
        </g>
      </Part>
      <Part id="stoma" label="Ogʻizcha" {...p}>
        <g style={glow(active === "stoma", "#d6577a")}>
          {[120, 296].map((x) => (
            <g key={x}>
              <ellipse cx={x - 8} cy="260" rx="9" ry="14" fill="#f6c3d0" stroke="#d6577a" strokeWidth="2.5" />
              <ellipse cx={x + 8} cy="260" rx="9" ry="14" fill="#f6c3d0" stroke="#d6577a" strokeWidth="2.5" />
              <line x1={x} y1="248" x2={x} y2="272" stroke="#fff" strokeWidth="2" />
            </g>
          ))}
        </g>
      </Part>
      {/* gaz belgilari */}
      <g fontSize="12" fill="currentColor" opacity="0.65" fontWeight="700">
        <text x="20" y="304">CO₂ ↑ kiradi · O₂ ↓ chiqadi</text>
      </g>
    </svg>
  );
}

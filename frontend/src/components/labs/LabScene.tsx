"use client";

/** Laboratoriya kartalari uchun jonli SVG sahnalar (har bir tajriba oʻziga xos). */
export function LabScene({ type }: { type: string }) {
  switch (type) {
    case "MICROSCOPE": return <Microscope />;
    case "MEASUREMENT": return <Measure />;
    case "OSMOSIS": return <Osmosis />;
    case "CHEMISTRY": return <Boil />;
    case "GERMINATION": return <Sprout />;
    case "PHOTOSYNTHESIS": return <Photo />;
    case "DISSECTION": return <Flower />;
    case "FOODWEB": return <Web />;
    default: return <Microscope />;
  }
}

const S = { className: "w-full h-full", viewBox: "0 0 320 176", preserveAspectRatio: "xMidYMid slice" as const };

function Defs() {
  return (
    <defs>
      <radialGradient id="g-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#2ee6c0" stopOpacity=".55" />
        <stop offset="1" stopColor="#2ee6c0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g-glow2" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ffc857" stopOpacity=".7" />
        <stop offset="1" stopColor="#ffc857" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5ab0ff" stopOpacity=".75" />
        <stop offset="1" stopColor="#2a6fd0" stopOpacity=".85" />
      </linearGradient>
      <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9fd8ff" stopOpacity=".35" />
        <stop offset=".5" stopColor="#9fd8ff" stopOpacity=".08" />
        <stop offset="1" stopColor="#9fd8ff" stopOpacity=".3" />
      </linearGradient>
    </defs>
  );
}

function Microscope() {
  const cells = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) cells.push([60 + c * 28 + (r % 2) * 14, 18 + r * 26]);
  return (
    <svg {...S} aria-hidden>
      <Defs />
      <circle cx="160" cy="88" r="150" fill="url(#g-glow)" opacity=".5" />
      <clipPath id="lens"><circle cx="160" cy="88" r="74" /></clipPath>
      <circle cx="160" cy="88" r="78" fill="#050c14" stroke="#2ee6c0" strokeWidth="2" opacity=".9" />
      <g clipPath="url(#lens)">
        <g className="anim-drift">
          <rect x="40" y="0" width="260" height="176" fill="#0d2a1f" />
          {cells.map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 12} y={y - 10} width="24" height="20" rx="3" fill="#7bd88f" fillOpacity=".25" stroke="#3fb561" strokeWidth="1.2" />
              {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} cx={x - 7 + (k % 2) * 12} cy={y - 5 + Math.floor(k / 2) * 9} rx="2.6" ry="1.7" fill="#38d36b" />
              ))}
            </g>
          ))}
        </g>
      </g>
      <circle cx="160" cy="88" r="74" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="6" />
      <path d="M160 14 v150 M86 88 h148" stroke="#2ee6c0" strokeOpacity=".35" strokeWidth="1" strokeDasharray="3 5" />
    </svg>
  );
}

function Measure() {
  return (
    <svg {...S} aria-hidden>
      <Defs />
      <circle cx="90" cy="90" r="90" fill="url(#g-glow2)" opacity=".35" />
      {/* tarozi */}
      <g transform="translate(90 86)">
        <path d="M0 -50 v90 M-24 40 h48" stroke="#9fd8ff" strokeWidth="3" strokeLinecap="round" />
        <g className="anim-drift" style={{ transformOrigin: "0 -44px" }}>
          <path d="M-62 -40 L62 -40" stroke="#2ee6c0" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M-62 -40 v22 M62 -40 v22" stroke="#9fd8ff" strokeWidth="1.5" />
          <path d="M-80 -18 h36 a18 10 0 0 1 -36 0z" fill="#2ee6c0" fillOpacity=".3" stroke="#2ee6c0" strokeWidth="2" />
          <path d="M44 -18 h36 a18 10 0 0 1 -36 0z" fill="#ffc857" fillOpacity=".3" stroke="#ffc857" strokeWidth="2" />
        </g>
      </g>
      {/* chizgʻich */}
      <g transform="translate(180 40) rotate(-18)">
        <rect width="120" height="26" rx="4" fill="#ffc857" fillOpacity=".18" stroke="#ffc857" strokeWidth="1.5" />
        {Array.from({ length: 13 }).map((_, i) => (
          <path key={i} d={`M${6 + i * 9} 0 v${i % 5 === 0 ? 12 : 7}`} stroke="#ffc857" strokeWidth="1.2" />
        ))}
      </g>
      {/* termometr */}
      <g transform="translate(250 60)">
        <rect x="-5" y="0" width="10" height="70" rx="5" fill="url(#g-glass)" stroke="#9fd8ff" strokeWidth="1.5" />
        <circle cx="0" cy="78" r="10" fill="#ff6b7a" />
        <rect x="-2" y="26" width="4" height="52" fill="#ff6b7a" className="anim-glow" />
      </g>
    </svg>
  );
}

function Osmosis() {
  return (
    <svg {...S} aria-hidden>
      <Defs />
      <rect x="0" y="0" width="160" height="176" fill="#2a6fd0" opacity=".12" />
      <rect x="160" y="0" width="160" height="176" fill="#ffc857" opacity=".07" />
      <path d="M160 0 V176" stroke="#2ee6c0" strokeWidth="3" strokeDasharray="6 6" className="anim-dash" />
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} r="4.2" fill="#5ab0ff" cx={20 + ((i * 47) % 280)} cy={14 + ((i * 29) % 150)} className="anim-drift" style={{ animationDelay: `${-i * 0.45}s`, animationDuration: `${5 + (i % 4)}s` }} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={i} r="6.5" fill="#ffc857" cx={185 + ((i * 41) % 120)} cy={26 + ((i * 53) % 130)} className="anim-drift" style={{ animationDelay: `${-i * 0.9}s` }} />
      ))}
      <path d="M130 88 h42" stroke="#2ee6c0" strokeWidth="3" markerEnd="url(#arr)" strokeLinecap="round" />
      <path d="m164 80 10 8 -10 8" fill="none" stroke="#2ee6c0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Boil() {
  return (
    <svg {...S} aria-hidden>
      <Defs />
      <circle cx="160" cy="150" r="90" fill="url(#g-glow2)" opacity=".5" />
      <path d="M130 30 h60 v34 l30 62 a14 14 0 0 1 -13 20 h-94 a14 14 0 0 1 -13 -20 l30 -62z" fill="url(#g-glass)" stroke="#9fd8ff" strokeWidth="2" />
      <path d="M118 98 h84 l16 32 a10 10 0 0 1 -9 14 h-98 a10 10 0 0 1 -9 -14z" fill="url(#g-water)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} r={2.2 + (i % 3)} fill="#fff" fillOpacity=".7" cx={132 + i * 8.5} cy={134} className="anim-bubble" style={{ animationDelay: `${-i * 0.37}s`, animationDuration: `${1.8 + (i % 3) * 0.5}s` }} />
      ))}
      <path d="M145 160 h30 l-4 8 h-22z" fill="#c8d6e5" fillOpacity=".5" />
      <path className="anim-flame" d="M160 168 c-9 -8 -7 -18 0 -26 c7 8 9 18 0 26z" fill="#ffc857" />
      <path className="anim-flame" d="M160 168 c-4 -4 -3 -9 0 -13 c3 4 4 9 0 13z" fill="#ff6b7a" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${150 + i * 10} 26 q6 -10 0 -20`} fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" className="anim-bubble" style={{ animationDelay: `${-i * 0.8}s` }} />
      ))}
    </svg>
  );
}

function Sprout() {
  return (
    <svg {...S} aria-hidden>
      <Defs />
      <rect x="0" y="118" width="320" height="58" fill="#5a3a22" fillOpacity=".55" />
      {[70, 160, 250].map((x, i) => (
        <g key={x} transform={`translate(${x} 118)`}>
          <ellipse cx="0" cy="8" rx="13" ry="8" fill="#e8c585" />
          <g style={{ transformOrigin: "0 8px", animation: `grow-up 3.2s ${i * 0.5}s ease-out infinite alternate` }}>
            <path d={`M0 6 q${i % 2 ? 6 : -6} -30 0 -${60 + i * 12}`} fill="none" stroke="#4be38a" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="-12" cy={-52 - i * 12} rx="13" ry="6" fill="#4be38a" transform={`rotate(-30 -12 ${-52 - i * 12})`} />
            <ellipse cx="12" cy={-58 - i * 12} rx="13" ry="6" fill="#2ee6c0" transform={`rotate(30 12 ${-58 - i * 12})`} />
          </g>
          <path d="M0 14 q-4 14 -10 24 M0 14 q4 12 10 22" stroke="#e8d3a8" strokeWidth="2" fill="none" />
        </g>
      ))}
      <circle cx="270" cy="30" r="30" fill="url(#g-glow2)" />
      <circle cx="270" cy="30" r="10" fill="#ffc857" />
    </svg>
  );
}

function Photo() {
  return (
    <svg {...S} aria-hidden>
      <Defs />
      <circle cx="70" cy="60" r="80" fill="url(#g-glow2)" opacity=".75" />
      <circle cx="70" cy="60" r="14" fill="#ffc857" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d="M70 60 L70 20" stroke="#ffc857" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i * 45 + 22} 70 60)`} className="anim-glow" style={{ animationDelay: `${-i * 0.3}s` }} />
      ))}
      <path d="M185 40 h80 v90 a14 14 0 0 1 -14 14 h-52 a14 14 0 0 1 -14 -14z" fill="url(#g-glass)" stroke="#9fd8ff" strokeWidth="2" />
      <path d="M185 70 h80 v60 a14 14 0 0 1 -14 14 h-52 a14 14 0 0 1 -14 -14z" fill="url(#g-water)" />
      <path d="M225 144 q-4 -40 -18 -52 M225 144 q4 -50 20 -62 M225 144 q0 -40 0 -64" stroke="#4be38a" strokeWidth="3" fill="none" strokeLinecap="round" />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} r={2 + (i % 3)} fill="#fff" fillOpacity=".8" cx={206 + (i % 4) * 14} cy={100} className="anim-bubble" style={{ animationDelay: `${-i * 0.42}s`, animationDuration: `${2 + (i % 3) * 0.4}s` }} />
      ))}
    </svg>
  );
}

function Flower() {
  return (
    <svg {...S} aria-hidden>
      <Defs />
      <circle cx="160" cy="88" r="100" fill="url(#g-glow)" opacity=".35" />
      <g className="anim-spin-slow" style={{ transformOrigin: "160px 88px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={i} cx="160" cy="46" rx="15" ry="32" fill="#ff8fb1" fillOpacity=".85" stroke="#ffd0e0" strokeWidth="1.2" transform={`rotate(${i * 60} 160 88)`} />
        ))}
      </g>
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 72 + 20} 160 88)`}>
          <path d="M160 88 V58" stroke="#ffe29a" strokeWidth="2" />
          <ellipse cx="160" cy="55" rx="4" ry="6" fill="#ffc857" />
        </g>
      ))}
      <circle cx="160" cy="88" r="10" fill="#4be38a" stroke="#c9ffe0" strokeWidth="1.5" />
    </svg>
  );
}

function Web() {
  const nodes = [
    [50, 130, "#4be38a"], [120, 80, "#9be15d"], [190, 120, "#ffc857"], [250, 60, "#ff8a5b"], [160, 30, "#ff6b7a"], [280, 130, "#a98bff"],
  ] as const;
  const links = [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5], [4, 3], [0, 2]];
  return (
    <svg {...S} aria-hidden>
      <Defs />
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#2ee6c0" strokeOpacity=".6" strokeWidth="2" strokeDasharray="5 7" className="anim-dash" />
      ))}
      {nodes.map(([x, y, c], i) => (
        <g key={i} className="anim-drift" style={{ animationDelay: `${-i * 0.9}s` }}>
          <circle cx={x} cy={y} r="22" fill={c} fillOpacity=".15" className="anim-glow" style={{ animationDelay: `${-i * 0.4}s` }} />
          <circle cx={x} cy={y} r="11" fill={c} />
        </g>
      ))}
    </svg>
  );
}

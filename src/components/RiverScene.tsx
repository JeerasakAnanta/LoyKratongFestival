// ฉากประดับ: ภูเขา หมู่บ้านริมน้ำ และแม่น้ำ (ไม่มีข้อมูลให้อ่าน จึงซ่อนจาก screen reader)
const HOUSES = [
  { x: 150, s: 1 },
  { x: 330, s: 0.8 },
  { x: 980, s: 0.9 },
  { x: 1170, s: 1.1 },
];
const PALMS = [
  { x: 60, s: 1 },
  { x: 250, s: 0.8 },
  { x: 1070, s: 0.9 },
  { x: 1330, s: 1.1 },
];
const KRATONGS = [
  { x: 380, y: 372, delay: "0s", dur: "26s" },
  { x: 760, y: 392, delay: "-9s", dur: "32s" },
  { x: 1080, y: 366, delay: "-17s", dur: "28s" },
];
const RIPPLES = [348, 366, 384, 402];

export default function RiverScene() {
  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="rs-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14305c" />
          <stop offset="1" stopColor="#060f22" />
        </linearGradient>
        <radialGradient id="rs-glint" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#f2c46d" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f2c46d" stopOpacity="0" />
        </radialGradient>

        <symbol id="rs-house" viewBox="0 0 120 110" overflow="visible">
          <rect x="22" y="68" width="5" height="42" />
          <rect x="93" y="68" width="5" height="42" />
          <rect x="52" y="68" width="5" height="42" />
          <rect x="15" y="40" width="90" height="30" />
          <path d="M5 42 L60 6 L115 42 Z" />
          <rect x="30" y="48" width="14" height="14" fill="#f2c46d" />
          <rect x="74" y="48" width="14" height="14" fill="#f2c46d" />
        </symbol>
        <symbol id="rs-palm" viewBox="0 0 80 150" overflow="visible">
          <path d="M38 150 Q44 90 40 40 L46 40 Q50 95 46 150 Z" />
          <path d="M42 40 Q20 26 2 40 Q24 30 42 44 Q60 30 82 40 Q62 26 42 40 Q34 14 14 10 Q34 14 42 40 Q52 12 72 8 Q52 14 42 40Z" />
        </symbol>
      </defs>

      {/* ภูเขา: ไกลสุดกลมกลืนกับท้องฟ้า */}
      <path
        fill="#241a55"
        d="M0 250 L120 150 L230 215 L380 110 L520 220 L640 160 L780 235 L930 120 L1080 215 L1210 140 L1340 210 L1440 170 L1440 420 L0 420Z"
      />
      <path
        fill="#1a1340"
        d="M0 290 L150 215 L290 270 L450 190 L600 275 L760 225 L900 285 L1060 205 L1220 275 L1340 235 L1440 270 L1440 420 L0 420Z"
      />

      {/* พื้นดินและหมู่บ้าน */}
      <g fill="#0f0b2b">
        <path d="M0 320 Q360 296 720 312 T1440 304 L1440 420 L0 420Z" />
        {HOUSES.map((h) => (
          <use
            key={h.x}
            href="#rs-house"
            x={h.x}
            y={312 - 110 * h.s + 12}
            width={120 * h.s}
            height={110 * h.s}
          />
        ))}
        {PALMS.map((p) => (
          <use
            key={p.x}
            href="#rs-palm"
            x={p.x}
            y={318 - 150 * p.s + 6}
            width={80 * p.s}
            height={150 * p.s}
          />
        ))}
        {/* เจดีย์ */}
        <path d="M698 316 L698 290 Q690 280 700 272 L704 240 L708 272 Q718 280 710 290 L710 316 Z M690 316 L718 316 L718 322 L690 322Z" />
      </g>

      {/* แม่น้ำ */}
      <rect x="0" y="322" width="1440" height="98" fill="url(#rs-river)" />
      <ellipse cx="1180" cy="344" rx="90" ry="22" fill="url(#rs-glint)" />
      <g className="scene-ripple" stroke="#9fb7ff" strokeOpacity="0.18" strokeWidth="1.5" fill="none">
        {RIPPLES.map((y) => (
          <path
            key={y}
            d={`M-160 ${y} q20 -6 40 0${" t40 0".repeat(40)}`}
          />
        ))}
      </g>

      {/* กระทงลอย */}
      {KRATONGS.map((k) => (
        <g
          key={k.x}
          className="scene-kratong"
          style={{ animationDelay: k.delay, animationDuration: k.dur }}
        >
          <path d={`M${k.x - 10} ${k.y} h20 l-3 7 h-14 Z`} fill="#f4a6c0" />
          <path d={`M${k.x} ${k.y - 9} q4 5 0 9 q-4 -4 0 -9Z`} fill="#f2c46d" />
        </g>
      ))}
    </svg>
  );
}

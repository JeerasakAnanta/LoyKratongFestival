import { colorHex, type KratongDesign } from "@/lib/kratong/design";

// ตำแหน่งดอกไม้บนฐาน (ซ้าย กลาง ขวา) ใน viewBox 100x100
const SLOTS = [
  { x: 32, y: 66 },
  { x: 68, y: 66 },
  { x: 50, y: 70 },
];

function Base({ id, accent }: { id: string; accent: string }) {
  switch (id) {
    case "lotus":
      return (
        <g>
          {[-60, -30, 0, 30, 60].map((r) => (
            <ellipse
              key={r}
              cx="50"
              cy="76"
              rx="9"
              ry="20"
              fill="#f7c6d8"
              stroke="#e58fb0"
              strokeWidth="0.8"
              transform={`rotate(${r} 50 92)`}
            />
          ))}
          <ellipse cx="50" cy="90" rx="30" ry="5" fill="#e58fb0" opacity="0.6" />
        </g>
      );
    case "coconut":
      return (
        <g>
          <path d="M14 66 Q50 112 86 66 Z" fill="#7a4a24" />
          <path d="M14 66 Q50 112 86 66" fill="none" stroke="#a8693a" strokeWidth="2" />
          <ellipse cx="50" cy="66" rx="36" ry="5" fill="#4d2c14" />
        </g>
      );
    case "star":
      return (
        <g>
          <path
            d="M50 54 L58 70 L76 72 L63 84 L67 100 L50 91 L33 100 L37 84 L24 72 L42 70 Z"
            fill={accent}
            stroke="#d99a2b"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      );
    default:
      // ใบตอง: ใบซ้อนกันสองชั้น
      return (
        <g>
          <path d="M10 68 Q50 104 90 68 Q50 80 10 68 Z" fill="#2f7d4a" />
          <path d="M18 66 Q50 96 82 66 Q50 76 18 66 Z" fill="#46a86a" />
          <path d="M50 70 L50 90" stroke="#2f7d4a" strokeWidth="1" />
        </g>
      );
  }
}

function Flower({ id, x, y }: { id: string; x: number; y: number }) {
  switch (id) {
    case "lotus":
      return (
        <g transform={`translate(${x} ${y})`}>
          {[-35, 0, 35].map((r) => (
            <ellipse key={r} cx="0" cy="-5" rx="3.6" ry="7" fill="#f7a8c8" transform={`rotate(${r})`} />
          ))}
          <circle r="2.2" fill="#f2c46d" />
        </g>
      );
    case "orchid":
      return (
        <g transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-5" rx="3" ry="5.5" fill="#b78af2" transform={`rotate(${r})`} />
          ))}
          <circle r="2" fill="#fff3a8" />
        </g>
      );
    case "jasmine":
      return (
        <g transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-4" rx="2.4" ry="4.4" fill="#ffffff" stroke="#e6e0d0" strokeWidth="0.4" transform={`rotate(${r})`} />
          ))}
          <circle r="1.4" fill="#f2c46d" />
        </g>
      );
    case "rose":
      return (
        <g transform={`translate(${x} ${y})`}>
          <circle r="6" fill="#d93a55" />
          <path d="M-3 0 a3 3 0 1 1 3 3 a1.6 1.6 0 1 1 -1.6 -1.6" fill="none" stroke="#fbb3c0" strokeWidth="1" />
        </g>
      );
    default:
      // ดาวเรือง
      return (
        <g transform={`translate(${x} ${y})`}>
          {Array.from({ length: 10 }, (_, i) => i * 36).map((r) => (
            <ellipse key={r} cx="0" cy="-4.6" rx="2.2" ry="4" fill="#f59f1b" transform={`rotate(${r})`} />
          ))}
          <circle r="3" fill="#ffc83d" />
        </g>
      );
  }
}

function Candle({ x, color, flame }: { x: number; color: string; flame: boolean }) {
  return (
    <g>
      <rect x={x - 2.5} y="30" width="5" height="26" rx="1.2" fill={color} />
      {flame && (
        <path
          className="kr-flame"
          d={`M${x} 17 q4.5 6 0 12 q-4.5 -6 0 -12Z`}
          fill="#ffb02e"
          stroke="#fff3a8"
          strokeWidth="0.8"
        />
      )}
    </g>
  );
}

function Decor({ id, accent }: { id: string; accent: string }) {
  switch (id) {
    case "sparkle":
      return (
        <g fill="#fff3a8">
          {[
            [14, 28],
            [86, 22],
            [78, 50],
            [22, 48],
          ].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2}Z`} />
          ))}
        </g>
      );
    case "bird":
      return (
        <path d="M6 40 q6 -8 12 0 q6 -8 12 0 q-6 3 -12 3 q-6 0 -12 -3Z" fill="#ffffff" opacity="0.9" />
      );
    case "lantern":
      return (
        <g>
          <line x1="86" y1="22" x2="86" y2="30" stroke="#d99a2b" strokeWidth="1" />
          <rect x="80" y="30" width="12" height="16" rx="4" fill="#e8483a" />
          <rect x="82" y="32" width="8" height="12" rx="3" fill="#ffb02e" opacity="0.8" />
        </g>
      );
    default:
      // ริบบิ้น
      return (
        <g fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round">
          <path d="M16 70 q-8 14 -4 24" />
          <path d="M84 70 q8 14 4 24" />
        </g>
      );
  }
}

interface Props {
  design: KratongDesign;
  /** ความกว้าง/สูงเป็น px ถ้าไม่ใส่จะเต็มพื้นที่ของพ่อแม่ */
  size?: number;
  /** ปิดเปลวไฟเมื่อต้องการภาพนิ่ง */
  flame?: boolean;
}

export default function KratongView({ design, size, flame = true }: Props) {
  const accent = colorHex(design.color);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 110"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={size ? undefined : "h-full w-full"}
    >
      <Base id={design.base} accent={accent} />
      {design.decor.map((d) => (
        <Decor key={d} id={d} accent={accent} />
      ))}
      {design.candle === "triple" ? (
        <g>
          <Candle x={36} color={accent} flame={flame} />
          <Candle x={50} color={accent} flame={flame} />
          <Candle x={64} color={accent} flame={flame} />
        </g>
      ) : (
        <Candle x={50} color={accent} flame={flame} />
      )}
      {design.flowers.map((f, i) => (
        <Flower key={f} id={f} x={SLOTS[i].x} y={SLOTS[i].y} />
      ))}
    </svg>
  );
}

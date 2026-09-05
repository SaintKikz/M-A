// ─── Radar chart SVG des compétences (Desk Ready) ───────────────────────────
import { SKILLS } from "../store/progress";

export function SkillRadar({ scores, size = 260 }: { scores: Record<string, { score: number; n: number }>; size?: number }) {
  const n = SKILLS.length;
  const cx = size / 2, cy = size / 2;
  const rMax = size / 2 - 34;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, r: number) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];

  const gridLevels = [25, 50, 75, 100];
  const poly = (r: number) => SKILLS.map((_, i) => pt(i, (r / 100) * rMax).join(",")).join(" ");
  const values = SKILLS.map((s) => scores[s]?.n ? Math.max(0, Math.min(100, scores[s].score)) : 0);
  const valuePoly = SKILLS.map((_, i) => pt(i, (values[i] / 100) * rMax).join(",")).join(" ");
  const hasData = SKILLS.some((s) => scores[s]?.n);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Radar des compétences">
      {gridLevels.map((g) => (
        <polygon key={g} points={poly(g)} fill="none" stroke="var(--color-border)" strokeWidth="1" />
      ))}
      {SKILLS.map((_, i) => {
        const [x, y] = pt(i, rMax);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-border)" strokeWidth="1" />;
      })}
      {hasData && (
        <polygon points={valuePoly} fill="var(--color-accent)" fillOpacity="0.25" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
      )}
      {SKILLS.map((s, i) => {
        const [x, y] = pt(i, rMax + 18);
        const v = scores[s]?.n ? Math.round(scores[s].score) : null;
        return (
          <g key={s}>
            <text x={x} y={y - 4} textAnchor="middle" fill="var(--color-muted)" fontSize="10" fontWeight="600">{s}</text>
            <text x={x} y={y + 8} textAnchor="middle" fill={v === null ? "var(--color-muted)" : v >= 70 ? "var(--color-green)" : v >= 45 ? "var(--color-gold)" : "var(--color-red)"} fontSize="10" fontWeight="700">
              {v === null ? "·" : v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

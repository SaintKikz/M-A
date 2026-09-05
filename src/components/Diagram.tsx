import type { DiagramSpec } from "../data/academy/types";

// Diagrammes SVG génériques : bridge (waterfall), stacks (structures), flow (timeline).
const C = {
  base: "var(--color-accent)",
  add: "var(--color-green)",
  sub: "var(--color-red)",
  total: "var(--color-accent2)",
  ink: "var(--color-ink)",
  muted: "var(--color-muted)",
  surface: "var(--color-surface2)",
  border: "var(--color-border)",
};

function Bridge({ spec }: { spec: Extract<DiagramSpec, { type: "bridge" }> }) {
  const W = 640, H = 260, padL = 10, padB = 34, padT = 30;
  const n = spec.items.length;
  const bw = Math.min(90, (W - padL * 2) / n - 14);
  // Calcule les positions cumulées (waterfall)
  let run = 0;
  const bars = spec.items.map((it) => {
    let y0: number, y1: number;
    if (it.kind === "base") { y0 = 0; y1 = it.value; run = it.value; }
    else if (it.kind === "total") { y0 = 0; y1 = run; }
    else if (it.kind === "add") { y0 = run; run += it.value; y1 = run; }
    else { y1 = run; run -= it.value; y0 = run; }
    return { ...it, lo: Math.min(y0, y1), hi: Math.max(y0, y1) };
  });
  const maxV = Math.max(...bars.map((b) => b.hi)) * 1.15 || 1;
  const sy = (v: number) => H - padB - (v / maxV) * (H - padB - padT);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <text x={W / 2} y={16} textAnchor="middle" fill={C.ink} fontSize="13" fontWeight="700">{spec.title}</text>
      {bars.map((b, i) => {
        const x = padL + (i + 0.5) * ((W - padL * 2) / n) - bw / 2;
        return (
          <g key={i}>
            <rect x={x} y={sy(b.hi)} width={bw} height={Math.max(2, sy(b.lo) - sy(b.hi))} rx={5} fill={C[b.kind]} opacity={0.85} />
            <text x={x + bw / 2} y={sy(b.hi) - 6} textAnchor="middle" fill={C.ink} fontSize="11" fontWeight="700">
              {b.kind === "sub" ? "−" : b.kind === "add" ? "+" : ""}{b.value}{spec.unit ?? ""}
            </text>
            <text x={x + bw / 2} y={H - padB + 14} textAnchor="middle" fill={C.muted} fontSize="10">
              {b.label.length > 14 ? b.label.slice(0, 13) + "…" : b.label}
            </text>
            {i < bars.length - 1 && b.kind !== "total" && (
              <line x1={x + bw} y1={sy(bars[i].kind === "sub" ? bars[i].lo : bars[i].hi)} x2={padL + (i + 1.5) * ((W - padL * 2) / n) - bw / 2} y2={sy(bars[i].kind === "sub" ? bars[i].lo : bars[i].hi)} stroke={C.border} strokeDasharray="4 3" />
            )}
          </g>
        );
      })}
      <line x1={padL} y1={H - padB} x2={W - padL} y2={H - padB} stroke={C.border} />
    </svg>
  );
}

function Stacks({ spec }: { spec: Extract<DiagramSpec, { type: "stack" }> }) {
  const W = 640, H = 280, padT = 30;
  const ns = spec.stacks.length;
  const sw = Math.min(220, (W - 60) / ns);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <text x={W / 2} y={16} textAnchor="middle" fill={C.ink} fontSize="13" fontWeight="700">{spec.title}</text>
      {spec.stacks.map((st, si) => {
        const x = (W / (ns + 1)) * (si + 1) - sw / 2;
        const total = st.layers.length;
        const lh = (H - padT - 50) / total;
        return (
          <g key={si}>
            {st.layers.map((l, li) => (
              <g key={li}>
                <rect x={x} y={padT + 10 + li * lh} width={sw} height={lh - 4} rx={6}
                  fill={l.color ?? [C.base, C.total, C.add, "#f5b83d", C.sub][li % 5]} opacity={0.8} />
                <text x={x + sw / 2} y={padT + 10 + li * lh + lh / 2 - (l.note ? 4 : -4)} textAnchor="middle" fill="#0b0e14" fontSize="11.5" fontWeight="700">{l.label}</text>
                {l.note && <text x={x + sw / 2} y={padT + 10 + li * lh + lh / 2 + 10} textAnchor="middle" fill="#0b0e14" fontSize="9.5">{l.note}</text>}
              </g>
            ))}
            <text x={x + sw / 2} y={H - 14} textAnchor="middle" fill={C.ink} fontSize="12" fontWeight="700">{st.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Flow({ spec }: { spec: Extract<DiagramSpec, { type: "flow" }> }) {
  const n = spec.steps.length;
  const perRow = Math.min(n, 4);
  const rows = Math.ceil(n / perRow);
  const W = 640, bh = 58, gap = 26, H = 40 + rows * (bh + gap);
  const bw = (W - 40 - (perRow - 1) * gap) / perRow;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <text x={W / 2} y={16} textAnchor="middle" fill={C.ink} fontSize="13" fontWeight="700">{spec.title}</text>
      {spec.steps.map((s, i) => {
        const r = Math.floor(i / perRow), c = i % perRow;
        const x = 20 + c * (bw + gap), y = 30 + r * (bh + gap);
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={10} fill={C.surface} stroke={C.border} />
            <text x={x + bw / 2} y={y + (s.note ? 24 : 33)} textAnchor="middle" fill={C.ink} fontSize="11.5" fontWeight="700">{s.label}</text>
            {s.note && <text x={x + bw / 2} y={y + 40} textAnchor="middle" fill={C.muted} fontSize="9.5">{s.note}</text>}
            {i < n - 1 && c < perRow - 1 && (
              <text x={x + bw + gap / 2} y={y + bh / 2 + 4} textAnchor="middle" fill={C.base} fontSize="14" fontWeight="700">→</text>
            )}
            {i < n - 1 && c === perRow - 1 && (
              <text x={x + bw / 2} y={y + bh + gap / 2 + 5} textAnchor="middle" fill={C.base} fontSize="14" fontWeight="700">↓</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function Diagram({ spec }: { spec: DiagramSpec }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 my-3">
      {spec.type === "bridge" && <Bridge spec={spec} />}
      {spec.type === "stack" && <Stacks spec={spec} />}
      {spec.type === "flow" && <Flow spec={spec} />}
    </div>
  );
}

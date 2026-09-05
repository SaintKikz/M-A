import React from "react";

export function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-surface border border-border rounded-2xl p-5 ${onClick ? "cursor-pointer hover:border-accent/60 hover:bg-surface2 transition-colors" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, kind = "primary", disabled, className = "" }: { children: React.ReactNode; onClick?: () => void; kind?: "primary" | "ghost" | "success" | "danger" | "gold"; disabled?: boolean; className?: string }) {
  const styles = {
    primary: "bg-accent hover:bg-accent/85 text-white",
    ghost: "bg-surface2 hover:bg-border text-ink border border-border",
    success: "bg-green/90 hover:bg-green text-black",
    danger: "bg-red/90 hover:bg-red text-black",
    gold: "bg-gold hover:bg-gold/85 text-black",
  }[kind];
  return (
    <button disabled={disabled} onClick={onClick} className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Tag({ children, color = "accent" }: { children: React.ReactNode; color?: string }) {
  const map: Record<string, string> = {
    accent: "bg-accent/15 text-accent",
    gold: "bg-gold/15 text-gold",
    green: "bg-green/15 text-green",
    red: "bg-red/15 text-red",
    muted: "bg-surface2 text-muted",
    purple: "bg-accent2/15 text-accent2",
  };
  return <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${map[color] ?? map.accent}`}>{children}</span>;
}

export function Progress({ value, color = "var(--color-accent)", h = 8 }: { value: number; color?: string; h?: number }) {
  return (
    <div className="w-full rounded-full bg-surface2 overflow-hidden" style={{ height: h }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  );
}

export function Stat({ label, value, sub, accent }: { label: string; value: React.ReactNode; sub?: string; accent?: string }) {
  return (
    <Card className="!p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">{label}</div>
      <div className="text-2xl font-bold mt-1" style={accent ? { color: accent } : undefined}>{value}</div>
      {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
    </Card>
  );
}

export function PageTitle({ emoji, title, sub }: { emoji?: string; title: string; sub?: string }) {
  return (
    <div className="mb-6 fade-up">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{emoji && <span className="mr-2">{emoji}</span>}{title}</h1>
      {sub && <p className="text-muted mt-1.5 max-w-2xl text-sm md:text-base">{sub}</p>}
    </div>
  );
}

export function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const color = score >= 75 ? "var(--color-green)" : score >= 50 ? "var(--color-gold)" : "var(--color-red)";
  return (
    <svg width={size} height={size} className="pop">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface2)" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="var(--color-ink)" fontSize={size / 4.5} fontWeight="700">{Math.round(score)}%</text>
    </svg>
  );
}

export const diffLabel = (d: number) => ["", "Débutant", "Intermédiaire", "Avancé", "Pro"][d] ?? "";
export const diffColor = (d: number) => ["", "green", "accent", "gold", "red"][d] ?? "accent";

import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, PageTitle, Tag } from "../components/ui";
import * as fin from "../lib/finance";

// ─── Helpers d'affichage ────────────────────────────────────────────────────
const fm = (n: number, digits = 1) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(n);
const fp = (n: number, digits = 1) => `${(n * 100).toFixed(digits).replace(".", ",")}%`;
const fx = (n: number, digits = 2) => `${n.toFixed(digits).replace(".", ",")}x`;

function Num({ label, value, onChange, suffix, step = 1, min, hint }: {
  label: string; value: number; onChange: (v: number) => void;
  suffix?: string; step?: number; min?: number; hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">{label}</span>
      <span className="mt-1 flex items-center gap-2 bg-surface2 border border-border rounded-lg px-3 py-2 focus-within:border-accent/60">
        <input
          type="number" value={Number.isFinite(value) ? value : ""} step={step} min={min}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full bg-transparent outline-none text-sm font-semibold text-ink"
        />
        {suffix && <span className="text-xs text-muted shrink-0">{suffix}</span>}
      </span>
      {hint && <span className="text-[11px] text-muted mt-0.5 block">{hint}</span>}
    </label>
  );
}

function Out({ label, value, accent }: { label: string; value: string; accent?: "green" | "red" | "gold" | "accent" }) {
  const color = accent === "green" ? "text-green" : accent === "red" ? "text-red" : accent === "gold" ? "text-gold" : "text-accent";
  return (
    <div className="bg-surface2 rounded-xl px-4 py-3 border border-border">
      <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${color}`}>{value}</div>
    </div>
  );
}

function Method({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border-t border-border pt-3">
      <button onClick={() => setOpen(!open)} className="text-xs font-semibold text-accent hover:underline">
        {open ? "▾" : "▸"} Formule / méthodologie
      </button>
      {open && <div className="mt-2 text-xs text-muted leading-relaxed space-y-1.5">{children}</div>}
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return <div className="text-xs text-red bg-red/10 border border-red/30 rounded-lg px-3 py-2 mt-3">{msg}</div>;
}

const safe = <T,>(f: () => T): { ok: true; value: T } | { ok: false; error: string } => {
  try { return { ok: true, value: f() }; } catch (e) { return { ok: false, error: (e as Error).message }; }
};

// ─── 1. Bridge EV ↔ Equity ─────────────────────────────────────────────────
function ToolBridge() {
  const [s, set] = useState({ equity: 800, debt: 500, cash: 300, minorities: 50, preferred: 0, pension: 0, leases: 0, associates: 0 });
  const u = (k: keyof typeof s) => (v: number) => set({ ...s, [k]: v || 0 });
  const ev = fin.evFromEquity({ equityValue: s.equity, debt: s.debt, cash: s.cash, minorities: s.minorities, preferred: s.preferred, pension: s.pension, leases: s.leases, associates: s.associates });
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Num label="Equity value" value={s.equity} onChange={u("equity")} suffix="M€" />
        <Num label="Dette brute" value={s.debt} onChange={u("debt")} suffix="M€" />
        <Num label="Cash" value={s.cash} onChange={u("cash")} suffix="M€" />
        <Num label="Minoritaires" value={s.minorities} onChange={u("minorities")} suffix="M€" />
        <Num label="Preferred" value={s.preferred} onChange={u("preferred")} suffix="M€" />
        <Num label="Déficit pension" value={s.pension} onChange={u("pension")} suffix="M€" />
        <Num label="Dettes de loyers" value={s.leases} onChange={u("leases")} suffix="M€" hint="si convention IFRS 16 « dans l'EV »" />
        <Num label="Associates (−)" value={s.associates} onChange={u("associates")} suffix="M€" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Out label="Enterprise Value" value={`${fm(ev)} M€`} />
        <Out label="Dette nette" value={`${fm(s.debt - s.cash)} M€`} accent="gold" />
      </div>
      <Method>
        <p>EV = Equity + Dette − Cash + Minoritaires + Preferred + Déficit pension + Dettes de loyers − Associates.</p>
        <p>Logique : l'EV mesure la valeur des OPÉRATIONS pour tous les pourvoyeurs de capitaux. On ajoute tout ce qui est une créance sur ces opérations, on retire ce qui n'est pas opérationnel (cash, participations mises en équivalence dont le résultat n'est pas dans l'EBITDA).</p>
        <p>Cohérence périmètre : minoritaires ajoutés car l'EBITDA consolidé inclut 100% des filiales ; associates déduits car leur résultat est sous l'EBIT.</p>
      </Method>
    </div>
  );
}

// ─── 2. Actions diluées (TSM) ───────────────────────────────────────────────
function ToolTsm() {
  const [s, set] = useState({ basic: 100, price: 60, rsus: 2, o1c: 8, o1k: 40, o2c: 5, o2k: 75, convFace: 0, convPrice: 0 });
  const u = (k: keyof typeof s) => (v: number) => set({ ...s, [k]: v || 0 });
  const r = safe(() => fin.dilutedShares(s.basic, s.price, {
    options: [{ count: s.o1c, strike: s.o1k }, { count: s.o2c, strike: s.o2k }],
    rsus: s.rsus,
    convertibles: s.convFace > 0 && s.convPrice > 0 ? [{ faceValue: s.convFace, conversionPrice: s.convPrice }] : [],
  }));
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Num label="Actions de base" value={s.basic} onChange={u("basic")} suffix="M" />
        <Num label="Cours" value={s.price} onChange={u("price")} suffix="€" />
        <Num label="RSU" value={s.rsus} onChange={u("rsus")} suffix="M" />
        <div />
        <Num label="Options T1 — nombre" value={s.o1c} onChange={u("o1c")} suffix="M" />
        <Num label="Options T1 — strike" value={s.o1k} onChange={u("o1k")} suffix="€" />
        <Num label="Options T2 — nombre" value={s.o2c} onChange={u("o2c")} suffix="M" />
        <Num label="Options T2 — strike" value={s.o2k} onChange={u("o2k")} suffix="€" />
        <Num label="Convertible — nominal" value={s.convFace} onChange={u("convFace")} suffix="M€" />
        <Num label="Prix de conversion" value={s.convPrice} onChange={u("convPrice")} suffix="€" />
      </div>
      {r.ok ? (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Out label="Actions diluées" value={`${fm(r.value, 2)} M`} />
          <Out label="Dilution" value={fp(r.value / s.basic - 1, 2)} accent="gold" />
        </div>
      ) : <Err msg={r.error} />}
      <Method>
        <p>Treasury Stock Method : seules les options in-the-money (strike &lt; cours) s'exercent. Les produits d'exercice (nombre × strike) rachètent des actions au cours actuel.</p>
        <p>Dilution nette d'une tranche = nombre − (nombre × strike) / cours.</p>
        <p>RSU : dilution intégrale (pas de prix d'exercice). Convertibles : méthode if-converted simplifiée — si cours &gt; prix de conversion, ajout de nominal / prix de conversion actions.</p>
      </Method>
    </div>
  );
}

// ─── 3. WACC builder ────────────────────────────────────────────────────────
function ToolWacc() {
  const [s, set] = useState({ rf: 3, erp: 5.5, betaL: 1.3, peerDE: 60, targetDE: 40, kd: 5, tax: 25, e: 60, d: 40 });
  const u = (k: keyof typeof s) => (v: number) => set({ ...s, [k]: v || 0 });
  const r = safe(() => {
    const bu = fin.unleverBeta(s.betaL, s.peerDE / 100, s.tax / 100);
    const bl = fin.releverBeta(bu, s.targetDE / 100, s.tax / 100);
    const ke = fin.costOfEquityCapm(s.rf / 100, bl, s.erp / 100);
    const w = fin.wacc(s.e, s.d, ke, s.kd / 100, s.tax / 100);
    return { bu, bl, ke, w };
  });
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Num label="Taux sans risque" value={s.rf} onChange={u("rf")} suffix="%" step={0.1} />
        <Num label="Prime de risque (ERP)" value={s.erp} onChange={u("erp")} suffix="%" step={0.1} />
        <Num label="Beta levered (peers)" value={s.betaL} onChange={u("betaL")} step={0.05} />
        <Num label="D/E des peers" value={s.peerDE} onChange={u("peerDE")} suffix="%" />
        <Num label="D/E cible" value={s.targetDE} onChange={u("targetDE")} suffix="%" />
        <Num label="Coût de la dette" value={s.kd} onChange={u("kd")} suffix="%" step={0.1} />
        <Num label="Impôt" value={s.tax} onChange={u("tax")} suffix="%" />
        <Num label="Poids Equity (E)" value={s.e} onChange={u("e")} />
        <Num label="Poids Dette (D)" value={s.d} onChange={u("d")} />
      </div>
      {r.ok ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Out label="Beta unlevered" value={r.value.bu.toFixed(2)} accent="gold" />
          <Out label="Beta relevered" value={r.value.bl.toFixed(2)} accent="gold" />
          <Out label="Cost of equity" value={fp(r.value.ke)} />
          <Out label="WACC" value={fp(r.value.w)} accent="green" />
        </div>
      ) : <Err msg={r.error} />}
      <Method>
        <p>1. Délever le beta des comparables : βu = βl / [1 + (1 − t) × D/E].</p>
        <p>2. Relever au D/E cible : βl = βu × [1 + (1 − t) × D/E].</p>
        <p>3. CAPM : Ke = Rf + β × ERP.</p>
        <p>4. WACC = E/V × Ke + D/V × Kd × (1 − t) — pondérations en valeurs de MARCHÉ, jamais comptables.</p>
      </Method>
    </div>
  );
}

// ─── 4. DCF ─────────────────────────────────────────────────────────────────
function ToolDcf() {
  const [s, set] = useState({ f1: 100, f2: 110, f3: 120, f4: 128, f5: 135, waccPct: 9, g: 2, exitMult: 10, mode: "gordon" as "gordon" | "exit", midYear: false, netDebt: 300, shares: 50 });
  const u = (k: keyof typeof s) => (v: number) => set({ ...s, [k]: v || 0 });
  const fcfs = [s.f1, s.f2, s.f3, s.f4, s.f5];
  const r = safe(() => fin.dcf({
    fcfs, discountRate: s.waccPct / 100, midYear: s.midYear,
    terminal: s.mode === "gordon" ? { kind: "gordon", g: s.g / 100 } : { kind: "exit", metric: s.f5, multiple: s.exitMult },
  }));
  const sens = useMemo(() => {
    const waccs = [-1, -0.5, 0, 0.5, 1].map((d) => s.waccPct + d);
    const gs = [-0.5, -0.25, 0, 0.25, 0.5].map((d) => s.g + d);
    return { waccs, gs, rows: waccs.map((w) => gs.map((g) => {
      const c = safe(() => fin.dcf({ fcfs, discountRate: w / 100, midYear: s.midYear, terminal: s.mode === "gordon" ? { kind: "gordon", g: g / 100 } : { kind: "exit", metric: s.f5, multiple: s.exitMult } }));
      return c.ok ? c.value.enterpriseValue : null;
    })) };
  }, [s]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {fcfs.map((f, i) => <Num key={i} label={`FCF année ${i + 1}`} value={f} onChange={u(`f${i + 1}` as keyof typeof s)} suffix="M€" />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        <Num label="WACC" value={s.waccPct} onChange={u("waccPct")} suffix="%" step={0.25} />
        {s.mode === "gordon"
          ? <Num label="Croissance perpétuelle g" value={s.g} onChange={u("g")} suffix="%" step={0.25} />
          : <Num label="Multiple de sortie (× FCF final)" value={s.exitMult} onChange={u("exitMult")} step={0.5} />}
        <Num label="Dette nette" value={s.netDebt} onChange={u("netDebt")} suffix="M€" />
        <Num label="Actions diluées" value={s.shares} onChange={u("shares")} suffix="M" />
      </div>
      <div className="flex gap-2 mt-3 text-xs font-semibold">
        <button onClick={() => set({ ...s, mode: "gordon" })} className={`px-3 py-1.5 rounded-lg border ${s.mode === "gordon" ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted"}`}>TV Gordon</button>
        <button onClick={() => set({ ...s, mode: "exit" })} className={`px-3 py-1.5 rounded-lg border ${s.mode === "exit" ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted"}`}>TV Exit multiple</button>
        <button onClick={() => set({ ...s, midYear: !s.midYear })} className={`px-3 py-1.5 rounded-lg border ${s.midYear ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted"}`}>Mid-year {s.midYear ? "✓" : ""}</button>
      </div>
      {r.ok ? (() => {
        const eq = fin.equityFromEv(r.value.enterpriseValue, { debt: s.netDebt, cash: 0 });
        return (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
              <Out label="PV des FCF" value={`${fm(r.value.pvExplicit)} M€`} />
              <Out label="PV de la TV" value={`${fm(r.value.pvTerminal)} M€`} />
              <Out label="Enterprise Value" value={`${fm(r.value.enterpriseValue)} M€`} accent="green" />
              <Out label="TV en % de l'EV" value={fp(r.value.tvShareOfEv)} accent={r.value.tvShareOfEv > 0.8 ? "red" : "gold"} />
              <Out label="Prix / action" value={s.shares > 0 ? `${fm(eq / s.shares, 2)} €` : "—"} accent="green" />
            </div>
            {r.value.tvShareOfEv > 0.8 && <div className="text-xs text-gold mt-2">⚠️ TV &gt; 80% de l'EV : ta valeur repose presque entièrement sur la perpétuité — allonge l'horizon explicite ou challenge tes hypothèses.</div>}
            <div className="mt-5 overflow-x-auto">
              <div className="text-xs font-semibold text-muted mb-2">Sensibilité EV : WACC (lignes) × {s.mode === "gordon" ? "g" : "multiple"} (colonnes)</div>
              <table className="text-xs w-full min-w-[420px]">
                <thead><tr><th className="text-left text-muted p-1.5"></th>{sens.gs.map((g) => <th key={g} className="p-1.5 text-muted font-semibold">{s.mode === "gordon" ? fp(g / 100, 2) : fx(s.exitMult + (g - s.g), 2)}</th>)}</tr></thead>
                <tbody>
                  {sens.waccs.map((w, i) => (
                    <tr key={w}>
                      <td className="p-1.5 text-muted font-semibold">{fp(w / 100, 2)}</td>
                      {sens.rows[i].map((v, j) => {
                        const center = i === 2 && j === 2;
                        return <td key={j} className={`p-1.5 text-center rounded ${center ? "bg-accent/20 text-accent font-bold" : "text-ink"}`}>{v === null ? "—" : fm(v, 0)}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      })() : <Err msg={r.error} />}
      <Method>
        <p>EV = Σ FCF_t / (1 + WACC)^t + TV / (1 + WACC)^N.</p>
        <p>TV Gordon = FCF_N × (1 + g) / (WACC − g) — exige WACC &gt; g. TV exit = FCF_N × multiple.</p>
        <p>Mid-year : les flux arrivent en continu, donc actualisés à t − 0,5 → EV plus élevée.</p>
        <p>Prix/action = (EV − dette nette) / actions diluées.</p>
        <p>La sensibilité (WACC × g) est l'output attendu de tout DCF banking.</p>
      </Method>
    </div>
  );
}

// ─── 5. Accretion / Dilution ────────────────────────────────────────────────
function ToolMerger() {
  const [s, set] = useState({ aNi: 100, aSh: 100, aPx: 20, tNi: 50, offer: 600, cash: 30, debt: 30, stock: 40, kd: 5.5, cy: 2.5, tax: 25, syn: 0, da: 0 });
  const u = (k: keyof typeof s) => (v: number) => set({ ...s, [k]: v || 0 });
  const r = safe(() => fin.mergerModel({
    acquirerNetIncome: s.aNi, acquirerShares: s.aSh, acquirerSharePrice: s.aPx,
    targetNetIncome: s.tNi, offerEquityValue: s.offer,
    pctCash: s.cash / 100, pctDebt: s.debt / 100, pctStock: s.stock / 100,
    costOfDebt: s.kd / 100, cashYield: s.cy / 100, taxRate: s.tax / 100,
    pretaxSynergies: s.syn, incrementalDA: s.da,
  }));
  return (
    <div>
      <div className="text-xs font-semibold text-muted mb-2">ACQUÉREUR</div>
      <div className="grid grid-cols-3 gap-3">
        <Num label="Net income" value={s.aNi} onChange={u("aNi")} suffix="M€" />
        <Num label="Actions" value={s.aSh} onChange={u("aSh")} suffix="M" />
        <Num label="Cours" value={s.aPx} onChange={u("aPx")} suffix="€" />
      </div>
      <div className="text-xs font-semibold text-muted mb-2 mt-4">CIBLE & OFFRE</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Num label="Net income cible" value={s.tNi} onChange={u("tNi")} suffix="M€" />
        <Num label="Prix (equity value)" value={s.offer} onChange={u("offer")} suffix="M€" />
        <Num label="Synergies avant impôt" value={s.syn} onChange={u("syn")} suffix="M€/an" />
        <Num label="D&A incrémentale (PPA)" value={s.da} onChange={u("da")} suffix="M€/an" />
      </div>
      <div className="text-xs font-semibold text-muted mb-2 mt-4">FINANCEMENT (total 100%)</div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Num label="% cash" value={s.cash} onChange={u("cash")} suffix="%" />
        <Num label="% dette" value={s.debt} onChange={u("debt")} suffix="%" />
        <Num label="% actions" value={s.stock} onChange={u("stock")} suffix="%" />
        <Num label="Coût dette nouvelle" value={s.kd} onChange={u("kd")} suffix="%" step={0.25} />
        <Num label="Rendement du cash perdu" value={s.cy} onChange={u("cy")} suffix="%" step={0.25} />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3 max-w-xs">
        <Num label="Impôt" value={s.tax} onChange={u("tax")} suffix="%" />
      </div>
      {r.ok ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Out label="EPS standalone" value={`${r.value.standaloneEps.toFixed(2)} €`} />
          <Out label="EPS pro forma" value={`${r.value.proFormaEps.toFixed(2)} €`} />
          <Out label={r.value.accretion >= 0 ? "ACCRETION" : "DILUTION"} value={fp(r.value.accretion, 2)} accent={r.value.accretion >= 0 ? "green" : "red"} />
          <Out label="Synergies break-even" value={`${fm(r.value.breakEvenPretaxSynergies)} M€`} accent="gold" />
        </div>
      ) : <Err msg={r.error} />}
      <Method>
        <p>NI pro forma = NI acquéreur + NI cible + (synergies − D&A incrémentale) × (1 − t) − coûts de financement après impôt.</p>
        <p>Coûts de financement = cash utilisé × rendement perdu + dette nouvelle × Kd, le tout × (1 − t).</p>
        <p>Actions pro forma = actions acquéreur + (part payée en titres) / cours acquéreur.</p>
        <p>Raccourcis d'entretien : all-stock accretif si P/E acquéreur &gt; P/E payé ; cash/dette accretif si yield cible (NI/prix) &gt; coût après impôt du financement.</p>
        <p>Break-even = synergies avant impôt qui ramènent l'EPS pro forma exactement à l'EPS standalone.</p>
      </Method>
    </div>
  );
}

// ─── 6. LBO returns ─────────────────────────────────────────────────────────
function ToolLbo() {
  const [s, set] = useState({ ebitda: 100, entry: 9, lev: 5, ir: 7.5, g: 6, conv: 45, tax: 25, years: 5, exit: 9 });
  const u = (k: keyof typeof s) => (v: number) => set({ ...s, [k]: v || 0 });
  const r = safe(() => fin.lboReturns({
    entryEbitda: s.ebitda, entryMultiple: s.entry, leverage: s.lev,
    interestRate: s.ir / 100, ebitdaGrowth: s.g / 100, fcfConversion: s.conv / 100,
    taxRate: s.tax / 100, years: s.years, exitMultiple: s.exit,
  }));
  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        <Num label="EBITDA entrée" value={s.ebitda} onChange={u("ebitda")} suffix="M€" />
        <Num label="Multiple entrée" value={s.entry} onChange={u("entry")} step={0.5} suffix="×" />
        <Num label="Levier (× EBITDA)" value={s.lev} onChange={u("lev")} step={0.5} suffix="×" />
        <Num label="Taux d'intérêt" value={s.ir} onChange={u("ir")} suffix="%" step={0.25} />
        <Num label="Croissance EBITDA" value={s.g} onChange={u("g")} suffix="%/an" step={0.5} />
        <Num label="Conversion FCF" value={s.conv} onChange={u("conv")} suffix="%" hint="part de l'EBITDA → FCF avant intérêts/impôt" />
        <Num label="Impôt" value={s.tax} onChange={u("tax")} suffix="%" />
        <Num label="Horizon" value={s.years} onChange={u("years")} suffix="ans" min={1} />
        <Num label="Multiple sortie" value={s.exit} onChange={u("exit")} step={0.5} suffix="×" />
      </div>
      {r.ok ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <Out label="Equity investie" value={`${fm(r.value.entryEquity)} M€`} />
            <Out label="Equity à la sortie" value={`${fm(r.value.exitEquity)} M€`} />
            <Out label="MOIC" value={fx(r.value.moic)} accent={r.value.moic >= 2 ? "green" : "gold"} />
            <Out label="IRR" value={fp(r.value.irr)} accent={r.value.irr >= 0.2 ? "green" : "gold"} />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="text-xs w-full min-w-[480px]">
              <thead><tr className="text-muted">{["Année", "EBITDA", "Intérêts", "FCF net", "Remboursé", "Dette fin"].map((h) => <th key={h} className="p-1.5 text-right first:text-left font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {r.value.schedule.map((y) => (
                  <tr key={y.year} className="border-t border-border">
                    <td className="p-1.5">{y.year}</td>
                    <td className="p-1.5 text-right">{fm(y.ebitda, 0)}</td>
                    <td className="p-1.5 text-right text-red">{fm(y.interest, 0)}</td>
                    <td className="p-1.5 text-right">{fm(y.fcfAfterInterest, 0)}</td>
                    <td className="p-1.5 text-right text-green">{fm(y.repayment, 0)}</td>
                    <td className="p-1.5 text-right font-semibold">{fm(y.endingDebt, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : <Err msg={r.error} />}
      <Method>
        <p>Entrée : EV = EBITDA × multiple ; dette = levier × EBITDA ; equity = EV − dette.</p>
        <p>Chaque année : FCF = EBITDA × conversion − intérêts − impôt approx. ; cash sweep à 100% (tout le FCF rembourse la dette).</p>
        <p>Sortie : EV = EBITDA final × multiple de sortie ; equity sponsor = EV − dette restante.</p>
        <p>MOIC = equity sortie / equity investie ; IRR = MOIC^(1/années) − 1.</p>
        <p>Les 3 moteurs de création de valeur : paydown de dette, croissance de l'EBITDA, expansion de multiple. Mets le multiple de sortie = entrée pour isoler les deux premiers.</p>
      </Method>
    </div>
  );
}

// ─── 7. IRR ↔ MOIC ─────────────────────────────────────────────────────────
function ToolIrrMoic() {
  const [s, set] = useState({ moic: 2.5, years: 5, irr: 15 });
  const fromMoic = safe(() => fin.irrFromMoic(s.moic, s.years));
  const fromIrr = safe(() => fin.moicFromIrr(s.irr / 100, s.years));
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs font-semibold text-muted mb-2">MOIC → IRR</div>
          <div className="grid grid-cols-2 gap-3">
            <Num label="MOIC" value={s.moic} onChange={(v) => set({ ...s, moic: v || 0 })} step={0.1} suffix="×" />
            <Num label="Années" value={s.years} onChange={(v) => set({ ...s, years: v || 0 })} min={1} />
          </div>
          <div className="mt-3">{fromMoic.ok ? <Out label="IRR implicite" value={fp(fromMoic.value)} accent="green" /> : <Err msg={fromMoic.error} />}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted mb-2">IRR → MOIC</div>
          <div className="grid grid-cols-2 gap-3">
            <Num label="IRR" value={s.irr} onChange={(v) => set({ ...s, irr: v || 0 })} suffix="%" />
            <Num label="Années" value={s.years} onChange={(v) => set({ ...s, years: v || 0 })} min={1} />
          </div>
          <div className="mt-3">{fromIrr.ok ? <Out label="MOIC implicite" value={fx(fromIrr.value)} accent="green" /> : <Err msg={fromIrr.error} />}</div>
        </div>
      </div>
      <div className="mt-5 text-xs text-muted">
        Repères à connaître par cœur : 2× / 5 ans ≈ 15% · 2× / 3 ans ≈ 26% · 2,5× / 5 ans ≈ 20% · 3× / 5 ans ≈ 25%.
      </div>
      <Method>
        <p>IRR = MOIC^(1/années) − 1 et MOIC = (1 + IRR)^années — valable pour UN flux d'entrée et UN flux de sortie (pas de dividendes intermédiaires).</p>
      </Method>
    </div>
  );
}

// ─── 8. CAGR & prime ────────────────────────────────────────────────────────
function ToolQuick() {
  const [s, set] = useState({ begin: 100, end: 180, years: 4, offer: 62, unaffected: 48 });
  const u = (k: keyof typeof s) => (v: number) => set({ ...s, [k]: v || 0 });
  const rc = safe(() => fin.cagr(s.begin, s.end, s.years));
  const rp = safe(() => fin.premium(s.offer, s.unaffected));
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs font-semibold text-muted mb-2">CAGR</div>
          <div className="grid grid-cols-3 gap-3">
            <Num label="Valeur initiale" value={s.begin} onChange={u("begin")} />
            <Num label="Valeur finale" value={s.end} onChange={u("end")} />
            <Num label="Années" value={s.years} onChange={u("years")} min={1} />
          </div>
          <div className="mt-3">{rc.ok ? <Out label="CAGR" value={fp(rc.value)} accent="green" /> : <Err msg={rc.error} />}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted mb-2">PRIME D'ACQUISITION</div>
          <div className="grid grid-cols-2 gap-3">
            <Num label="Offre / action" value={s.offer} onChange={u("offer")} suffix="€" />
            <Num label="Cours non affecté" value={s.unaffected} onChange={u("unaffected")} suffix="€" />
          </div>
          <div className="mt-3">{rp.ok ? <Out label="Prime offerte" value={fp(rp.value)} accent="gold" /> : <Err msg={rp.error} />}</div>
        </div>
      </div>
      <Method>
        <p>CAGR = (fin / début)^(1/années) − 1 : le taux annuel lissé, celui qu'on cite dans un CIM.</p>
        <p>Prime = offre / cours NON AFFECTÉ − 1. Toujours mesurée sur le dernier cours avant rumeurs/annonce (« unaffected »), sinon la prime est sous-estimée. Repère : primes publiques typiques 20-40%.</p>
      </Method>
    </div>
  );
}

// ─── 9. Football field ──────────────────────────────────────────────────────
interface FieldRow { label: string; low: number; high: number }
function ToolField() {
  const [rows, setRows] = useState<FieldRow[]>([
    { label: "Comps boursiers", low: 38, high: 52 },
    { label: "Précédents", low: 48, high: 64 },
    { label: "DCF", low: 45, high: 68 },
    { label: "52 semaines", low: 32, high: 50 },
  ]);
  const [marker, setMarker] = useState(58);
  const lo = Math.min(...rows.map((r) => r.low), marker) * 0.9;
  const hi = Math.max(...rows.map((r) => r.high), marker) * 1.05;
  const X = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const upd = (i: number, k: keyof FieldRow, v: string) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, [k]: k === "label" ? v : parseFloat(v) || 0 } : r)));
  return (
    <div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px_70px] gap-2 items-center">
            <input value={r.label} onChange={(e) => upd(i, "label", e.target.value)} className="bg-surface2 border border-border rounded-lg px-3 py-1.5 text-xs font-semibold text-ink outline-none focus:border-accent/60" />
            <input type="number" value={r.low} onChange={(e) => upd(i, "low", e.target.value)} className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-xs text-ink outline-none" />
            <input type="number" value={r.high} onChange={(e) => upd(i, "high", e.target.value)} className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-xs text-ink outline-none" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => setRows([...rows, { label: "Méthode", low: 40, high: 60 }])} className="text-xs font-semibold text-accent">+ Ajouter une méthode</button>
        {rows.length > 2 && <button onClick={() => setRows(rows.slice(0, -1))} className="text-xs font-semibold text-red">− Retirer</button>}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3 max-w-xs">
        <Num label="Marqueur (offre / cours)" value={marker} onChange={setMarker} suffix="€" />
      </div>
      <svg viewBox="0 0 500 40" className="w-full mt-5" style={{ height: 30 + rows.length * 38 }} preserveAspectRatio="none">
        {rows.map((r, i) => {
          const y = 14 + i * 38;
          return (
            <g key={i}>
              <text x="0" y={y + 4} fill="var(--color-muted)" fontSize="11" fontWeight="600">{r.label}</text>
              <rect x={150 + X(r.low) * 3.4} y={y - 7} width={Math.max(2, (X(r.high) - X(r.low)) * 3.4)} height="14" rx="4" fill="var(--color-accent)" opacity="0.75" />
              <text x={150 + X(r.low) * 3.4 - 4} y={y + 4} fill="var(--color-ink)" fontSize="10" textAnchor="end">{fm(r.low, 0)}</text>
              <text x={150 + X(r.high) * 3.4 + 4} y={y + 4} fill="var(--color-ink)" fontSize="10">{fm(r.high, 0)}</text>
            </g>
          );
        })}
        <line x1={150 + X(marker) * 3.4} y1="0" x2={150 + X(marker) * 3.4} y2={rows.length * 38 + 10} stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="4 3" />
        <text x={150 + X(marker) * 3.4 + 5} y="10" fill="var(--color-gold)" fontSize="11" fontWeight="700">{fm(marker, 0)} €</text>
      </svg>
      <Method>
        <p>Le football field résume les fourchettes de chaque méthode (comps, précédents, DCF, 52 semaines, LBO…) sur un seul graphique par action.</p>
        <p>Lecture banker : la zone de recoupement des méthodes intrinsèques et de marché fonde la recommandation ; le marqueur (offre) se juge par rapport à ces fourchettes.</p>
      </Method>
    </div>
  );
}

// ─── Registre des outils ────────────────────────────────────────────────────
const TOOLS: { id: string; emoji: string; title: string; desc: string; el: () => React.ReactNode }[] = [
  { id: "bridge", emoji: "🌉", title: "Bridge EV ↔ Equity", desc: "Le pont complet, minoritaires et associates inclus", el: () => <ToolBridge /> },
  { id: "tsm", emoji: "🧾", title: "Actions diluées (TSM)", desc: "Options, RSU, convertibles — méthode du rachat", el: () => <ToolTsm /> },
  { id: "wacc", emoji: "⚖️", title: "WACC builder", desc: "Beta délevé/relevé, CAPM, coût du capital", el: () => <ToolWacc /> },
  { id: "dcf", emoji: "📉", title: "DCF", desc: "5 ans de FCF, TV Gordon ou exit, sensibilité WACC × g", el: () => <ToolDcf /> },
  { id: "merger", emoji: "🤝", title: "Accretion / Dilution", desc: "Merger model cash/dette/titres + break-even synergies", el: () => <ToolMerger /> },
  { id: "lbo", emoji: "🏗️", title: "LBO returns", desc: "Entrée, paydown, sortie — MOIC, IRR, échéancier", el: () => <ToolLbo /> },
  { id: "irrmoic", emoji: "🔁", title: "IRR ↔ MOIC", desc: "La conversion à connaître par cœur", el: () => <ToolIrrMoic /> },
  { id: "quick", emoji: "⚡", title: "CAGR & prime", desc: "Les deux calculs express du quotidien", el: () => <ToolQuick /> },
  { id: "field", emoji: "🏟️", title: "Football field", desc: "Fourchettes de valorisation par méthode", el: () => <ToolField /> },
];

export default function Tools() {
  const { toolId } = useParams();
  const nav = useNavigate();
  const active = TOOLS.find((t) => t.id === toolId) ?? TOOLS[0];
  return (
    <div>
      <PageTitle emoji="🧮" title="Outils de l'analyste" sub="Des calculateurs réels, branchés sur des formules testées unitairement. Chaque outil documente sa méthodologie — comprends le calcul, ne te contente pas du résultat." />
      <div className="flex flex-wrap gap-2 mb-5">
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => nav(`/tools/${t.id}`)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${active.id === t.id ? "bg-accent/15 text-accent border-accent/40" : "bg-surface text-muted border-border hover:text-ink"}`}>
            {t.emoji} {t.title}
          </button>
        ))}
      </div>
      <Card>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-bold text-lg">{active.emoji} {active.title}</h2>
          <Tag color="muted">{active.desc}</Tag>
        </div>
        <div className="mt-4">{active.el()}</div>
      </Card>
    </div>
  );
}

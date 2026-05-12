import { TrendingUp, Activity, Flame, Calendar } from "lucide-react";

export function PullupsCard() {
  // Volume load (kg total levantados en dominadas lastradas) por semana
  const weeks = [
    { w: "S1", load: 180 },
    { w: "S2", load: 240 },
    { w: "S3", load: 310 },
    { w: "S4", load: 280 }, // descarga
    { w: "S5", load: 360 },
    { w: "S6", load: 430 },
    { w: "S7", load: 510 },
  ];
  const max = 560;
  const current = weeks[weeks.length - 1].load;
  return (
    <div className="glass rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Volumen dominadas</p>
          <p className="text-2xl font-display font-bold">{current}<span className="text-sm text-muted-foreground"> kg·rep</span></p>
        </div>
        <div className="flex items-center gap-1 text-primary text-xs font-medium">
          <TrendingUp className="h-3.5 w-3.5" /> +183%
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {weeks.map((v, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/40 to-primary transition-all" style={{ height: `${(v.load / max) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {weeks.map((w) => <span key={w.w}>{w.w}</span>)}
      </div>
    </div>
  );
}

export function PaceCard() {
  // Tiempo 1000m en segundos: 3:45 → 3:15
  const points = [
    { w: "S1", s: 225 },
    { w: "S2", s: 220 },
    { w: "S3", s: 215 },
    { w: "S4", s: 210 },
    { w: "S5", s: 205 },
    { w: "S6", s: 200 },
    { w: "S7", s: 195 },
  ];
  const min = 190, max = 230;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const W = 200, H = 60;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * W;
    const y = H - ((max - p.s) / (max - min)) * (H - 6) - 3;
    return [x, y] as const;
  });
  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  return (
    <div className="glass rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Tiempo 1000m</p>
          <p className="text-2xl font-display font-bold">{fmt(points[points.length - 1].s)}</p>
        </div>
        <div className="flex items-center gap-1 text-primary text-xs font-medium">
          <Activity className="h-3.5 w-3.5" /> -30s
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
        <defs>
          <linearGradient id="paceGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.22 250)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 250)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#paceGrad)" />
        <path d={linePath} stroke="oklch(0.72 0.22 250)" strokeWidth="2" fill="none" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="oklch(0.72 0.22 250)" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>{fmt(points[0].s)}</span><span>Hoy {fmt(points[points.length - 1].s)}</span>
      </div>
    </div>
  );
}

export function FatigueCard() {
  const score = 28;
  return (
    <div className="glass rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Fatiga</p>
        <Flame className="h-5 w-5 text-primary" />
      </div>
      <div className="relative grid place-items-center">
        <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
          <circle cx="50" cy="50" r="42" stroke="oklch(1 0 0 / 0.08)" strokeWidth="8" fill="none" />
          <circle cx="50" cy="50" r="42" stroke="oklch(0.72 0.22 250)" strokeWidth="8" fill="none"
            strokeDasharray={`${(score / 100) * 264} 264`} strokeLinecap="round" />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-display font-bold">{score}%</p>
          <p className="text-[10px] text-muted-foreground uppercase">Óptimo</p>
        </div>
      </div>
    </div>
  );
}

// Periodización ondulante: alterna intensidad (alta) / volumen (medio) / técnica (baja)
const WEEK_PLAN = [
  {
    d: "L", label: "Día 1",
    title: "Fuerza máx + VAM",
    short: "Fuerza",
    intensity: 95,
    tag: "Alta",
    detail: "Dominadas lastradas %RM · 6×200m al 110-120% VAM",
  },
  {
    d: "M", label: "Día 2",
    title: "Técnica + Aeróbico",
    short: "Técnica",
    intensity: 55,
    tag: "Baja",
    detail: "Circuito agilidad · 25-35′ continuo 70-80% VAM",
  },
  {
    d: "X", label: "Descanso",
    title: "Movilidad activa",
    short: "Off",
    intensity: 15,
    tag: "Recup",
    detail: "Movilidad + foam roller",
  },
  {
    d: "J", label: "Día 3",
    title: "Volumen + Lactato",
    short: "Volumen",
    intensity: 80,
    tag: "Media",
    detail: "Dominadas RIR 1-2 (volumen) · 4×600m al 95-100% VAM",
  },
  {
    d: "V", label: "Día 1",
    title: "Fuerza máx + VAM",
    short: "Fuerza",
    intensity: 95,
    tag: "Alta",
    detail: "Dominadas lastradas %RM · 5×300m al 110% VAM",
  },
  {
    d: "S", label: "Día 2",
    title: "Técnica + Aeróbico",
    short: "Técnica",
    intensity: 55,
    tag: "Baja",
    detail: "Circuito agilidad largo · tirada 40′",
  },
  {
    d: "D", label: "Off",
    title: "Descanso total",
    short: "Off",
    intensity: 0,
    tag: "Off",
    detail: "Recuperación pasiva",
  },
];

export { WEEK_PLAN };

export function WeeklyPlanCard({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Periodización ondulante</p>
          <p className="text-lg font-display font-bold">Semana 3 · Acumulación</p>
        </div>
        <Calendar className="h-5 w-5 text-primary" />
      </div>

      {/* Onda de intensidad */}
      <div className="flex items-end gap-1.5 h-16 mb-3">
        {WEEK_PLAN.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-sm transition-all ${i === activeIndex ? "bg-gradient-to-t from-primary to-primary/80 shadow-[0_0_12px_oklch(0.72_0.22_250/0.6)]" : "bg-gradient-to-t from-primary/30 to-primary/60"}`}
              style={{ height: `${Math.max(day.intensity, 6)}%` }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_PLAN.map((day, i) => (
          <div key={i} className={`rounded-lg p-2 text-center border transition-colors ${i === activeIndex ? "bg-primary/15 border-primary/50" : "border-border bg-card/40"}`}>
            <p className="text-[10px] text-muted-foreground">{day.d}</p>
            <p className="text-[10px] mt-1 font-medium leading-tight">{day.short}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[10px] text-muted-foreground flex items-center justify-between">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Alta</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/60" /> Media</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/30" /> Baja</span>
      </div>
    </div>
  );
}

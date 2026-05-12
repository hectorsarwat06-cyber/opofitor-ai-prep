import { TrendingUp, Activity, Flame, Calendar } from "lucide-react";

export function PullupsCard() {
  const bars = [4, 6, 7, 9, 10, 12, 14];
  const max = 16;
  return (
    <div className="glass rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Dominadas</p>
          <p className="text-2xl font-display font-bold">14 reps</p>
        </div>
        <div className="flex items-center gap-1 text-primary text-xs font-medium">
          <TrendingUp className="h-3.5 w-3.5" /> +250%
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((v, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/40 to-primary" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>S1</span><span>S7</span>
      </div>
    </div>
  );
}

export function PaceCard() {
  return (
    <div className="glass rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Ritmo 1000m</p>
          <p className="text-2xl font-display font-bold">3:42<span className="text-sm text-muted-foreground">/km</span></p>
        </div>
        <Activity className="h-5 w-5 text-primary" />
      </div>
      <svg viewBox="0 0 200 60" className="w-full h-16">
        <defs>
          <linearGradient id="paceGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.22 250)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 250)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,40 C30,38 40,20 60,22 C90,25 110,10 140,8 C170,6 185,14 200,12 L200,60 L0,60 Z" fill="url(#paceGrad)" />
        <path d="M0,40 C30,38 40,20 60,22 C90,25 110,10 140,8 C170,6 185,14 200,12" stroke="oklch(0.72 0.22 250)" strokeWidth="2" fill="none" />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>4 sem</span><span>Hoy</span></div>
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

export function WeeklyPlanCard() {
  const days = [
    { d: "L", t: "Fuerza" },
    { d: "M", t: "Carrera" },
    { d: "X", t: "Dominadas" },
    { d: "J", t: "Descanso" },
    { d: "V", t: "Test" },
    { d: "S", t: "Tirada" },
    { d: "D", t: "Movilidad" },
  ];
  return (
    <div className="glass rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Plan semanal</p>
          <p className="text-lg font-display font-bold">Semana 6 · Bloque carga</p>
        </div>
        <Calendar className="h-5 w-5 text-primary" />
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => (
          <div key={i} className={`rounded-lg p-2 text-center border ${i === 1 ? "bg-primary/15 border-primary/40" : "border-border bg-card/40"}`}>
            <p className="text-[10px] text-muted-foreground">{day.d}</p>
            <p className="text-[10px] mt-1 font-medium">{day.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
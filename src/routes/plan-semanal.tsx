import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { WEEK_PLAN } from "@/components/landing/Mockups";
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Battery,
  History,
  Flame,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

export const Route = createFileRoute("/plan-semanal")({
  head: () => ({
    meta: [
      { title: "Plan semanal — opoFITor" },
      {
        name: "description",
        content:
          "Calendario semanal de entrenamientos, historial y estado de recuperación basado en tu RPE.",
      },
    ],
  }),
  component: PlanSemanal,
});

type HistoryEntry = {
  date: string;
  rpe: number;
  title: string;
  achievement: string;
};

const FALLBACK_HISTORY: HistoryEntry[] = [
  { date: daysAgo(2), rpe: 8, title: "Día 1 · Fuerza + VAM", achievement: "Dominadas 4×4 con +13 kg completadas" },
  { date: daysAgo(4), rpe: 6, title: "Día 2 · Técnica + Aeróbico", achievement: "Media de 200m en 39 s" },
  { date: daysAgo(5), rpe: 7, title: "Día 3 · Volumen + Lactato", achievement: "4×600m al 98% VAM" },
  { date: daysAgo(7), rpe: 9, title: "Día 1 · Fuerza + VAM", achievement: "PR dominada lastrada +15 kg" },
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function PlanSemanal() {
  useRequireAuth();
  const navigate = useNavigate();
  const todayIdx = Math.min(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
    WEEK_PLAN.length - 1,
  );

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("opofitor_history");
      const parsed = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
      setHistory(parsed.length ? parsed : FALLBACK_HISTORY);
    } catch {
      setHistory(FALLBACK_HISTORY);
    }
  }, []);

  // Recovery: lower battery when recent RPE is high
  const recentRpe = history.slice(0, 5).map((h) => h.rpe);
  const avgRpe = recentRpe.length
    ? recentRpe.reduce((a, b) => a + b, 0) / recentRpe.length
    : 5;
  const recovery = Math.round(Math.max(15, Math.min(100, 110 - avgRpe * 9)));

  // Days completed = those with index < today (visualization only)
  const completedDays = new Set<number>();
  history.forEach((h) => {
    const d = new Date(h.date);
    const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
    if (idx < todayIdx) completedDays.add(idx);
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <header className="px-4 py-5 max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="px-4 pb-24 max-w-5xl mx-auto animate-fade-up space-y-8">
        {/* Title */}
        <section>
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Mesociclo 3 · Semana 6</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Tu <span className="text-gradient">plan semanal</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Periodización ondulante. Pulsa el día de hoy para ir directo a la sesión.
          </p>
        </section>

        {/* Calendar */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {WEEK_PLAN.map((day, i) => {
            const isToday = i === todayIdx;
            const isCompleted = completedDays.has(i);
            const isOff = day.tag === "Off";
            const card = (
              <div
                className={[
                  "relative h-full glass rounded-2xl p-4 transition-all duration-300",
                  "border",
                  isToday
                    ? "border-primary/60 shadow-[0_0_0_1px_oklch(0.72_0.22_250/0.5),0_0_40px_-10px_oklch(0.72_0.22_250/0.6)]"
                    : "border-border hover:border-primary/30 hover:-translate-y-0.5",
                  isCompleted && !isToday ? "ring-2 ring-emerald-500/40" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {dayName(i)}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isToday ? (
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  ) : null}
                </div>
                <p className="text-xs font-semibold text-primary mt-3">
                  {day.label}
                </p>
                <p className="text-sm font-display font-bold mt-1 leading-tight">
                  {day.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">
                  {day.detail}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={[
                      "text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border",
                      isOff
                        ? "bg-muted/30 text-muted-foreground border-border"
                        : "bg-primary/15 text-primary border-primary/30",
                    ].join(" ")}
                  >
                    {day.tag}
                  </span>
                  {isToday && !isOff && (
                    <ChevronRight className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            );
            if (isToday && !isOff) {
              return (
                <Link
                  key={i}
                  to="/workout-session"
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                >
                  {card}
                </Link>
              );
            }
            return <div key={i}>{card}</div>;
          })}
        </section>

        {/* Recovery + CTA */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Battery className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-widest">
                Estado de recuperación
              </span>
            </div>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-5xl font-display font-bold text-gradient leading-none">
                {recovery}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                / 100 · {recoveryLabel(recovery)}
              </p>
            </div>

            {/* Battery bar */}
            <div className="mt-5 flex items-center gap-2">
              <div className="relative flex-1 h-8 rounded-md border border-border bg-card/40 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-700"
                  style={{
                    width: `${recovery}%`,
                    background:
                      recovery > 70
                        ? "linear-gradient(90deg, oklch(0.72 0.18 150), oklch(0.78 0.18 160))"
                        : recovery > 40
                          ? "linear-gradient(90deg, oklch(0.78 0.18 80), oklch(0.82 0.16 70))"
                          : "linear-gradient(90deg, oklch(0.65 0.22 25), oklch(0.7 0.22 15))",
                  }}
                />
                <div className="absolute inset-0 flex">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-r border-background/40 last:border-r-0"
                    />
                  ))}
                </div>
              </div>
              <div className="h-4 w-1.5 rounded-r-sm bg-border" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              RPE medio últimas {recentRpe.length} sesiones:{" "}
              <span className="font-medium text-foreground">
                {avgRpe.toFixed(1)} / 10
              </span>
            </p>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <Flame className="h-5 w-5 text-primary" />
              <p className="text-sm font-display font-bold mt-3">
                Sesión de hoy lista
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {WEEK_PLAN[todayIdx].title}
              </p>
            </div>
            <Button asChild variant="hero" className="mt-4 w-full">
              <Link to="/workout-session">
                Empezar entrenamiento <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* History */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg glass grid place-items-center">
              <History className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">
                Historial de entrenamientos
              </h2>
              <p className="text-xs text-muted-foreground">
                Tus últimas sesiones registradas
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl divide-y divide-border overflow-hidden">
            {history.length === 0 && (
              <p className="p-6 text-sm text-muted-foreground text-center">
                Aún no has registrado sesiones.
              </p>
            )}
            {history.map((h, i) => {
              const d = new Date(h.date);
              const dateStr = d.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/15 grid place-items-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground capitalize">
                      {dateStr}
                    </p>
                    <p className="text-sm font-display font-bold mt-0.5 truncate">
                      {h.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {h.achievement}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      RPE
                    </p>
                    <p className="text-lg font-display font-bold text-gradient">
                      {h.rpe}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function dayName(i: number) {
  return ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][i];
}

function recoveryLabel(v: number) {
  if (v >= 80) return "Óptimo";
  if (v >= 60) return "Bueno";
  if (v >= 40) return "Moderado";
  return "Fatigado";
}
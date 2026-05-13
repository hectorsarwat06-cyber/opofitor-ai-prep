import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/landing/TopNav";
import {
  PullupsCard,
  PaceCard,
  FatigueCard,
  WeeklyPlanCard,
  WEEK_PLAN,
} from "@/components/landing/Mockups";
import {
  Shield,
  Sparkles,
  ArrowLeft,
  Play,
  RefreshCw,
  CalendarPlus,
  Dumbbell,
  Timer,
  Heart,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Flag,
  Rocket,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — opoFITor" },
      {
        name: "description",
        content: "Tu plan de entrenamiento personalizado para Policía Nacional.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const todayIdx = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, WEEK_PLAN.length - 1);
  const today = WEEK_PLAN[todayIdx];
  const macro = useMacrocycle();
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <header className="px-4 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>
        <TopNav />
      </header>

      <main className="px-4 pt-8 pb-24 max-w-6xl mx-auto animate-fade-up space-y-10">
        {/* Macrocycle status hero */}
        <section className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-40" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium uppercase tracking-widest">Macrociclo activo</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                Estado: <span className="text-gradient">Semana {macro.week}, Día {macro.day}</span>
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">Fase de <span className="text-foreground font-semibold">{macro.phase}</span></p>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <Rocket className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground/90">
                  Comenzamos tu preparación. El plan de esta semana está adaptado a tus marcas iniciales.
                </p>
              </div>
              <div className="mt-6">
                <MacroTimeline week={macro.week} totalWeeks={macro.totalWeeks} examDate={macro.examDate} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild variant="hero" size="lg">
                <Link to="/workout-session"><Play className="h-4 w-4" /> Start Workout</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/plan-semanal"><CalendarPlus className="h-4 w-4" /> Plan semanal</Link>
              </Button>
              <Button variant="ghost" size="lg"><RefreshCw className="h-4 w-4" /> Update Progress</Button>
            </div>
          </div>
        </section>

        {/* Welcome */}
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Plan activo · Semana {macro.week}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              Buenas tardes, <span className="text-gradient">opositor.</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Tu rendimiento sube un 18% esta semana. Hoy toca empujar el ritmo.
            </p>
          </div>
        </section>

        {/* Today's workout */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-40" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{today.label} · Entreno de hoy</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-2">{today.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{today.detail}</p>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <Stat icon={Timer} label="Duración" value="55 min" />
                <Stat icon={Zap} label="Carga" value={today.tag} />
                <Stat icon={Heart} label="FC objetivo" value="170-180 bpm" />
              </div>
              <div className="mt-6 flex gap-2">
                <Button asChild variant="hero">
                  <Link to="/workout-session"><Play className="h-4 w-4" /> Empezar ahora</Link>
                </Button>
                <Button variant="outline">Ver protocolo</Button>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Readiness</p>
              <p className="mt-2 text-5xl font-display font-bold text-gradient">86</p>
              <p className="text-xs text-muted-foreground mt-1">Listo para alta intensidad</p>
            </div>
            <div className="mt-6 space-y-3">
              <Bar label="Sueño" value={92} />
              <Bar label="HRV" value={74} />
              <Bar label="Carga" value={61} />
            </div>
          </div>
        </section>

        {/* Performance widgets */}
        <section>
          <SectionTitle icon={TrendingUp} title="Rendimiento" subtitle="Tus métricas clave de la semana" />
          <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PullupsCard />
            <PaceCard />
            <FatigueCard />
          </div>
        </section>

        {/* Weekly calendar */}
        <section>
          <SectionTitle icon={CalendarPlus} title="Calendario semanal" subtitle="Tu mesociclo de carga" />
          <div className="mt-5">
            <WeeklyPlanCard activeIndex={todayIdx} />
          </div>
        </section>

        {/* Progress statistics */}
        <section>
          <SectionTitle icon={Trophy} title="Estadísticas de progreso" subtitle="Desde tu primer test" />
          <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProgressStat icon={Dumbbell} label="Dominadas máx." value="14" delta="+10" />
            <ProgressStat icon={Timer} label="Mejor 1000m" value="3:42" delta="-0:38" />
            <ProgressStat icon={Target} label="Sesiones" value="38" delta="+38" />
            <ProgressStat icon={Trophy} label="Score test" value="8.6" delta="+2.1" />
          </div>

          <div className="mt-6 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Evolución global</p>
                <p className="text-lg font-display font-bold">Score físico</p>
              </div>
              <span className="text-sm text-primary font-medium">+42%</span>
            </div>
            <svg viewBox="0 0 600 160" className="w-full h-40">
              <defs>
                <linearGradient id="evoGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.22 250)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="oklch(0.72 0.22 250)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,130 C60,125 100,110 160,100 C220,90 260,80 320,65 C380,50 420,45 480,30 C540,18 580,20 600,15 L600,160 L0,160 Z" fill="url(#evoGrad)" />
              <path d="M0,130 C60,125 100,110 160,100 C220,90 260,80 320,65 C380,50 420,45 480,30 C540,18 580,20 600,15" stroke="oklch(0.72 0.22 250)" strokeWidth="2.5" fill="none" />
            </svg>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>S1</span><span>S2</span><span>S3</span><span>S4</span><span>S5</span><span>S6</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <Icon className="h-4 w-4 text-primary mb-2" />
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-lg font-display font-bold mt-0.5">{value}</p>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg glass grid place-items-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-display font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function ProgressStat({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta: string }) {
  return (
    <div className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-[10px] font-medium text-primary">{delta}</span>
      </div>
      <p className="text-2xl font-display font-bold mt-3">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
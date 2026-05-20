import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useTrainingPlan } from "@/hooks/use-training-plan";
import {
  Shield, ArrowLeft, CheckCircle2, Calendar, Battery, History, Flame,
  ChevronRight, LayoutDashboard, Loader2, Activity, Dumbbell, Wind, Snowflake,
} from "lucide-react";
import { type TipoSesion, type SesionPrescrita } from "@/lib/training-engine";

export const Route = createFileRoute("/plan-semanal")({
  head: () => ({
    meta: [
      { title: "Plan semanal — opoFITor" },
      { name: "description", content: "Calendario semanal real generado por el motor de periodización." },
    ],
  }),
  component: PlanSemanal,
});

function iconoSesion(tipo: TipoSesion) {
  if (tipo === "Fuerza") return Dumbbell;
  if (tipo === "Resistencia") return Wind;
  if (tipo === "Agilidad") return Activity;
  if (tipo === "Movilidad") return Snowflake;
  return Battery;
}

function PlanSemanal() {
  useRequireAuth();
  const { plan, loading, evaluacion } = useTrainingPlan();
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan || !evaluacion) {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center">
        <div className="glass rounded-2xl p-6 max-w-md">
          <h2 className="font-display font-bold text-xl">Necesitamos tus marcas iniciales</h2>
          <p className="text-sm text-muted-foreground mt-2">Realiza el test inicial para generar tu plan.</p>
          <Button asChild variant="hero" className="mt-4"><Link to="/test-inicial">Ir al test</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />

      <header className="px-4 py-5 max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg">opo<span className="text-primary">FIT</span>or</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="h-4 w-4" /> Inicio</Link></Button>
        </div>
      </header>

      <main className="px-4 pb-24 max-w-5xl mx-auto animate-fade-up space-y-8">
        <section>
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Semana {plan.semana} · VAM {plan.vam.toFixed(1)} km/h</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Tu <span className="text-gradient">plan semanal</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">{plan.ajuste.mensaje}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {plan.sesiones.map((s, i) => (
            <SesionCard key={s.dia} sesion={s} esHoy={i === todayIdx} />
          ))}
        </section>

        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <History className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest">Sobrecarga progresiva dinámica</span>
          </div>
          <p className="mt-3 text-sm">{plan.ajuste.mensaje}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Factor volumen: <span className="text-foreground font-semibold">×{plan.ajuste.factorVolumen.toFixed(2)}</span> · RIR Δ <span className="text-foreground font-semibold">{plan.ajuste.deltaRIR >= 0 ? "+" : ""}{plan.ajuste.deltaRIR}</span>
          </p>
        </section>
      </main>
    </div>
  );
}

function SesionCard({ sesion, esHoy }: { sesion: SesionPrescrita; esHoy: boolean }) {
  const Icon = iconoSesion(sesion.tipo);
  const isOff = sesion.tipo === "Descanso";
  return (
    <div
      className={[
        "glass rounded-2xl p-5 border transition-all",
        esHoy
          ? "border-primary/60 shadow-[0_0_0_1px_oklch(0.72_0.22_250/0.5),0_0_40px_-10px_oklch(0.72_0.22_250/0.6)]"
          : "border-border",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{sesion.diaNombre}</span>
        {esHoy ? <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> : null}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg glass grid place-items-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-primary">{sesion.tag}</p>
          <h3 className="text-base font-display font-bold leading-tight">{sesion.titulo}</h3>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{sesion.resumen}</p>

      {!isOff && (
        <ul className="mt-3 space-y-2">
          {sesion.bloques.map((b, i) => (
            <li key={i} className="rounded-lg border border-border bg-card/40 p-3">
              <p className="text-sm font-semibold leading-tight">{b.ejercicio}</p>
              <p className="text-xs text-primary mt-1 font-mono">{b.detalle}</p>
              {b.observacion && <p className="text-[11px] text-muted-foreground mt-1">{b.observacion}</p>}
            </li>
          ))}
        </ul>
      )}

      {esHoy && !isOff && (
        <Button asChild variant="hero" className="mt-4 w-full">
          <Link to="/workout-session">Empezar entrenamiento <ChevronRight className="h-4 w-4" /></Link>
        </Button>
      )}
    </div>
  );
}

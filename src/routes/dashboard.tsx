import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  PullupsCard,
  PaceCard,
  FatigueCard,
  WeeklyPlanCard,
} from "@/components/landing/Mockups";
import { Shield, Sparkles, ArrowLeft } from "lucide-react";

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
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </Button>
      </header>

      <main className="px-4 pt-8 pb-24 max-w-6xl mx-auto animate-fade-up">
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Tu plan está listo</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
          Buenas tardes,{" "}
          <span className="text-gradient">opositor.</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Este es tu primer mesociclo. La IA lo ajustará cada semana según tus
          marcas reales.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PullupsCard />
          <PaceCard />
          <FatigueCard />
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Hoy
            </p>
            <p className="text-lg font-display font-bold mt-1">Carrera 5x1000</p>
          </div>
        </div>

        <div className="mt-6">
          <WeeklyPlanCard />
        </div>
      </main>
    </div>
  );
}
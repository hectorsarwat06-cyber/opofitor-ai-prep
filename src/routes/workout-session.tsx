import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  ArrowLeft,
  Flame,
  Dumbbell,
  Timer,
  Zap,
  CheckCircle2,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/workout-session")({
  head: () => ({
    meta: [
      { title: "Sesión de entrenamiento — opoFITor" },
      { name: "description", content: "Sesión diaria de entrenamiento personalizada para Policía Nacional." },
    ],
  }),
  component: WorkoutSession,
});

function WorkoutSession() {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const [sessionRPE, setSessionRPE] = useState<number[]>([7]);
  const [finished, setFinished] = useState(false);

  const pullupSets = [
    { set: 1, target: "5 reps", rir: "RIR 3", load: "+10 kg" },
    { set: 2, target: "5 reps", rir: "RIR 2", load: "+12 kg" },
    { set: 3, target: "4 reps", rir: "RIR 1", load: "+15 kg" },
    { set: 4, target: "Excéntrico 5s", rir: "—", load: "BW" },
  ];

  const runIntervals = [
    { i: 1, target: "1:15" },
    { i: 2, target: "1:14" },
    { i: 3, target: "1:13" },
    { i: 4, target: "1:13" },
    { i: 5, target: "1:12" },
    { i: 6, target: "1:10" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />

      <header className="px-4 py-5 max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        </Button>
      </header>

      <main className="px-4 pb-32 max-w-3xl mx-auto animate-fade-up space-y-6">
        {/* Header card */}
        <section className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-40" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-muted-foreground capitalize">{today}</p>
            <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">Sesión de hoy</h1>
            <p className="text-sm text-primary mt-1">Mesociclo de Acumulación · Semana 3 / 5</p>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Readiness</p>
                <p className="text-4xl font-display font-bold text-gradient">86<span className="text-base text-muted-foreground">/100</span></p>
              </div>
              <div className="flex-1 max-w-[180px]">
                <Progress value={86} className="h-2" />
                <p className="text-[10px] text-muted-foreground mt-1.5 text-right">Listo para alta intensidad</p>
              </div>
            </div>
          </div>
        </section>

        {/* Warm-up Accordion */}
        <Accordion type="single" collapsible defaultValue="warmup" className="space-y-3">
          <Block id="warmup" icon={Flame} title="Calentamiento" subtitle="12 min · activación general">
            <ul className="space-y-2 text-sm">
              <Bullet>Liberación miofascial (Foam Roller) — 4 min</Bullet>
              <Bullet>Movilidad articular dinámica — 4 min</Bullet>
              <Bullet>Activación de core y glúteo — 4 min</Bullet>
            </ul>
          </Block>

          {/* Block 1 — Pull-ups */}
          <Block id="pullups" icon={Dumbbell} title="Bloque 1 · Fuerza y Dominadas" subtitle="Dominadas lastradas + excéntrico">
            <div className="space-y-3">
              {pullupSets.map((s) => (
                <SetRow key={s.set} index={s.set} columns={[
                  { label: "Objetivo", value: s.target },
                  { label: "Intensidad", value: s.rir },
                  { label: "Carga", value: s.load },
                ]} />
              ))}
              <p className="text-[11px] text-muted-foreground pt-1">Descanso entre series: <span className="text-foreground font-medium">180 s</span></p>
            </div>
          </Block>

          {/* Block 2 — 1000m running */}
          <Block id="run" icon={Timer} title="Bloque 2 · Carrera 1000m (VAM)" subtitle="6 × 400m · 110% VAM">
            <p className="text-[11px] text-muted-foreground mb-3">Recuperación: <span className="text-foreground font-medium">90 s trote suave</span> entre series</p>
            <div className="space-y-2">
              {runIntervals.map((r) => (
                <div key={r.i} className="grid grid-cols-[40px_1fr_1fr] items-center gap-3 rounded-xl border border-border bg-card/40 p-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center">
                    <span className="text-sm font-display font-bold text-primary">{r.i}</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Objetivo</p>
                    <p className="text-sm font-display font-bold">{r.target} <span className="text-muted-foreground text-xs">/400m</span></p>
                  </div>
                  <Input placeholder="Tiempo real" className="h-9 text-sm" />
                </div>
              ))}
            </div>
          </Block>

          {/* Block 3 — Agility */}
          <Block id="agility" icon={Zap} title="Bloque 3 · Circuito de Agilidad" subtitle="4 rondas · técnica policial">
            <div className="space-y-2">
              {[
                { name: "T-Drill (cambios de dirección)", time: "20 s × 4" },
                { name: "Skipping + sprint 10m", time: "15 s × 4" },
                { name: "Salto vallas + giro 180°", time: "25 s × 4" },
                { name: "Burpee + sprint 5m", time: "20 s × 4" },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3">
                  <span className="text-sm">{d.name}</span>
                  <span className="text-xs font-display font-bold text-primary">{d.time}</span>
                </div>
              ))}
            </div>
          </Block>
        </Accordion>

        {/* Footer actions */}
        <section className="glass rounded-2xl p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Session RPE</p>
                <p className="text-sm">¿Cómo de duro fue el entreno?</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-display font-bold text-gradient">{sessionRPE[0]}</p>
                <p className="text-[10px] text-muted-foreground">/ 10</p>
              </div>
            </div>
            <Slider
              value={sessionRPE}
              onValueChange={setSessionRPE}
              min={1}
              max={10}
              step={1}
              className="mt-4"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>Muy fácil</span><span>Máximo esfuerzo</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Carga estimada (sRPE): <span className="font-medium text-foreground">{sessionRPE[0] * 60} UA</span>
            </div>
          </div>

          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={() => setFinished(true)}
          >
            <CheckCircle2 className="h-5 w-5" />
            {finished ? "¡Entrenamiento registrado!" : "Finalizar Entrenamiento"}
          </Button>
        </section>
      </main>
    </div>
  );
}

function Block({
  id, icon: Icon, title, subtitle, children,
}: { id: string; icon: any; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={id} className="glass rounded-2xl border-0 px-4 data-[state=open]:bg-white/[0.04] transition-colors">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 text-left">
          <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-display font-bold">{title}</p>
            <p className="text-[11px] text-muted-foreground font-normal">{subtitle}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-5">{children}</AccordionContent>
    </AccordionItem>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 rounded-lg border border-border bg-card/40 p-3">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function SetRow({
  index, columns,
}: { index: number; columns: { label: string; value: string }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center shrink-0">
          <span className="text-sm font-display font-bold text-primary">{index}</span>
        </div>
        <div className="grid grid-cols-3 flex-1 gap-2">
          {columns.map((c) => (
            <div key={c.label}>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <p className="text-xs font-display font-bold mt-0.5">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Input placeholder="Reps reales" className="h-9 text-sm" />
        <Input placeholder="RPE 1-10" className="h-9 text-sm" />
      </div>
    </div>
  );
}

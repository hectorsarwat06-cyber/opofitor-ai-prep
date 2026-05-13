import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Snowflake,
  CheckCircle2,
  Activity,
  HeartPulse,
  Gauge,
  Repeat,
  Wind,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/workout-session")({
  head: () => ({
    meta: [
      { title: "Sesión de entrenamiento — opoFITor" },
      {
        name: "description",
        content:
          "Sesión científica diaria: protocolo RAMP, fuerza específica en dominadas y potencia aeróbica VAM.",
      },
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
  const navigate = useNavigate();
  const [sessionRPE, setSessionRPE] = useState<number[]>([7]);
  const [rpeOpen, setRpeOpen] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleFinish = () => {
    try {
      const raw = localStorage.getItem("opofitor_history");
      const hist = raw ? JSON.parse(raw) : [];
      hist.unshift({
        date: new Date().toISOString(),
        rpe: sessionRPE[0],
        title: "Día 1 · Fuerza Máxima + Potencia Aeróbica",
        achievement: `Dominadas 4×3-4 RIR 2 · 2×(6×200m) sRPE ${sessionRPE[0]}`,
      });
      localStorage.setItem("opofitor_history", JSON.stringify(hist.slice(0, 30)));
    } catch {}
    setFinished(true);
    setRpeOpen(false);
    setTimeout(() => navigate({ to: "/plan-semanal" }), 700);
  };

  const pullupSets = [
    { set: 1, reps: "4", load: "+12 kg", pct: "80% RM", rir: "RIR 2", tempo: "Bajada control · subida explosiva", rest: "3:00" },
    { set: 2, reps: "4", load: "+13 kg", pct: "82% RM", rir: "RIR 2", tempo: "Bajada control · subida explosiva", rest: "3:30" },
    { set: 3, reps: "3", load: "+15 kg", pct: "85% RM", rir: "RIR 2", tempo: "Bajada control · subida explosiva", rest: "4:00" },
    { set: 4, reps: "3", load: "+15 kg", pct: "85% RM", rir: "RIR 2", tempo: "Bajada control · subida explosiva", rest: "4:00" },
  ];

  const runBlocks = [
    {
      block: "A",
      reps: Array.from({ length: 6 }, (_, i) => ({
        i: i + 1,
        target: "39.0 s",
        pace: i % 2 === 0 ? "110% VAM" : "112% VAM",
        rest: "40 s pasivo",
      })),
    },
    {
      block: "B",
      reps: Array.from({ length: 6 }, (_, i) => ({
        i: i + 1,
        target: i < 3 ? "38.5 s" : "38.0 s",
        pace: "115% VAM",
        rest: "40 s pasivo",
      })),
    },
  ];

  const totalSrpe = useMemo(() => sessionRPE[0] * 65, [sessionRPE]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <header className="px-4 py-5 max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/plan-semanal">Plan semanal</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="px-4 pb-32 max-w-4xl mx-auto animate-fade-up space-y-6">
        {/* Header / Protocol summary */}
        <section className="glass rounded-2xl p-6 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-40"
            style={{ background: "var(--gradient-glow)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="capitalize">{today}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
              <span>Sesión 14 / 35</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mt-1 tracking-tight">
              Día 1 · Fuerza Máxima + Potencia Aeróbica
            </h1>
            <p className="text-sm text-primary mt-1">
              Mesociclo de Acumulación · Microciclo 3 / 5
            </p>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Metric icon={HeartPulse} label="Readiness" value="86" suffix="/100" />
              <Metric icon={Gauge} label="Carga prevista" value="455" suffix="UA" />
              <Metric icon={Timer} label="Duración" value="68" suffix="min" />
              <Metric icon={Activity} label="VAM ref." value="18.0" suffix="km/h" />
            </div>

            <div className="mt-5">
              <Progress value={86} className="h-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                <span>HRV +6% vs. baseline</span>
                <span>Listo para alta intensidad neural</span>
              </div>
            </div>
          </div>
        </section>

        {/* Session structure */}
        <Accordion
          type="multiple"
          defaultValue={["ramp", "blockA", "blockB", "cooldown"]}
          className="space-y-3"
        >
          {/* RAMP */}
          <Block
            id="ramp"
            tag="Fase 1"
            tagColor="bg-amber-500/15 text-amber-400 border-amber-500/30"
            icon={Flame}
            title="Calentamiento — Protocolo RAMP"
            subtitle="15 min · preparación neuromuscular y metabólica"
          >
            <div className="space-y-3">
              <Phase
                step="R"
                name="Raise — Elevación"
                duration="5 min"
                detail="Trote suave continuo a 60–65% FCmáx. Aumento progresivo de la temperatura central (+1.0 °C) y cinética de O₂ para acelerar la fase rápida del VO₂."
                meta={[
                  { k: "Zona", v: "Z1" },
                  { k: "FC", v: "115–135 bpm" },
                  { k: "RPE", v: "3/10" },
                ]}
              />
              <Phase
                step="A·M"
                name="Activate & Mobilize"
                duration="6 min"
                detail="Movilidad articular dirigida: rotación torácica, retracción/depresión escapular, CARs glenohumerales (dominadas) y movilidad coxofemoral en extensión + flexión de cadera (carrera)."
                meta={[
                  { k: "Bloques", v: "3 × 90 s" },
                  { k: "Foco", v: "Escápula · Cadera" },
                  { k: "Tipo", v: "Dinámico" },
                ]}
              />
              <Phase
                step="P"
                name="Potentiate — Activación PAP"
                duration="4 min"
                detail="Sprints progresivos 3 × 20 m (85→95% velocidad máx) + 2 × 3 dominadas explosivas (intención balística). Potenciación post-activación del SNC sin generar fatiga periférica."
                meta={[
                  { k: "Sprints", v: "3 × 20 m" },
                  { k: "Dominadas", v: "2 × 3 explosivas" },
                  { k: "Descanso", v: "60 s" },
                ]}
              />
            </div>
          </Block>

          {/* Block A */}
          <Block
            id="blockA"
            tag="Bloque A"
            tagColor="bg-primary/15 text-primary border-primary/30"
            icon={Dumbbell}
            title="Fuerza Específica — Dominadas Pronas Lastradas"
            subtitle="Velocidad / RIR · 4 series · ATP-PCr"
          >
            <ProtocolBar
              items={[
                { k: "Metodología", v: "Velocity / RIR-based" },
                { k: "Sistema", v: "ATP-PCr" },
                { k: "Intención", v: "Máxima velocidad concéntrica" },
                { k: "Tempo", v: "2 : 0 : X : 1" },
              ]}
            />

            <div className="mt-4 rounded-xl border border-border bg-card/40 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="w-10 text-[10px] uppercase tracking-widest">
                      Set
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Reps</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Carga</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">% RM</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">RIR</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Tempo</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-right">
                      Descanso
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pullupSets.map((s) => (
                    <TableRow key={s.set} className="border-border">
                      <TableCell className="font-display font-bold text-primary">
                        {s.set}
                      </TableCell>
                      <TableCell className="font-medium">{s.reps}</TableCell>
                      <TableCell>{s.load}</TableCell>
                      <TableCell className="text-muted-foreground">{s.pct}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] py-0 h-5 border-primary/30 text-primary">
                          {s.rir}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{s.tempo}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{s.rest}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-3">
              <NoteCard
                icon={Repeat}
                title="Tempo Biomecánico 2:0:X:1"
                body="2 s fase excéntrica controlada · 0 s pausa abajo · X concéntrica explosiva (intención máxima) · 1 s pausa isométrica con barbilla sobre la barra."
              />
              <NoteCard
                icon={Timer}
                title="Recuperación 3–4 min estrictos"
                body="Garantiza resíntesis completa de fosfocreatina (>95% PCr a 3:30) para mantener producción de fuerza pico en cada serie."
              />
            </div>

            <p className="text-[11px] text-muted-foreground mt-4 mb-2 uppercase tracking-widest">
              Registro de ejecución
            </p>
            <div className="space-y-2">
              {pullupSets.map((s) => (
                <div
                  key={s.set}
                  className="grid grid-cols-[36px_1fr_1fr_1fr] gap-2 items-center rounded-lg border border-border bg-card/40 p-2.5"
                >
                  <span className="font-display font-bold text-primary text-sm pl-2">
                    #{s.set}
                  </span>
                  <Input placeholder="Reps reales" className="h-9 text-sm" />
                  <Input placeholder="Vel. m/s" className="h-9 text-sm" />
                  <Input placeholder="RPE 1-10" className="h-9 text-sm" />
                </div>
              ))}
            </div>
          </Block>

          {/* Block B */}
          <Block
            id="blockB"
            tag="Bloque B"
            tagColor="bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
            icon={Wind}
            title="Potencia Aeróbica — HIIT Corto VAM"
            subtitle="2 × (6 × 200m) · VO₂máx · tolerancia láctica"
          >
            <ProtocolBar
              items={[
                { k: "Metodología", v: "HIIT corto intermitente" },
                { k: "Intensidad", v: "110–115% VAM" },
                { k: "Ratio W:R", v: "1:1 pasivo" },
                { k: "Recup. inter-bloque", v: "3 min activo" },
              ]}
            />

            <div className="mt-4 grid md:grid-cols-2 gap-3">
              {runBlocks.map((b) => (
                <div
                  key={b.block}
                  className="rounded-xl border border-border bg-card/40 overflow-hidden"
                >
                  <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                    <span className="text-xs font-display font-bold tracking-wider">
                      Bloque {b.block} · 6 × 200 m
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 border-cyan-500/30 text-cyan-400"
                    >
                      {b.block === "A" ? "110–112% VAM" : "115% VAM"}
                    </Badge>
                  </div>
                  <div className="divide-y divide-border">
                    {b.reps.map((r) => (
                      <div
                        key={r.i}
                        className="grid grid-cols-[28px_1fr_1fr] items-center gap-3 px-3 py-2.5"
                      >
                        <span className="text-xs font-display font-bold text-cyan-400">
                          {r.i}
                        </span>
                        <div>
                          <p className="text-sm font-display font-bold leading-none">
                            {r.target}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {r.pace} · {r.rest}
                          </p>
                        </div>
                        <Input placeholder="Real" className="h-8 text-xs" />
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-3 border-t border-border bg-card/20 grid grid-cols-[1fr_auto] items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Tiempo medio del bloque
                    </span>
                    <Input placeholder="ej. 38.6 s" className="h-8 w-28 text-xs" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-3 text-xs">
              <MicroStat label="Volumen total" value="2 400 m" />
              <MicroStat label="Tiempo en zona VO₂" value="~7 min" />
              <MicroStat label="Lactato esperado" value="8–11 mmol/L" />
            </div>
          </Block>

          {/* Cool-down */}
          <Block
            id="cooldown"
            tag="Fase 4"
            tagColor="bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            icon={Snowflake}
            title="Vuelta a la Calma"
            subtitle="10 min · aclaramiento de lactato y movilidad pasiva"
          >
            <div className="space-y-3">
              <Phase
                step="1"
                name="Trote regenerativo"
                duration="5 min"
                detail="Carrera continua en zona 1 (50–60% FCmáx) para favorecer el aclaramiento de lactato sanguíneo mediante oxidación muscular y reducir la frecuencia cardíaca progresivamente."
                meta={[
                  { k: "Zona", v: "Z1" },
                  { k: "FC", v: "100–120 bpm" },
                  { k: "Lactato", v: "↓ 50% en 8 min" },
                ]}
              />
              <Phase
                step="2"
                name="Estiramientos estáticos pasivos"
                duration="5 min"
                detail="Énfasis en dorsal ancho, redondo mayor y cadena posterior (isquiosurales, glúteo, gemelo). Series de 30–45 s por grupo, intensidad submáxima sin dolor."
                meta={[
                  { k: "Series", v: "2 × 30–45 s" },
                  { k: "Foco", v: "Dorsal · C. posterior" },
                  { k: "Modo", v: "Pasivo" },
                ]}
              />
            </div>
          </Block>
        </Accordion>

        {/* Footer actions */}
        <section className="glass rounded-2xl p-6 space-y-3 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            ¿Has terminado?
          </p>
          <p className="text-sm text-muted-foreground">
            Registraremos tu esfuerzo percibido (RPE) para ajustar la carga semanal.
          </p>
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={() => setRpeOpen(true)}
            disabled={finished}
          >
            <CheckCircle2 className="h-5 w-5" />
            {finished ? "¡Sesión guardada!" : "Finalizar Sesión"}
          </Button>
        </section>
      </main>

      {/* RPE Dialog */}
      <Dialog open={rpeOpen} onOpenChange={setRpeOpen}>
        <DialogContent className="glass border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              ¿Qué tan duro ha sido el entrenamiento hoy?
            </DialogTitle>
            <DialogDescription>
              Escala RPE de Borg (CR-10) — percepción global del esfuerzo.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-5">
            <div className="text-center">
              <p className="text-6xl font-display font-bold text-gradient leading-none">
                {sessionRPE[0]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">/ 10</p>
              <p className="text-sm mt-2 text-foreground/80">
                {rpeLabel(sessionRPE[0])}
              </p>
            </div>

            <Slider
              value={sessionRPE}
              onValueChange={setSessionRPE}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1 · Muy fácil</span>
              <span>10 · Máximo</span>
            </div>

            <div className="rounded-lg border border-border bg-card/40 p-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Carga sRPE estimada
              </span>
              <span className="font-display font-bold text-foreground">
                {totalSrpe} UA
              </span>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-stretch">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setRpeOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="hero" className="flex-1" onClick={handleFinish}>
              <ChevronRight className="h-4 w-4" /> Guardar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function rpeLabel(v: number) {
  if (v <= 2) return "Muy ligero · recuperación";
  if (v <= 4) return "Ligero · cómodo";
  if (v <= 6) return "Moderado · sostenible";
  if (v <= 8) return "Duro · cerca del límite";
  return "Máximo · al fallo";
}

function Metric({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: any;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="font-display font-bold mt-1">
        <span className="text-xl">{value}</span>
        {suffix && (
          <span className="text-xs text-muted-foreground ml-1">{suffix}</span>
        )}
      </p>
    </div>
  );
}

function Block({
  id,
  icon: Icon,
  title,
  subtitle,
  tag,
  tagColor,
  children,
}: {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      value={id}
      className="glass rounded-2xl border-0 px-4 data-[state=open]:bg-white/[0.04] transition-colors"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 text-left flex-1">
          <div className="h-10 w-10 rounded-lg bg-primary/15 grid place-items-center shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${tagColor}`}
              >
                {tag}
              </span>
            </div>
            <p className="text-sm font-display font-bold mt-1 truncate">{title}</p>
            <p className="text-[11px] text-muted-foreground font-normal">
              {subtitle}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-5">{children}</AccordionContent>
    </AccordionItem>
  );
}

function Phase({
  step,
  name,
  duration,
  detail,
  meta,
}: {
  step: string;
  name: string;
  duration: string;
  detail: string;
  meta: { k: string; v: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 min-w-[2.25rem] px-2 rounded-lg bg-primary/15 grid place-items-center shrink-0">
          <span className="text-xs font-display font-bold text-primary">
            {step}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-display font-bold">{name}</p>
            <span className="text-[11px] font-mono text-muted-foreground">
              {duration}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            {detail}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {meta.map((m) => (
              <div key={m.k} className="text-[10px]">
                <span className="uppercase tracking-widest text-muted-foreground">
                  {m.k}
                </span>{" "}
                <span className="font-medium text-foreground">{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtocolBar({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-xl border border-border bg-card/40 p-3">
      {items.map((m) => (
        <div key={m.k}>
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
            {m.k}
          </p>
          <p className="text-xs font-display font-bold mt-0.5">{m.v}</p>
        </div>
      ))}
    </div>
  );
}

function NoteCard({
  icon: Icon,
  title,
  body,
}: {
  icon: any;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <p className="text-xs font-display font-bold">{title}</p>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
        {body}
      </p>
    </div>
  );
}

function MicroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 px-3 py-2">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-display font-bold mt-0.5">{value}</p>
    </div>
  );
}
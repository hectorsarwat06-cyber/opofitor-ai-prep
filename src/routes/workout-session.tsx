import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTrainingPlan } from "@/hooks/use-training-plan";
import { sesionDeHoy } from "@/lib/training-engine";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  Shield,
  ArrowLeft,
  CheckCircle2,
  Activity,
  Timer,
  Loader2,
  ChevronRight,
  Dumbbell,
  Wind,
  Snowflake,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/workout-session")({
  head: () => ({
    meta: [
      { title: "Sesión de entrenamiento — opoFITor" },
      {
        name: "description",
        content: "Sesión diaria generada por el motor de periodización personalizado.",
      },
    ],
  }),
  component: WorkoutSession,
});

function tipoIcon(tipo: string) {
  if (tipo === "Fuerza") return Dumbbell;
  if (tipo === "Resistencia") return Wind;
  if (tipo === "Agilidad") return Flame;
  return Snowflake;
}

function WorkoutSession() {
  useRequireAuth();
  const navigate = useNavigate();
  const { plan, loading } = useTrainingPlan();
  const sesion = useMemo(() => (plan ? sesionDeHoy(plan) : null), [plan]);

  const [sessionRPE, setSessionRPE] = useState<number[]>([7]);
  const [rpeOpen, setRpeOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalSrpe = useMemo(
    () => sessionRPE[0] * (sesion?.duracionMin ?? 0),
    [sessionRPE, sesion],
  );

  const handleFinish = async () => {
    if (!sesion) return;
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast.error("Sesión expirada. Inicia sesión de nuevo.");
        navigate({ to: "/auth" });
        return;
      }
      const { error } = await supabase.from("entrenamientos_log").insert({
        user_id: u.user.id,
        tipo_sesion: `${sesion.diaNombre} · ${sesion.titulo}`,
        rpe_sesion: sessionRPE[0],
      });
      if (error) throw error;
      toast.success("Sesión guardada correctamente");
      setFinished(true);
      setRpeOpen(false);
      setTimeout(() => navigate({ to: "/plan-semanal" }), 700);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar la sesión");
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

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
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </Button>
      </header>

      <main className="px-4 pb-32 max-w-4xl mx-auto animate-fade-up space-y-6">
        {loading ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-3">
              Cargando tu sesión personalizada…
            </p>
          </div>
        ) : !sesion || sesion.tipo === "Descanso" ? (
          <EmptyState
            title={
              sesion?.tipo === "Descanso"
                ? "Hoy toca descanso"
                : "No hay sesión activa para hoy o no se ha podido cargar"
            }
            description={
              sesion?.tipo === "Descanso"
                ? sesion.resumen
                : "Vuelve al panel para revisar tu plan o repetir el test inicial."
            }
          />
        ) : (
          <ActiveSession
            sesion={sesion}
            today={today}
            vam={plan?.vam ?? 0}
            finished={finished}
            onOpenRpe={() => setRpeOpen(true)}
          />
        )}
      </main>

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
              <p className="text-sm mt-2 text-foreground/80">{rpeLabel(sessionRPE[0])}</p>
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
              <span className="font-display font-bold text-foreground">{totalSrpe} UA</span>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-stretch">
            <Button variant="ghost" className="flex-1" onClick={() => setRpeOpen(false)}>
              Cancelar
            </Button>
            <Button variant="hero" className="flex-1" onClick={handleFinish} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando…
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" /> Guardar sesión
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActiveSession({
  sesion,
  today,
  vam,
  finished,
  onOpenRpe,
}: {
  sesion: ReturnType<typeof sesionDeHoy>;
  today: string;
  vam: number;
  finished: boolean;
  onOpenRpe: () => void;
}) {
  const Icon = tipoIcon(sesion.tipo);
  return (
    <>
      <section className="glass rounded-2xl p-6 relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-40"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="capitalize">{today}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
            <span>{sesion.diaNombre}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-1 tracking-tight">
            {sesion.titulo}
          </h1>
          <p className="text-sm text-primary mt-1">{sesion.resumen}</p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric icon={Icon} label="Tipo" value={sesion.tag} />
            <Metric icon={Timer} label="Duración" value={`${sesion.duracionMin}`} suffix="min" />
            <Metric icon={Activity} label="Bloques" value={`${sesion.bloques.length}`} />
            <Metric icon={Wind} label="VAM" value={vam ? vam.toFixed(1) : "—"} suffix="km/h" />
          </div>

          {sesion.ajusteRPE && (
            <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground/90">
              {sesion.ajusteRPE}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        {sesion.bloques.map((b, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center shrink-0">
                <span className="text-xs font-display font-bold text-primary">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-display font-bold">{b.ejercicio}</p>
                  <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">
                    Prescripción
                  </Badge>
                </div>
                <p className="text-sm text-primary font-mono mt-1.5">{b.detalle}</p>
                {b.observacion && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {b.observacion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="glass rounded-2xl p-6 space-y-3 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">¿Has terminado?</p>
        <p className="text-sm text-muted-foreground">
          Registraremos tu esfuerzo percibido (RPE) para ajustar la carga semanal.
        </p>
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={onOpenRpe}
          disabled={finished}
        >
          <CheckCircle2 className="h-5 w-5" />
          {finished ? "¡Sesión guardada!" : "Finalizar sesión"}
        </Button>
      </section>
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="glass rounded-2xl p-10 text-center space-y-4">
      <Snowflake className="h-10 w-10 mx-auto text-primary" />
      <h2 className="text-xl font-display font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
      <Button asChild variant="hero">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>
      </Button>
    </section>
  );
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
        {suffix && <span className="text-xs text-muted-foreground ml-1">{suffix}</span>}
      </p>
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
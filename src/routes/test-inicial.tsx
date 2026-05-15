import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Timer, Dumbbell, Loader2, Sparkles, ArrowRight, Activity } from "lucide-react";

export const Route = createFileRoute("/test-inicial")({
  head: () => ({
    meta: [
      { title: "Test inicial — opoFITor" },
      { name: "description", content: "Día Cero: tus marcas iniciales para construir el macrociclo." },
    ],
  }),
  component: TestInicial,
});

function TestInicial() {
  const navigate = useNavigate();
  useRequireAuth();
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [pullups, setPullups] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const m = parseInt(minutes, 10);
    const s = parseInt(seconds, 10);
    const p = parseInt(pullups, 10);
    if (isNaN(m) || isNaN(s) || s < 0 || s > 59 || isNaN(p) || p < 0) {
      setError("Introduce marcas válidas para ambos tests.");
      return;
    }
    setError(null);
    setGenerating(true);
    const tiempo = `${m}:${String(s).padStart(2, "0")}`;
    const totalSec = m * 60 + s;
    // VAM ≈ 1000m / tiempo en min, simplificado a km/h
    const vam = Math.round((1000 / totalSec) * 3.6 * 10) / 10;
    try {
      localStorage.setItem(
        "opofitor_initial_test",
        JSON.stringify({ run1000: tiempo, runSeconds: totalSec, pullups: p, vam, date: new Date().toISOString() }),
      );
      localStorage.setItem("opofitor_macrocycle_start", new Date().toISOString());
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast.error("Necesitas iniciar sesión");
        navigate({ to: "/auth" });
        return;
      }
      const { error: insErr } = await supabase.from("evaluaciones").insert({
        user_id: u.user.id,
        tiempo_1000m: tiempo,
        max_dominadas: p,
        vam_estimada: vam,
      });
      if (insErr) throw insErr;
      toast.success("Macrociclo generado y marcas guardadas");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error guardando los datos";
      toast.error(msg);
      setGenerating(false);
      return;
    }
    await new Promise((r) => setTimeout(r, 1800));
    navigate({ to: "/dashboard" });
  };

  if (generating) return <Generating />;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <header className="px-4 py-6 max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>
        <span className="text-xs text-muted-foreground">Día 0 · Línea base</span>
      </header>

      <main className="px-4 pb-20 max-w-5xl mx-auto animate-fade-up">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Test inicial obligatorio</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Tus <span className="text-gradient">marcas iniciales</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Necesitamos dos datos para calibrar tu macrociclo. Da el máximo: definirá tus zonas de trabajo durante las próximas semanas.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {/* Test carrera */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg glass grid place-items-center">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 01</p>
                  <h2 className="text-xl font-display font-bold">Carrera 1000 m</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Calienta 10 minutos en zona suave + movilidad. Después corre 1000 m a tu <strong className="text-foreground">máximo esfuerzo</strong> en pista o llano.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="min">Minutos</Label>
                  <Input id="min" inputMode="numeric" placeholder="3" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="mt-1.5 text-center text-2xl font-display font-bold h-14" />
                </div>
                <div>
                  <Label htmlFor="sec">Segundos</Label>
                  <Input id="sec" inputMode="numeric" placeholder="45" value={seconds} onChange={(e) => setSeconds(e.target.value)} className="mt-1.5 text-center text-2xl font-display font-bold h-14" />
                </div>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">Formato MM:SS · Ej. 3:45</p>
            </div>
          </div>

          {/* Test fuerza */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg glass grid place-items-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 02</p>
                  <h2 className="text-xl font-display font-bold">Dominadas máximas</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Máximas dominadas <strong className="text-foreground">estrictas</strong> en una sola serie. Agarre prono, sin balanceo, barbilla por encima de la barra.
              </p>
              <div className="mt-6">
                <Label htmlFor="pu">Repeticiones completadas</Label>
                <Input id="pu" inputMode="numeric" placeholder="8" value={pullups} onChange={(e) => setPullups(e.target.value)} className="mt-1.5 text-center text-3xl font-display font-bold h-20" />
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">Solo cuentan las repeticiones con técnica válida.</p>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-destructive">{error}</p>
        )}

        <div className="mt-10 flex justify-center">
          <Button variant="hero" size="lg" onClick={handleGenerate}>
            <Activity className="h-4 w-4" /> Generar mi Macrociclo <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

function Generating() {
  return (
    <div className="min-h-screen bg-background grid place-items-center px-4">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="text-center max-w-md animate-fade-up">
        <div className="h-16 w-16 mx-auto rounded-2xl glass grid place-items-center mb-6">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-display font-bold">Construyendo tu macrociclo…</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Calculando zonas de VAM, RM estimado y distribución por mesociclos.
        </p>
      </div>
    </div>
  );
}
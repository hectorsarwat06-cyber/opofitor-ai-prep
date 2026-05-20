import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield, Timer, Dumbbell, Loader2, Sparkles, ArrowRight, Activity, User,
} from "lucide-react";
import { calcularVAM, type Genero } from "@/lib/training-engine";

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
  const [genero, setGenero] = useState<Genero | "">("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [fuerza, setFuerza] = useState("");
  const [agilidad, setAgilidad] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (genero !== "Hombre" && genero !== "Mujer") {
      setError("Selecciona tu género para diferenciar los baremos.");
      return;
    }
    const m = parseInt(minutes, 10);
    const s = parseInt(seconds, 10);
    const f = parseFloat(fuerza);
    const ag = parseFloat(agilidad);
    if (isNaN(m) || isNaN(s) || s < 0 || s > 59 || isNaN(f) || f < 0 || isNaN(ag) || ag <= 0) {
      setError("Introduce marcas válidas en todos los tests.");
      return;
    }
    setError(null);
    setGenerating(true);
    const tiempo = `${m}:${String(s).padStart(2, "0")}`;
    const vam = calcularVAM(tiempo);
    try {
      localStorage.setItem("opofitor_macrocycle_start", new Date().toISOString());
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast.error("Necesitas iniciar sesión");
        navigate({ to: "/auth" });
        return;
      }
      // Guarda género en perfil
      const { error: profErr } = await supabase.from("profiles").upsert({
        id: u.user.id,
        genero,
      });
      if (profErr) throw profErr;
      // Guarda evaluación
      const { error: insErr } = await supabase.from("evaluaciones").insert({
        user_id: u.user.id,
        tiempo_1000m: tiempo,
        max_dominadas: genero === "Hombre" ? Math.round(f) : 0,
        fuerza_tren_superior: f,
        tiempo_agilidad: ag,
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
    await new Promise((r) => setTimeout(r, 1400));
    navigate({ to: "/dashboard" });
  };

  if (generating) return <Generating />;

  const fuerzaLabel = genero === "Mujer" ? "Tiempo de suspensión máxima (s)" : "Repeticiones máximas (dominadas)";
  const fuerzaPlaceholder = genero === "Mujer" ? "45" : "8";

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
            Necesitamos estas marcas para calibrar tu macrociclo según los baremos oficiales.
          </p>
        </div>

        {/* Género */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg glass grid place-items-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Paso 1</p>
              <h2 className="text-xl font-display font-bold">Género</h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">El baremo de fuerza cambia: dominadas (hombre) vs. suspensión isométrica (mujer).</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(["Hombre", "Mujer"] as Genero[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenero(g)}
                className={`h-14 rounded-xl border transition-all font-display font-bold ${
                  genero === g
                    ? "bg-[image:var(--gradient-primary)] border-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {/* Test carrera */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg glass grid place-items-center">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 02</p>
                  <h2 className="text-xl font-display font-bold">Carrera 1000 m</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Corre 1000 m a tu <strong className="text-foreground">máximo esfuerzo</strong>.
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

          {/* Test fuerza dinámico */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg glass grid place-items-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 03</p>
                  <h2 className="text-xl font-display font-bold">Fuerza tren superior</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {genero === "Mujer"
                  ? "Cuelga de la barra con agarre prono, brazos a 90°, hasta el fallo."
                  : "Máximas dominadas estrictas, agarre prono, sin balanceo."}
              </p>
              <div className="mt-6">
                <Label htmlFor="fu">{fuerzaLabel}</Label>
                <Input id="fu" inputMode="decimal" placeholder={fuerzaPlaceholder} value={fuerza} onChange={(e) => setFuerza(e.target.value)} className="mt-1.5 text-center text-3xl font-display font-bold h-20" />
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">{genero === "Mujer" ? "Tiempo en segundos." : "Solo reps con técnica válida."}</p>
            </div>
          </div>

          {/* Agilidad */}
          <div className="md:col-span-2 glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg glass grid place-items-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 04</p>
                  <h2 className="text-xl font-display font-bold">Circuito de agilidad</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Tiempo total en el circuito de agilidad (apoyos, giros y salida).
              </p>
              <div className="mt-4 max-w-xs">
                <Label htmlFor="ag">Segundos (con décimas)</Label>
                <Input id="ag" inputMode="decimal" placeholder="11.40" value={agilidad} onChange={(e) => setAgilidad(e.target.value)} className="mt-1.5 text-center text-2xl font-display font-bold h-14" />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="mt-6 text-center text-sm text-destructive">{error}</p>}

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
          Calculando zonas de VAM, RM y ajustes de carga.
        </p>
      </div>
    </div>
  );
}

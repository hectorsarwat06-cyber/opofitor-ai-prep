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
  Scale, Ruler, Calendar, Check
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
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [examDate, setExamDate] = useState("");
  const [activityLevel, setActivityLevel] = useState<"principiante" | "intermedio" | "avanzado">("intermedio");
  const [days, setDays] = useState<string[]>(["L", "X", "V"]);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [fuerza, setFuerza] = useState("");
  const [agilidad, setAgilidad] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const m = parseInt(minutes, 10);
    const s = parseInt(seconds, 10);
    const f = parseFloat(fuerza);
    const ag = parseFloat(agilidad);

    if (genero !== "Hombre" && genero !== "Mujer") {
      setError("Selecciona tu género para diferenciar los baremos.");
      return;
    }
    if (isNaN(h) || h <= 100 || h > 250) {
      setError("Introduce una altura válida en centímetros (ej. 175 cm).");
      return;
    }
    if (isNaN(w) || w <= 30 || w > 250) {
      setError("Introduce un peso válido en kilogramos (ej. 70 kg).");
      return;
    }
    if (days.length === 0) {
      setError("Selecciona al menos un día disponible para entrenar.");
      return;
    }
    if (isNaN(m) || isNaN(s) || s < 0 || s > 59 || isNaN(f) || f < 0 || isNaN(ag) || ag <= 0) {
      setError("Introduce marcas válidas en todos los tests de marcas.");
      return;
    }
    setError(null);
    setGenerating(true);
    const tiempo = `${m}:${String(s).padStart(2, "0")}`;
    const vam = calcularVAM(tiempo);
    try {
      localStorage.setItem("opofitor_macrocycle_start", new Date().toISOString());
      localStorage.setItem("opofitor_activity_level", activityLevel);
      if (examDate) localStorage.setItem("opofitor_exam_date", examDate);
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast.error("Necesitas iniciar sesión");
        navigate({ to: "/auth" });
        return;
      }
      // Guarda género y datos físicos en perfil
      const { error: profErr } = await supabase.from("profiles").upsert({
        id: u.user.id,
        genero,
        peso: w,
        altura: h,
        dias_disponibles: days,
        fecha_examen: examDate || null,
      });
      if (profErr) throw Object.assign(new Error(profErr.message), { supa: profErr, where: "profiles.upsert" });
      // Guarda evaluación
      const { error: insErr } = await supabase.from("evaluaciones").insert({
        user_id: u.user.id,
        tiempo_1000m: tiempo,
        max_dominadas: genero === "Hombre" ? Math.round(f) : 0,
        fuerza_tren_superior: f,
        tiempo_agilidad: ag,
        vam_estimada: vam,
      });
      if (insErr) throw Object.assign(new Error(insErr.message), { supa: insErr, where: "evaluaciones.insert" });
      toast.success("Macrociclo generado y marcas guardadas");
    } catch (e) {
      const supa = (e as { supa?: { message?: string; details?: string; hint?: string; code?: string }; where?: string }).supa;
      const where = (e as { where?: string }).where;
      const message = supa?.message ?? (e instanceof Error ? e.message : "Error desconocido");
      const details = supa?.details ? ` · details: ${supa.details}` : "";
      const hint = supa?.hint ? ` · hint: ${supa.hint}` : "";
      const code = supa?.code ? ` [${supa.code}]` : "";
      const prefix = where ? `${where}${code}: ` : code ? `${code} ` : "";
      const full = `${prefix}${message}${details}${hint}`;
      console.error("[test-inicial] supabase error", { where, supa, error: e });
      toast.error(full, { duration: 15000, description: "Copia este texto si necesitas soporte." });
      setError(full);
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

        {/* Fecha del Examen */}
        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg glass grid place-items-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Paso 2</p>
              <h2 className="text-xl font-display font-bold">Fecha del Examen</h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">¿Cuándo tienes previsto realizar las pruebas físicas oficiales? (Sirve para calcular las semanas del macrociclo).</p>
          <div className="mt-4 max-w-sm">
            <Label htmlFor="examDate">Día oficial del examen (Opcional)</Label>
            <Input id="examDate" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="mt-1.5 h-12" />
          </div>
        </div>

        {/* Datos Corporales */}
        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg glass grid place-items-center">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Paso 3</p>
              <h2 className="text-xl font-display font-bold">Datos Corporales</h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Tu peso y altura se usan para calcular la fuerza relativa y calibrar las cargas.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Altura (cm)</Label>
              <Input id="height" inputMode="numeric" placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1.5 h-12 text-lg font-display font-semibold text-center" />
            </div>
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" inputMode="decimal" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1.5 h-12 text-lg font-display font-semibold text-center" />
            </div>
          </div>
        </div>

        {/* Experiencia y Disponibilidad */}
        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg glass grid place-items-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Paso 4</p>
              <h2 className="text-xl font-display font-bold">Experiencia y Disponibilidad</h2>
            </div>
          </div>
          
          <div className="mt-5">
            <Label className="text-sm font-semibold">¿Cuál es tu nivel de actividad física actual?</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Esto adaptará la progresión y el volumen inicial para evitar sobreentrenamiento y lesiones.</p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {(["principiante", "intermedio", "avanzado"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setActivityLevel(level)}
                  className={`h-14 rounded-xl border transition-all text-xs font-display font-bold capitalize flex flex-col items-center justify-center ${
                    activityLevel === level
                      ? "bg-[image:var(--gradient-primary)] border-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span>{level === "principiante" ? "Principiante" : level === "intermedio" ? "Intermedio" : "Avanzado"}</span>
                  <span className="block text-[8px] font-normal opacity-80 mt-0.5 font-sans lowercase">
                    {level === "principiante" ? "volumen suave" : level === "intermedio" ? "estándar" : "volumen alto"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-sm font-semibold">¿Qué días prefieres entrenar?</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Te recomendamos entrenar de 3 a 5 días para una preparación óptima.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { k: "L", label: "Lunes" },
                { k: "M", label: "Martes" },
                { k: "X", label: "Miércoles" },
                { k: "J", label: "Jueves" },
                { k: "V", label: "Viernes" },
                { k: "S", label: "Sábado" },
                { k: "D", label: "Domingo" },
              ].map((d) => {
                const active = days.includes(d.k);
                return (
                  <button
                    key={d.k}
                    type="button"
                    onClick={() => {
                      setDays((prev) =>
                        prev.includes(d.k) ? prev.filter((x) => x !== d.k) : [...prev, d.k]
                      );
                    }}
                    className={`relative h-12 w-12 rounded-xl border transition-all flex flex-col items-center justify-center ${
                      active
                        ? "bg-[image:var(--gradient-primary)] border-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                        : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm font-display font-bold leading-none">{d.k}</span>
                    <span className="text-[7px] uppercase tracking-wider mt-0.5 leading-none">{d.label.slice(0, 3)}</span>
                    {active && (
                      <Check className="absolute top-0.5 right-0.5 h-2 w-2 text-primary-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
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
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 05</p>
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
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 06</p>
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
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Test 07</p>
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

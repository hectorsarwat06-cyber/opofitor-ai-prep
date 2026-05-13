import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Scale, Ruler, CalendarDays, Save, Check } from "lucide-react";
import { TopNav } from "@/components/landing/TopNav";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi Perfil — opoFITor" },
      { name: "description", content: "Gestiona tus datos físicos, días disponibles y fecha del examen." },
    ],
  }),
  component: Perfil,
});

const DAYS = [
  { k: "L", label: "Lunes" },
  { k: "M", label: "Martes" },
  { k: "X", label: "Miércoles" },
  { k: "J", label: "Jueves" },
  { k: "V", label: "Viernes" },
  { k: "S", label: "Sábado" },
  { k: "D", label: "Domingo" },
];

function Perfil() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [days, setDays] = useState<string[]>(["L", "X", "V"]);
  const [examDate, setExamDate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const onb = JSON.parse(localStorage.getItem("opofitor_onboarding") || "{}");
      const profile = JSON.parse(localStorage.getItem("opofitor_profile") || "{}");
      setWeight(String(profile.weight ?? onb.weight ?? ""));
      setHeight(String(profile.height ?? onb.height ?? ""));
      setDays(profile.days ?? ["L", "X", "V"]);
      setExamDate(profile.examDate ?? onb.examDate ?? localStorage.getItem("opofitor_exam_date") ?? "");
    } catch {}
  }, []);

  const toggleDay = (k: string) =>
    setDays((prev) => (prev.includes(k) ? prev.filter((d) => d !== k) : [...prev, k]));

  const handleSave = () => {
    try {
      localStorage.setItem(
        "opofitor_profile",
        JSON.stringify({ weight: Number(weight), height: Number(height), days, examDate }),
      );
      if (examDate) localStorage.setItem("opofitor_exam_date", examDate);
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
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
        <TopNav />
      </header>

      <main className="px-4 pb-24 max-w-5xl mx-auto animate-fade-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-xl glass grid place-items-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Mi Perfil</h1>
            <p className="text-sm text-muted-foreground">Ajustes que recalibran tu macrociclo automáticamente.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Datos físicos */}
          <section className="glass rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Datos físicos</p>
            <h2 className="text-lg font-display font-bold mt-1">Composición corporal</h2>
            <p className="text-xs text-muted-foreground mt-1">El peso recalibra el lastre y el ratio fuerza/peso.</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="w" className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-primary" /> Peso (kg)</Label>
                <Input id="w" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1.5 h-12 text-lg font-display font-semibold" />
              </div>
              <div>
                <Label htmlFor="h" className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 text-primary" /> Altura (cm)</Label>
                <Input id="h" inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1.5 h-12 text-lg font-display font-semibold" />
              </div>
            </div>
          </section>

          {/* Fecha objetivo */}
          <section className="glass rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Objetivo</p>
            <h2 className="text-lg font-display font-bold mt-1">Fecha del examen</h2>
            <p className="text-xs text-muted-foreground mt-1">Define la longitud total de tu macrociclo.</p>
            <div className="mt-5">
              <Label htmlFor="d" className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-primary" /> Día oficial</Label>
              <Input id="d" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="mt-1.5 h-12" />
            </div>
            {examDate && (
              <p className="mt-3 text-xs text-muted-foreground">
                Faltan <span className="text-primary font-semibold">{weeksUntil(examDate)} semanas</span> para tu prueba.
              </p>
            )}
          </section>

          {/* Planificación */}
          <section className="glass rounded-2xl p-6 lg:col-span-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Planificación</p>
            <h2 className="text-lg font-display font-bold mt-1">Días disponibles para entrenar</h2>
            <p className="text-xs text-muted-foreground mt-1">Marca tu disponibilidad real. Tu plan se redistribuye con la regla de 48 h entre sesiones de fuerza.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {DAYS.map((d) => {
                const active = days.includes(d.k);
                return (
                  <button
                    key={d.k}
                    type="button"
                    onClick={() => toggleDay(d.k)}
                    className={`relative h-16 w-16 rounded-xl border transition-all flex flex-col items-center justify-center ${
                      active
                        ? "bg-[image:var(--gradient-primary)] border-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                        : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="text-lg font-display font-bold">{d.k}</span>
                    <span className="text-[9px] uppercase tracking-widest mt-0.5">{d.label.slice(0, 3)}</span>
                    {active && (
                      <Check className="absolute top-1 right-1 h-3 w-3" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{days.length} días/semana seleccionados.</p>
          </section>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button variant="hero" size="lg" onClick={handleSave}>
            <Save className="h-4 w-4" /> Guardar cambios
          </Button>
          {saved && <span className="text-sm text-primary flex items-center gap-1.5"><Check className="h-4 w-4" /> Guardado</span>}
        </div>
      </main>
    </div>
  );
}

function weeksUntil(iso: string): number {
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.round((target - now) / (1000 * 60 * 60 * 24 * 7)));
}
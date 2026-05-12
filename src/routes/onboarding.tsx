import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  User,
  Activity,
  CalendarDays,
  Target,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — opoFITor" },
      {
        name: "description",
        content:
          "Configura tu plan de entrenamiento personalizado para las pruebas físicas de la Policía Nacional.",
      },
    ],
  }),
  component: Onboarding,
});

/* ---------------- Schemas ---------------- */

const stepSchemas = [
  z.object({
    age: z.coerce.number().int().min(16, "Mínimo 16 años").max(70, "Máximo 70 años"),
    height: z.coerce.number().int().min(140, "Mínimo 140 cm").max(220, "Máximo 220 cm"),
    weight: z.coerce.number().min(40, "Mínimo 40 kg").max(180, "Máximo 180 kg"),
  }),
  z.object({
    pullups: z.coerce.number().int().min(0, "No puede ser negativo").max(60, "Demasiadas"),
    pace1km: z
      .string()
      .trim()
      .regex(/^[0-9]{1,2}:[0-5][0-9]$/, "Formato MM:SS (ej. 4:15)"),
    frequency: z.coerce.number().int().min(0).max(7),
    injuries: z.string().trim().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  }),
  z.object({
    daysPerWeek: z.coerce.number().int().min(1, "Mínimo 1 día").max(7, "Máximo 7 días"),
    gymAccess: z.enum(["si", "no"], { required_error: "Selecciona una opción" }),
    equipment: z.array(z.string()).min(1, "Selecciona al menos uno"),
  }),
  z.object({
    examDate: z.string().min(1, "Selecciona una fecha"),
    targetScore: z.enum(["aprobar", "buena_nota", "top"], {
      required_error: "Selecciona un objetivo",
    }),
    weaknesses: z.array(z.string()).min(1, "Selecciona al menos una"),
  }),
];

type FormData = {
  age: string;
  height: string;
  weight: string;
  pullups: string;
  pace1km: string;
  frequency: string;
  injuries: string;
  daysPerWeek: string;
  gymAccess: string;
  equipment: string[];
  examDate: string;
  targetScore: string;
  weaknesses: string[];
};

const initialData: FormData = {
  age: "",
  height: "",
  weight: "",
  pullups: "",
  pace1km: "",
  frequency: "",
  injuries: "",
  daysPerWeek: "",
  gymAccess: "",
  equipment: [],
  examDate: "",
  targetScore: "",
  weaknesses: [],
};

const steps = [
  { icon: User, title: "Información personal", subtitle: "Para calibrar tu IA" },
  { icon: Activity, title: "Nivel físico actual", subtitle: "Tus marcas de partida" },
  { icon: CalendarDays, title: "Disponibilidad", subtitle: "Cuándo y cómo entrenas" },
  { icon: Target, title: "Objetivo", subtitle: "Hacia dónde vamos" },
];

const EQUIPMENT_OPTIONS = [
  "Barra de dominadas",
  "Mancuernas",
  "Bandas elásticas",
  "Pista de atletismo",
  "Cinta de correr",
  "Solo peso corporal",
];

const WEAKNESS_OPTIONS = [
  "Dominadas",
  "Carrera de resistencia",
  "Velocidad / sprint",
  "Circuito de agilidad",
  "Press de banca",
  "Natación",
];

/* ---------------- Component ---------------- */

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const toggleArray = (key: "equipment" | "weaknesses", value: string) => {
    setData((d) => {
      const set = new Set(d[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...d, [key]: Array.from(set) };
    });
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validateStep = (): boolean => {
    const schema = stepSchemas[step];
    const result = schema.safeParse(data);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0] as string;
      if (path && !next[path]) next[path] = issue.message;
    }
    setErrors(next);
    return false;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < totalSteps - 1) {
      setDirection("forward");
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setDirection("back");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate AI plan generation
    await new Promise((r) => setTimeout(r, 2200));
    navigate({ to: "/dashboard" });
  };

  if (submitting) {
    return <GeneratingScreen />;
  }

  const StepIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[700px] -z-10 rounded-full blur-3xl opacity-40 animate-pulse-glow"
        style={{ background: "var(--gradient-glow)" }}
      />

      <header className="px-4 py-5 max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Salir
        </Link>
      </header>

      <main className="px-4 pt-6 pb-16 max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-muted-foreground">
              PASO {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(progress)}% completado
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />

          {/* Step indicators */}
          <div className="mt-5 flex items-center justify-between gap-2">
            {steps.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div key={s.title} className="flex-1 flex items-center gap-2 min-w-0">
                  <div
                    className={`h-7 w-7 shrink-0 rounded-full grid place-items-center text-[10px] font-semibold transition-all duration-300 ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : active
                          ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] scale-110"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`hidden sm:block text-xs truncate transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div
          key={step}
          className={`glass rounded-3xl p-6 md:p-10 shadow-[var(--shadow-elegant)] ${
            direction === "forward" ? "animate-fade-up" : "animate-fade-up"
          }`}
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)]">
              <StepIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {steps[step].title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {steps[step].subtitle}
              </p>
            </div>
          </div>

          {step === 0 && <Step1 data={data} update={update} errors={errors} />}
          {step === 1 && <Step2 data={data} update={update} errors={errors} />}
          {step === 2 && (
            <Step3
              data={data}
              update={update}
              errors={errors}
              toggleArray={toggleArray}
            />
          )}
          {step === 3 && (
            <Step4
              data={data}
              update={update}
              errors={errors}
              toggleArray={toggleArray}
            />
          )}

          <div className="mt-10 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className="disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={handleNext}
              className="group min-w-[180px]"
            >
              {step === totalSteps - 1 ? (
                <>
                  <Sparkles className="h-4 w-4" /> Generar Mi Plan
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Step components ---------------- */

type StepProps = {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Record<string, string>;
};

type StepArrayProps = StepProps & {
  toggleArray: (key: "equipment" | "weaknesses", value: string) => void;
};

function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      {hint && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Step1({ data, update, errors }: StepProps) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      <Field label="Edad" htmlFor="age" error={errors.age} hint="Años">
        <Input
          id="age"
          type="number"
          inputMode="numeric"
          placeholder="25"
          value={data.age}
          onChange={(e) => update("age", e.target.value)}
        />
      </Field>
      <Field label="Altura" htmlFor="height" error={errors.height} hint="cm">
        <Input
          id="height"
          type="number"
          inputMode="numeric"
          placeholder="178"
          value={data.height}
          onChange={(e) => update("height", e.target.value)}
        />
      </Field>
      <Field label="Peso" htmlFor="weight" error={errors.weight} hint="kg">
        <Input
          id="weight"
          type="number"
          inputMode="decimal"
          placeholder="74"
          value={data.weight}
          onChange={(e) => update("weight", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step2({ data, update, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-5">
        <Field
          label="Dominadas máximas"
          htmlFor="pullups"
          error={errors.pullups}
          hint="Repeticiones seguidas"
        >
          <Input
            id="pullups"
            type="number"
            inputMode="numeric"
            placeholder="8"
            value={data.pullups}
            onChange={(e) => update("pullups", e.target.value)}
          />
        </Field>
        <Field
          label="Tiempo en 1km"
          htmlFor="pace1km"
          error={errors.pace1km}
          hint="MM:SS"
        >
          <Input
            id="pace1km"
            type="text"
            placeholder="4:15"
            value={data.pace1km}
            onChange={(e) => update("pace1km", e.target.value)}
          />
        </Field>
        <Field
          label="Frecuencia actual"
          htmlFor="frequency"
          error={errors.frequency}
          hint="Días / semana"
        >
          <Input
            id="frequency"
            type="number"
            inputMode="numeric"
            placeholder="3"
            value={data.frequency}
            onChange={(e) => update("frequency", e.target.value)}
          />
        </Field>
      </div>
      <Field
        label="Lesiones o limitaciones"
        htmlFor="injuries"
        error={errors.injuries}
        hint="Opcional. Cuéntanos brevemente."
      >
        <Input
          id="injuries"
          type="text"
          placeholder="Ej. tendinitis rotuliana ocasional"
          maxLength={500}
          value={data.injuries}
          onChange={(e) => update("injuries", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step3({ data, update, errors, toggleArray }: StepArrayProps) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Días por semana"
          htmlFor="daysPerWeek"
          error={errors.daysPerWeek}
          hint="Días que puedes entrenar"
        >
          <Input
            id="daysPerWeek"
            type="number"
            inputMode="numeric"
            placeholder="4"
            min={1}
            max={7}
            value={data.daysPerWeek}
            onChange={(e) => update("daysPerWeek", e.target.value)}
          />
        </Field>
        <Field label="Acceso a gimnasio" error={errors.gymAccess}>
          <Select
            value={data.gymAccess}
            onValueChange={(v) => update("gymAccess", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="si">Sí, tengo gimnasio</SelectItem>
              <SelectItem value="no">No, entreno en casa / aire libre</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Material disponible" error={errors.equipment}>
        <div className="grid sm:grid-cols-2 gap-2">
          {EQUIPMENT_OPTIONS.map((opt) => (
            <ChipCheckbox
              key={opt}
              label={opt}
              checked={data.equipment.includes(opt)}
              onChange={() => toggleArray("equipment", opt)}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}

function Step4({ data, update, errors, toggleArray }: StepArrayProps) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Fecha del examen"
          htmlFor="examDate"
          error={errors.examDate}
        >
          <Input
            id="examDate"
            type="date"
            min={today}
            value={data.examDate}
            onChange={(e) => update("examDate", e.target.value)}
          />
        </Field>
        <Field label="Nota objetivo" error={errors.targetScore}>
          <Select
            value={data.targetScore}
            onValueChange={(v) => update("targetScore", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aprobar">Aprobar (APTO)</SelectItem>
              <SelectItem value="buena_nota">Buena nota</SelectItem>
              <SelectItem value="top">Top del tribunal</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Tus puntos débiles" error={errors.weaknesses}>
        <div className="grid sm:grid-cols-2 gap-2">
          {WEAKNESS_OPTIONS.map((opt) => (
            <ChipCheckbox
              key={opt}
              label={opt}
              checked={data.weaknesses.includes(opt)}
              onChange={() => toggleArray("weaknesses", opt)}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}

function ChipCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
        checked
          ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_var(--primary)]"
          : "border-border bg-secondary/30 hover:border-primary/30 hover:bg-secondary/60"
      }`}
    >
      <span
        className={`h-4 w-4 shrink-0 rounded-[5px] border grid place-items-center transition-colors ${
          checked
            ? "bg-primary border-primary text-primary-foreground"
            : "border-border bg-background/40 group-hover:border-primary/50"
        }`}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ---------------- Generating screen ---------------- */

function GeneratingScreen() {
  const lines = [
    "Analizando tu nivel actual…",
    "Calibrando mesociclo de 12 semanas…",
    "Ajustando carga, dominadas y carrera…",
    "Preparando tu plan personalizado…",
  ];
  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] -z-10 rounded-full blur-3xl opacity-50 animate-pulse-glow"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="text-center max-w-md animate-fade-up">
        <div className="relative inline-grid place-items-center mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse-glow" />
          <div className="relative h-20 w-20 rounded-3xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)]">
            <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Generando tu <span className="text-gradient">plan élite</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          La IA está construyendo tu mesociclo. Esto solo tarda unos segundos.
        </p>
        <ul className="mt-8 space-y-2 text-left">
          {lines.map((l, i) => (
            <li
              key={l}
              className="glass rounded-xl px-4 py-2.5 text-sm flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 0.4}s`, animationFillMode: "both" }}
            >
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
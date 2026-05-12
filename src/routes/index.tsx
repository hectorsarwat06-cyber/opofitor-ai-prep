import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import {
  PullupsCard,
  PaceCard,
  FatigueCard,
  WeeklyPlanCard,
} from "@/components/landing/Mockups";
import heroAthlete from "@/assets/hero-athlete.jpg";
import {
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Zap,
  AlertTriangle,
  TrendingDown,
  HeartPulse,
  Brain,
  LineChart,
  RefreshCw,
  ShieldCheck,
  Dumbbell,
  Timer,
  Flame,
  Activity,
  Star,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "opoFITor — Aprueba las físicas de Policía Nacional con IA" },
      {
        name: "description",
        content:
          "Planes de entrenamiento personalizados con IA para aprobar las pruebas físicas de la Policía Nacional. Adaptación semanal, dominadas, carrera y control de fatiga.",
      },
      { property: "og:title", content: "opoFITor — Entrenamiento IA para Policía Nacional" },
      {
        property: "og:description",
        content: "Planes personalizados según tu nivel, progreso y fecha de examen.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <SocialProof />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      {/* background */}
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[400px] w-[700px] -z-10 rounded-full blur-3xl opacity-50 animate-pulse-glow"
        style={{ background: "var(--gradient-glow)" }} />

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Entrenamiento IA · Convocatoria 2025</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Aprueba las físicas de{" "}
              <span className="text-gradient">Policía Nacional</span> con IA.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Planes personalizados según tu nivel, progreso y fecha de examen.
              Entrena como un atleta de élite — sin entrenadores caros.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" className="group">
                Empieza Gratis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Button>
              <Button variant="glass" size="xl">
                <Play className="h-4 w-4" /> Ver Cómo Funciona
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-primary/20" />
                ))}
              </div>
              <span>+1.200 opositores entrenando</span>
            </div>
          </div>

          {/* visual */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-6 rounded-3xl opacity-60 blur-2xl"
              style={{ background: "var(--gradient-glow)" }} />
            <div className="relative rounded-3xl overflow-hidden border border-border glow-ring">
              <img
                src={heroAthlete}
                alt="Atleta entrenando para oposiciones de Policía Nacional"
                width={1024}
                height={1024}
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </div>

            {/* floating mockups */}
            <div className="absolute -left-4 md:-left-10 bottom-10 w-56 animate-float">
              <PullupsCard />
            </div>
            <div className="absolute -right-4 md:-right-8 top-10 w-52 animate-float" style={{ animationDelay: "1.5s" }}>
              <FatigueCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */
function Stats() {
  const stats = [
    { v: "94%", l: "Mejora de marcas en 8 semanas" },
    { v: "1.2k+", l: "Opositores activos" },
    { v: "+250%", l: "Progresión media en dominadas" },
    { v: "4.9★", l: "Valoración media" },
  ];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.l} className="text-center md:text-left">
              <p className="text-3xl md:text-4xl font-display font-bold text-gradient">{s.v}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROBLEM ---------------- */
function Problem() {
  const items = [
    {
      icon: AlertTriangle,
      title: "Entrenamientos sin planificación",
      desc: "Rutinas copiadas de internet sin progresión ni adaptación a tu fecha de examen.",
    },
    {
      icon: TrendingDown,
      title: "Estancamiento en dominadas y carrera",
      desc: "Semanas sin mejorar marcas porque no sabes cuándo cargar y cuándo descargar.",
    },
    {
      icon: HeartPulse,
      title: "Lesiones y sobrecarga",
      desc: "Entrenas demasiado o demasiado poco. Sin control de fatiga, llegas roto al examen.",
    },
  ];
  return (
    <section id="problema" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">El problema</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            La mayoría de opositores <span className="text-gradient">entrena mal.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.title} className="group glass rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center mb-5 group-hover:bg-primary/20 transition">
                <it.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SOLUTION ---------------- */
function Solution() {
  const points = [
    { icon: Brain, t: "IA genera tu planificación" },
    { icon: LineChart, t: "Seguimiento de progreso real" },
    { icon: RefreshCw, t: "Adaptación semanal automática" },
    { icon: ShieldCheck, t: "Específico para Policía Nacional" },
  ];
  return (
    <section id="solucion" className="py-24 relative">
      <div className="absolute top-0 right-0 h-[500px] w-[500px] -z-10 rounded-full blur-3xl opacity-30"
        style={{ background: "var(--gradient-glow)" }} />
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">La solución</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              opoFITor adapta tu preparación{" "}
              <span className="text-gradient">automáticamente.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Una IA entrenada con metodología de oposiciones físicas. Diseña, mide y ajusta tu plan cada semana en función de tus marcas reales.
            </p>
            <ul className="space-y-3">
              {points.map((p) => (
                <li key={p.t} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/15 grid place-items-center">
                    <p.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{p.t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* dashboard mockup */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative glass rounded-3xl p-5 shadow-[var(--shadow-elegant)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Buenas tardes, Marco</p>
                  <p className="font-display font-bold text-lg">Tu plan de hoy</p>
                </div>
                <div className="glass rounded-full px-3 py-1 text-xs">Semana 6/12</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <PullupsCard />
                <PaceCard />
                <FatigueCard />
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Hoy</p>
                  <p className="text-lg font-display font-bold mt-1">Carrera 5x1000</p>
                  <div className="mt-3 space-y-1.5">
                    {["Calentamiento 10'", "5 x 1000m @ 3:50", "Vuelta calma 8'"].map((x) => (
                      <div key={x} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-primary" /> {x}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <WeeklyPlanCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    { n: "01", icon: Target, t: "Evalúa tu nivel", d: "Test inicial de marcas y movilidad para calibrar la IA." },
    { n: "02", icon: Brain, t: "Recibe tu plan personalizado", d: "Plan semanal adaptado a tu fecha de examen y tus puntos débiles." },
    { n: "03", icon: Activity, t: "Registra tus entrenamientos", d: "Marca series, repeticiones y sensaciones en segundos." },
    { n: "04", icon: ShieldCheck, t: "Mejora hasta el APTO", d: "Adaptación automática hasta superar todas las pruebas físicas." },
  ];
  return (
    <section id="funciona" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Cómo funciona</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            De cero al <span className="text-gradient">APTO</span> en 4 pasos.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s) => (
            <div key={s.n} className="relative glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)]">
                  <s.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="font-semibold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const items = [
    { icon: Brain, t: "Planificación inteligente", d: "IA que entiende mesociclos, picos y descargas." },
    { icon: Dumbbell, t: "Progresión de dominadas", d: "Sistema progresivo de fuerza-resistencia específico." },
    { icon: Timer, t: "Entrenamiento de carrera", d: "Series, fartlek y tirada larga calibrados a tu ritmo." },
    { icon: Flame, t: "Control de fatiga", d: "Score diario para evitar sobreentrenamiento." },
    { icon: RefreshCw, t: "Adaptación automática", d: "El plan se reescribe cada semana según tus datos." },
    { icon: LineChart, t: "Seguimiento de marcas", d: "Histórico visual de cada prueba oficial." },
  ];
  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Features</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Todo lo que necesitas para <span className="text-gradient">superar el tribunal.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.t} className="group relative glass rounded-2xl p-6 overflow-hidden hover:border-primary/40 transition-all duration-300">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center mb-5 group-hover:bg-primary/20 transition">
                  <it.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{it.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SOCIAL PROOF ---------------- */
function SocialProof() {
  const testimonials = [
    {
      name: "Marco R.",
      role: "Opositor · Madrid",
      text: "Pasé de 4 a 14 dominadas en 3 meses. El plan se adapta solo cuando tengo días malos.",
    },
    {
      name: "Laura G.",
      role: "Opositora · Sevilla",
      text: "Saqué APTO con holgura. Lo mejor: dejas de pensar qué hacer cada día.",
    },
    {
      name: "Iván P.",
      role: "Opositor · Valencia",
      text: "Llevaba 6 meses estancado en carrera. En 5 semanas bajé 25 segundos en 1000m.",
    },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Opositores reales</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Resultados que se <span className="text-gradient">aprueban.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary/20" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative rounded-3xl overflow-hidden glass p-10 md:p-16 text-center">
          <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-glow)" }} />
          <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
          <Zap className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Empieza hoy tu <span className="text-gradient">preparación inteligente.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Sin tarjeta. Sin compromisos. Tu primer plan personalizado listo en 60 segundos.
          </p>
          <Button variant="hero" size="xl" className="group">
            Generar Mi Plan
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
                <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg">opo<span className="text-primary">FIT</span>or</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs">
              Entrenamiento IA para opositores de Policía Nacional.
            </p>
            <div className="flex gap-2 mt-5">
              {[Twitter, Instagram, Youtube].map((I, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-lg glass grid place-items-center hover:bg-primary/15 transition">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-4">Producto</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#funciona" className="hover:text-foreground">Cómo funciona</a></li>
              <li><a href="#" className="hover:text-foreground">Precios</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Términos</a></li>
              <li><a href="#" className="hover:text-foreground">Privacidad</a></li>
              <li><a href="mailto:hola@opofitor.es" className="hover:text-foreground">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2025 opoFITor. Todos los derechos reservados.</p>
          <p>Hecho con disciplina en España 🇪🇸</p>
        </div>
      </div>
    </footer>
  );
}

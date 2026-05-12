import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Sparkles } from "lucide-react";

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

function Onboarding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <header className="px-4 py-6 max-w-3xl mx-auto flex items-center justify-between">
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
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </header>

      <main className="px-4 pt-12 pb-24 max-w-3xl mx-auto animate-fade-up">
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Paso 1 de 4</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          Vamos a crear tu{" "}
          <span className="text-gradient">plan personalizado.</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl">
          Cuéntanos tu nivel actual y tu fecha de examen. La IA generará tu primer
          mesociclo en menos de 60 segundos.
        </p>

        <div className="mt-10 glass rounded-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            🚧 El cuestionario completo estará disponible muy pronto.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/">Volver a la home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
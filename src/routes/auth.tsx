import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield, Loader2, Mail, Lock, ArrowRight, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceder — opoFITor" },
      { name: "description", content: "Inicia sesión o regístrate en opoFITor." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Email no válido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/onboarding` },
        });
        if (error) throw error;
        toast.success("Cuenta creada. ¡Bienvenido!");
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Sesión iniciada");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de autenticación";
      toast.error(
        msg.includes("Invalid login")
          ? "Correo o contraseña incorrectos"
          : msg.includes("already registered")
            ? "Este correo ya está registrado. Por favor, inicia sesión"
            : msg,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative grid place-items-center px-4">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[700px] -z-10 rounded-full blur-3xl opacity-40 animate-pulse-glow"
        style={{ background: "var(--gradient-glow)" }} />

      <div className="w-full max-w-md animate-fade-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight text-xl">
            opo<span className="text-primary">FIT</span>or
          </span>
        </Link>

        <div className="glass rounded-2xl p-7 shadow-[var(--shadow-elegant)]">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login"><LogIn className="h-3.5 w-3.5 mr-1.5" /> Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup"><UserPlus className="h-3.5 w-3.5 mr-1.5" /> Registrarse</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <h1 className="text-2xl font-display font-bold tracking-tight">
                {tab === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {tab === "login"
                  ? "Accede para continuar tu macrociclo."
                  : "Empieza tu plan personalizado en 30 segundos."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5 text-primary" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="flex items-center gap-1.5 text-xs">
                  <Lock className="h-3.5 w-3.5 text-primary" /> Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 h-11"
                  required
                  minLength={6}
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Mínimo 6 caracteres.
                </p>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Procesando…</>
                ) : tab === "login" ? (
                  <>Entrar <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Crear cuenta <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {tab === "login" ? (
                <>¿Sin cuenta?{" "}
                  <button type="button" className="text-primary hover:underline" onClick={() => setTab("signup")}>
                    Crea una ahora
                  </button>
                </>
              ) : (
                <>¿Ya tienes cuenta?{" "}
                  <button type="button" className="text-primary hover:underline" onClick={() => setTab("login")}>
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
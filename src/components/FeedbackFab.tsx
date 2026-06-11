import { useState } from "react";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FeedbackFab() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"error" | "sugerencia">("sugerencia");
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);

  if (!user) return null;

  const submit = async () => {
    const text = mensaje.trim();
    if (text.length < 5) {
      toast.error("Cuéntanos un poco más (mínimo 5 caracteres).");
      return;
    }
    if (text.length > 1000) {
      toast.error("El mensaje no puede superar 1000 caracteres.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("app_feedback").insert({
      user_id: user.id,
      tipo,
      mensaje: text,
    });
    setSending(false);
    if (error) {
      toast.error("No se pudo enviar tu mensaje. Inténtalo de nuevo.");
      return;
    }
    toast.success("¡Gracias! Hemos recibido tu feedback.");
    setMensaje("");
    setTipo("sugerencia");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Enviar sugerencia"
        className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] grid place-items-center hover:scale-105 transition-transform"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buzón de sugerencias</DialogTitle>
            <DialogDescription>
              Tu opinión nos ayuda a mejorar opoFITor. Cuéntanos qué te ha pasado o qué echas en falta.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Tipo</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([
                  { v: "error", label: "Error en la app" },
                  { v: "sugerencia", label: "Sugerencia de mejora" },
                ] as const).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setTipo(o.v)}
                    className={`h-11 rounded-lg border text-sm font-medium transition-all ${
                      tipo === o.v
                        ? "bg-[image:var(--gradient-primary)] border-primary text-primary-foreground"
                        : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="fb-msg" className="text-xs uppercase tracking-widest text-muted-foreground">
                Mensaje
              </Label>
              <Textarea
                id="fb-msg"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                maxLength={1000}
                rows={5}
                placeholder="Describe el problema o tu idea con todo el detalle que quieras…"
                className="mt-1.5"
              />
              <p className="mt-1 text-[10px] text-muted-foreground text-right">{mensaje.length}/1000</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={sending}>
              Cancelar
            </Button>
            <Button variant="hero" onClick={submit} disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {sending ? "Enviando…" : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
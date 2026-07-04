import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  construirPlanSemanal,
  type PlanSemanal,
  type PerfilUsuario,
  type EvaluacionInicial,
  type LogEntrenamiento,
  type Genero,
  type DiaSemana,
} from "@/lib/training-engine";

interface UseTrainingPlanResult {
  loading: boolean;
  error: string | null;
  perfil: PerfilUsuario | null;
  evaluacion: EvaluacionInicial | null;
  plan: PlanSemanal | null;
  semana: number;
  needsInitialTest: boolean;
}

function calcularSemana(): number {
  try {
    const iso =
      localStorage.getItem("opofitor_macrocycle_start") ||
      localStorage.getItem("opofitor_start_date");
    if (!iso) return 1;
    const start = new Date(iso).getTime();
    const diff = Date.now() - start;
    return Math.max(1, Math.floor(diff / (86400000 * 7)) + 1);
  } catch {
    return 1;
  }
}

export function useTrainingPlan(): UseTrainingPlanResult {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [evaluacion, setEvaluacion] = useState<EvaluacionInicial | null>(null);
  const [logs, setLogs] = useState<LogEntrenamiento[]>([]);
  const semana = useMemo(() => calcularSemana(), []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        const limitDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        const [perfilRes, evalRes, logsRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("genero, dias_disponibles, fecha_examen")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("evaluaciones")
            .select("tiempo_1000m, max_dominadas, fuerza_tren_superior, tiempo_agilidad, vam_estimada")
            .eq("user_id", user.id)
            .order("fecha_test", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("entrenamientos_log")
            .select("tipo_sesion, rpe_sesion, fecha_sesion")
            .eq("user_id", user.id)
            .gte("fecha_sesion", limitDate)
            .order("fecha_sesion", { ascending: false }),
        ]);
        if (cancel) return;

        const p: PerfilUsuario = {
          genero: (perfilRes.data?.genero as Genero | null) ?? null,
          dias_disponibles: (perfilRes.data?.dias_disponibles as DiaSemana[] | null) ?? ["L", "X", "V"],
          fecha_examen: perfilRes.data?.fecha_examen ?? null,
        };
        setPerfil(p);

        if (evalRes.data) {
          const fuerza =
            evalRes.data.fuerza_tren_superior != null
              ? Number(evalRes.data.fuerza_tren_superior)
              : evalRes.data.max_dominadas != null
                ? Number(evalRes.data.max_dominadas)
                : null;
          setEvaluacion({
            tiempo_1000m: evalRes.data.tiempo_1000m,
            fuerza_tren_superior: fuerza,
            tiempo_agilidad:
              evalRes.data.tiempo_agilidad != null ? Number(evalRes.data.tiempo_agilidad) : null,
            vam_estimada:
              evalRes.data.vam_estimada != null ? Number(evalRes.data.vam_estimada) : null,
          });
        } else {
          setEvaluacion(null);
        }
        setLogs(
          (logsRes.data ?? []).map((l) => ({
            tipo_sesion: l.tipo_sesion,
            rpe_sesion: l.rpe_sesion,
            fecha_sesion: l.fecha_sesion,
          })),
        );
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando el plan");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [user, authLoading]);

  const plan = useMemo<PlanSemanal | null>(() => {
    if (!perfil || !evaluacion) return null;
    try {
      return construirPlanSemanal({
        perfil,
        evaluacion,
        logsSemanaAnterior: logs,
        semana,
      });
    } catch (e) {
      console.error("[training-engine] error generando plan", e);
      return null;
    }
  }, [perfil, evaluacion, logs, semana]);

  const needsInitialTest =
    !loading && !authLoading && !!user && (
      !evaluacion ||
      !evaluacion.tiempo_1000m ||
      evaluacion.fuerza_tren_superior == null ||
      !perfil?.genero
    );

  return {
    loading: loading || authLoading,
    error,
    perfil,
    evaluacion,
    plan,
    semana,
    needsInitialTest,
  };
}

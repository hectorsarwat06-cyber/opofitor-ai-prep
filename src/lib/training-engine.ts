// Motor de periodización deportiva para opoFITor.
// Genera prescripciones individualizadas a partir del perfil del usuario,
// la última evaluación física y el historial reciente de RPE.

export type Genero = "Hombre" | "Mujer";
export type DiaSemana = "L" | "M" | "X" | "J" | "V" | "S" | "D";

export const DIAS_ORDEN: DiaSemana[] = ["L", "M", "X", "J", "V", "S", "D"];
export const DIAS_NOMBRE: Record<DiaSemana, string> = {
  L: "Lunes",
  M: "Martes",
  X: "Miércoles",
  J: "Jueves",
  V: "Viernes",
  S: "Sábado",
  D: "Domingo",
};

export interface PerfilUsuario {
  genero: Genero | null;
  dias_disponibles: DiaSemana[] | string[] | null;
  fecha_examen: string | null;
}

export interface EvaluacionInicial {
  tiempo_1000m: string; // "MM:SS"
  fuerza_tren_superior: number | null;
  tiempo_agilidad: number | null;
  vam_estimada: number | null;
}

export interface LogEntrenamiento {
  tipo_sesion: string;
  rpe_sesion: number;
  fecha_sesion?: string;
}

export type TipoSesion =
  | "Fuerza"
  | "Resistencia"
  | "Agilidad"
  | "Movilidad"
  | "Descanso";

export interface PrescripcionItem {
  ejercicio: string;
  detalle: string;
  observacion?: string;
}

export interface SesionPrescrita {
  dia: DiaSemana;
  diaNombre: string;
  tipo: TipoSesion;
  titulo: string;
  resumen: string;
  tag: string;
  duracionMin: number;
  bloques: PrescripcionItem[];
  ajusteRPE?: string;
}

// ---- Utilidades ----
function parseTime(mmss: string | null | undefined): number {
  if (!mmss) return 0;
  const [m, s] = mmss.split(":").map((v) => parseInt(v, 10));
  if (Number.isNaN(m) || Number.isNaN(s)) return 0;
  return m * 60 + s;
}

function fmtPace(secPerKm: number): string {
  if (!isFinite(secPerKm) || secPerKm <= 0) return "—";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")} min/km`;
}

function fmtSeg(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return "—";
  if (sec < 60) return `${sec.toFixed(0)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function calcularVAM(tiempo1000m: string): number {
  const sec = parseTime(tiempo1000m);
  if (sec <= 0) return 0;
  return Math.round((3600 / sec) * 10) / 10;
}

function tiempoSerieDistancia(distM: number, pctVAM: number, vam: number): number {
  if (vam <= 0) return 0;
  const velMs = ((vam * pctVAM) / 100) / 3.6;
  return distM / velMs;
}

function paceMinPerKm(pctVAM: number, vam: number): number {
  if (vam <= 0) return 0;
  return 3600 / ((vam * pctVAM) / 100);
}

// ---- Ajuste por RPE ----
export interface AjusteCarga {
  factorVolumen: number;
  deltaRIR: number;
  mensaje: string;
}

export function analizarRPE(logs: LogEntrenamiento[]): AjusteCarga {
  if (!logs.length) {
    return { factorVolumen: 1, deltaRIR: 0, mensaje: "Semana base – sin historial previo." };
  }
  const media = logs.reduce((a, b) => a + b.rpe_sesion, 0) / logs.length;
  if (media < 6) {
    return {
      factorVolumen: 1.15,
      deltaRIR: -1,
      mensaje: `RPE medio ${media.toFixed(1)} bajo → +15% volumen y RIR-1.`,
    };
  }
  if (media >= 9) {
    return {
      factorVolumen: 0.85,
      deltaRIR: +1,
      mensaje: `RPE medio ${media.toFixed(1)} muy alto → micro-descarga (-15% volumen).`,
    };
  }
  return {
    factorVolumen: 1,
    deltaRIR: 0,
    mensaje: `RPE medio ${media.toFixed(1)} óptimo → progresión lineal.`,
  };
}

// ---- Fuerza ----
export function prescribirFuerza(
  perfil: PerfilUsuario,
  ev: EvaluacionInicial,
  ajuste: AjusteCarga,
): PrescripcionItem[] {
  const genero = perfil.genero ?? "Hombre";
  const rm = ev.fuerza_tren_superior ?? 0;
  const baseSeries = Math.max(3, Math.round(4 * ajuste.factorVolumen));
  const rir = Math.max(0, 2 + ajuste.deltaRIR);

  if (genero === "Mujer") {
    if (rm < 45) {
      const iso = Math.max(8, Math.round(rm * 0.45));
      return [
        {
          ejercicio: "Suspensión isométrica en barra",
          detalle: `${baseSeries} series × ${iso}s (≈45% de tu RM ${rm}s)`,
          observacion: "Pecho elevado, escápulas retraídas. Descanso 2'.",
        },
        {
          ejercicio: "Dominada excéntrica lenta",
          detalle: `${baseSeries} series × 5 reps (bajada 5s)`,
          observacion: "Sube con ayuda de cajón, controla la bajada.",
        },
        { ejercicio: "Remo invertido (TRX o barra baja)", detalle: `3 series × 10 reps – RIR ${rir}` },
      ];
    }
    const iso = Math.round(rm * 0.65);
    return [
      {
        ejercicio: "Isometría con lastre",
        detalle: `${baseSeries} series × ${iso}s (≈65% de tu RM ${rm}s) – RIR ${rir}`,
        observacion: "Añade 2.5 kg si completas las series con holgura.",
      },
      { ejercicio: "Acumulación isométrica", detalle: "4 micro-series × 10s con 10s rec.", observacion: "Tolerancia a la fatiga específica del baremo." },
      { ejercicio: "Remo invertido lastrado", detalle: `3 series × 8 reps – RIR ${rir}` },
    ];
  }

  if (rm < 8) {
    return [
      {
        ejercicio: "Dominada excéntrica",
        detalle: `${baseSeries} series × 3 reps (bajada 4s) – RIR ${Math.max(3, rir + 1)}`,
        observacion: "Sube ayudado por cajón o salto, controla 4s la bajada.",
      },
      { ejercicio: "Isometría en barra (barbilla por encima)", detalle: `${baseSeries} series × 15s` },
      { ejercicio: "Remo invertido", detalle: `3 series × 8 reps – RIR ${rir + 1}`, observacion: "Eleva los pies para progresar." },
    ];
  }
  const reps = Math.max(3, Math.round(rm * 0.55));
  return [
    {
      ejercicio: "Dominada estricta (volumen submáximo)",
      detalle: `${baseSeries + 1} series × ${reps} reps (≈55% de ${rm} RM) – RIR ${rir}`,
      observacion: "Subida explosiva, bajada controlada 2s.",
    },
    {
      ejercicio: "Dominada lastrada",
      detalle: `4 series × 3 reps con +2.5 kg progresivo – RIR ${rir}`,
      observacion: "Si las 4 series salen limpias, sube 2.5 kg la próxima semana.",
    },
    { ejercicio: "Remo pendlay", detalle: `3 series × 6 reps – RIR ${rir}` },
  ];
}

// ---- Resistencia ----
export type TipoResistencia = "umbral" | "potencia" | "capacidad";

export function prescribirResistencia(
  ev: EvaluacionInicial,
  tipo: TipoResistencia,
  ajuste: AjusteCarga,
): PrescripcionItem[] {
  const vam = ev.vam_estimada && ev.vam_estimada > 0 ? ev.vam_estimada : calcularVAM(ev.tiempo_1000m);
  if (vam <= 0) return [{ ejercicio: "Carrera continua", detalle: "30 min en zona aeróbica suave" }];

  if (tipo === "umbral") {
    const pct = 88;
    const duracion = Math.max(15, Math.round(25 * ajuste.factorVolumen));
    return [
      {
        ejercicio: "Rodaje a umbral aeróbico",
        detalle: `${duracion} min continuos al ${pct}% VAM (${fmtPace(paceMinPerKm(pct, vam))})`,
        observacion: `VAM de referencia: ${vam.toFixed(1)} km/h.`,
      },
    ];
  }
  if (tipo === "potencia") {
    const series = Math.max(4, Math.round(6 * ajuste.factorVolumen));
    const pct = 105;
    const t = tiempoSerieDistancia(400, pct, vam);
    return [
      {
        ejercicio: `Series cortas ${series}×400m`,
        detalle: `${pct}% VAM – objetivo ${fmtSeg(t)} por 400m (${fmtPace(paceMinPerKm(pct, vam))})`,
        observacion: `Recuperación 1:1 (≈${fmtSeg(t)} trote suave).`,
      },
    ];
  }
  const series = Math.max(3, Math.round(5 * ajuste.factorVolumen));
  const pct = 95;
  const t = tiempoSerieDistancia(1000, pct, vam);
  return [
    {
      ejercicio: `Series largas ${series}×1000m`,
      detalle: `${pct}% VAM – objetivo ${fmtSeg(t)} por 1000m (${fmtPace(paceMinPerKm(pct, vam))})`,
      observacion: "Recuperación 90s trote.",
    },
  ];
}

// ---- Agilidad / movilidad ----
export function prescribirAgilidad(ev: EvaluacionInicial): PrescripcionItem[] {
  const ref = ev.tiempo_agilidad ? `Tiempo de referencia: ${ev.tiempo_agilidad.toFixed(2)}s.` : undefined;
  return [
    { ejercicio: "Técnica de apoyos", detalle: "4 × escalera de coordinación (in-in-out-out, icky shuffle)" },
    { ejercicio: "Salidas y aceleraciones", detalle: "6 × 10m desde posición baja (recup. completa)", observacion: ref },
    { ejercicio: "Giros 180°", detalle: "4 series × 6 cambios de dirección sobre conos" },
    { ejercicio: "Pliometría de baja intensidad", detalle: "3 × 10 pogo jumps + 3 × 8 bounds" },
  ];
}

export function prescribirMovilidad(): PrescripcionItem[] {
  return [
    { ejercicio: "Movilidad de tobillo", detalle: "3 × 10 dorsiflexiones en pared (cada lado)" },
    { ejercicio: "Movilidad coxofemoral", detalle: "World's greatest stretch 2 × 6 + 90/90 hip switches 3 × 8" },
    { ejercicio: "CARs glenohumerales", detalle: "2 × 5 por brazo, control total del rango" },
    { ejercicio: "Respiración diafragmática", detalle: "5 minutos 4-7-8" },
  ];
}

// ---- Construcción semanal ----
function normalizarDias(perfil: PerfilUsuario): DiaSemana[] {
  const dd = (perfil.dias_disponibles ?? ["L", "X", "V"]) as string[];
  return DIAS_ORDEN.filter((d) => dd.includes(d));
}

function rotacionSesiones(n: number): TipoResistencia[] {
  const base: TipoResistencia[] = ["potencia", "umbral", "capacidad"];
  return Array.from({ length: n }, (_, i) => base[i % base.length]);
}

export function construirSesion(
  dia: DiaSemana,
  indice: number,
  perfil: PerfilUsuario,
  ev: EvaluacionInicial,
  ajuste: AjusteCarga,
  rot: TipoResistencia[],
): SesionPrescrita {
  const tipos: TipoSesion[] = ["Fuerza", "Resistencia", "Agilidad", "Resistencia", "Fuerza", "Agilidad", "Movilidad"];
  const tipo = tipos[indice % tipos.length];
  const nombre = DIAS_NOMBRE[dia];

  if (tipo === "Fuerza") {
    return {
      dia, diaNombre: nombre, tipo,
      titulo: "Fuerza específica – tren superior",
      resumen: "Trabajo de tracción individualizado al baremo del opositor.",
      tag: "Fuerza", duracionMin: 55,
      bloques: [...prescribirFuerza(perfil, ev, ajuste), ...prescribirMovilidad().slice(0, 1)],
      ajusteRPE: ajuste.mensaje,
    };
  }
  if (tipo === "Resistencia") {
    const res = rot[indice % rot.length];
    const titulos: Record<TipoResistencia, string> = {
      umbral: "Resistencia – Umbral aeróbico",
      potencia: "Resistencia – Potencia aeróbica (VAM)",
      capacidad: "Resistencia – Capacidad aeróbica",
    };
    return {
      dia, diaNombre: nombre, tipo,
      titulo: titulos[res],
      resumen: "Ritmos calculados sobre tu VAM real.",
      tag: res === "potencia" ? "VO₂máx" : res === "umbral" ? "Umbral" : "Capacidad",
      duracionMin: 50,
      bloques: prescribirResistencia(ev, res, ajuste),
      ajusteRPE: ajuste.mensaje,
    };
  }
  if (tipo === "Agilidad") {
    return {
      dia, diaNombre: nombre, tipo,
      titulo: "Circuito de agilidad y técnica",
      resumen: "Apoyos, salidas y pliometría suave para mejorar el circuito.",
      tag: "Agilidad", duracionMin: 45,
      bloques: prescribirAgilidad(ev),
    };
  }
  return {
    dia, diaNombre: nombre, tipo: "Movilidad",
    titulo: "Recuperación activa y movilidad",
    resumen: "Restaura tobillo y cadera, claves para los giros del circuito.",
    tag: "Movilidad", duracionMin: 30,
    bloques: prescribirMovilidad(),
  };
}

export interface PlanSemanal {
  semana: number;
  ajuste: AjusteCarga;
  vam: number;
  sesiones: SesionPrescrita[];
}

export function construirPlanSemanal(args: {
  perfil: PerfilUsuario;
  evaluacion: EvaluacionInicial;
  logsSemanaAnterior: LogEntrenamiento[];
  semana: number;
}): PlanSemanal {
  const ajuste = analizarRPE(args.logsSemanaAnterior ?? []);
  const diasActivos = normalizarDias(args.perfil);
  const rot = rotacionSesiones(Math.max(diasActivos.length, 1));
  const sesiones: SesionPrescrita[] = DIAS_ORDEN.map((dia) => {
    const idx = diasActivos.indexOf(dia);
    if (idx === -1) {
      return {
        dia, diaNombre: DIAS_NOMBRE[dia], tipo: "Descanso" as TipoSesion,
        titulo: "Descanso",
        resumen: "Día libre. Hidratación y sueño priorizados.",
        tag: "Off", duracionMin: 0, bloques: [],
      };
    }
    return construirSesion(dia, idx, args.perfil, args.evaluacion, ajuste, rot);
  });
  return {
    semana: args.semana,
    ajuste,
    vam: args.evaluacion.vam_estimada ?? calcularVAM(args.evaluacion.tiempo_1000m),
    sesiones,
  };
}

export function sesionDeHoy(plan: PlanSemanal): SesionPrescrita {
  const idx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  return plan.sesiones[idx];
}

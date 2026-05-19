# Motor de Periodización Deportiva — opoFITor

Construir un motor real de periodización que sustituya los datos simulados, diferencie por sexo y se ajuste semana a semana según el rendimiento registrado (RPE).

## 1. Base de datos (Supabase)

Migración nueva (no edita las existentes):

- `profiles`: añadir `genero TEXT CHECK (genero IN ('Hombre','Mujer'))`.
- `evaluaciones`:
  - añadir `tiempo_agilidad NUMERIC` (segundos).
  - añadir `fuerza_tren_superior NUMERIC` (reps para Hombre, segundos de suspensión para Mujer).
  - mantener `max_dominadas` por compatibilidad (nullable); el motor pasa a leer `fuerza_tren_superior`.

Las políticas RLS existentes (por `user_id` / `id`) ya cubren los nuevos campos.

## 2. Motor lógico — `src/lib/training-engine.ts`

Servicio puro (sin red) que recibe `{ profile, ultimaEvaluacion, logsSemanaAnterior, semana, dia }` y devuelve la sesión prescrita.

Submódulos:

- **Fuerza tren superior**
  - Hombre RM < 8 → fuerza base: excéntricas 4×3 (3-5"), isométricas 4×15", remo invertido 3×8, RIR 3-4.
  - Hombre RM ≥ 8 → volumen submáximo: 5 series al 50-60% del RM, o lastre progresivo +2,5 kg/sem.
  - Mujer RM < 45 s → isometrías 4×(40-50% RM), excéntricas 4×5" lentas, remo invertido 3×10.
  - Mujer RM ≥ 45 s → isometrías con lastre/tempo 4×(60-70% RM) + acumulación de fatiga.
  - Garantía: nunca prescribe reps > RM ni tiempos > RM.

- **Resistencia (VAM)**
  - `VAM (km/h) = 3600 / tiempo_1000m_segundos`.
  - Umbral: 20-30' al 85-90% VAM (pace min/km).
  - Potencia aeróbica: 6×400m al 105% VAM, recuperación 1:1.
  - Capacidad aeróbica: 5×1000m al 95% VAM.
  - Se devuelve ritmo `min:ss / km` y tiempo objetivo por serie.

- **Agilidad y movilidad**
  - Sesión técnica del circuito: apoyos, salidas 5 m, giros 180°, pliometría baja.
  - Rutina de movilidad de tobillo y cadera en calentamientos y días de recuperación activa.

- **Sobrecarga progresiva dinámica**
  - Lee `entrenamientos_log` de los últimos 7 días.
  - RPE medio < 6 → +1 serie o RIR −1.
  - RPE medio 9-10 → micro-descarga: volumen ×0.85.
  - RPE 6-8 → progresión lineal (+1 rep o +2,5 kg).

- **Plan semanal**
  - `buildWeeklyPlan(...)` devuelve 7 días respetando `dias_disponibles`. Días no disponibles → descanso/movilidad.

## 3. Frontend

- `/test-inicial`: selector de género, input `fuerza_tren_superior` (label dinámica: "Repeticiones máximas" o "Tiempo de suspensión (s)") y `tiempo_agilidad`.
- `/perfil`: edición del género.
- `/dashboard`: la tarjeta "Entreno de hoy" llama al motor y muestra series×reps, RIR, ritmos y FC objetivo reales.
- `/plan-semanal`: una tarjeta por día con la prescripción del motor.
- `/workout-session`: lee la misma prescripción en lugar de datos estáticos.

Se eliminan los mocks `WEEK_PLAN` en favor del motor.

## 4. Detalles técnicos

- Motor 100% TypeScript en `src/lib/training-engine.ts`, sin dependencias nuevas.
- Tipos derivados de `src/integrations/supabase/types.ts` (tras la migración).
- Hook `useTrainingPlan()` en `src/hooks/use-training-plan.tsx` que centraliza fetch de perfil + última evaluación + logs y memoriza el plan.
- QA manual: Hombre RM=5, Mujer RM=20 s, Hombre RM=15 con RPE alto (micro-descarga).

## Orden de ejecución

1. Migración SQL (bloqueante, requiere aprobación).
2. Motor + hook.
3. Actualizar `/test-inicial` y `/perfil` para capturar los nuevos campos.
4. Reemplazar el contenido estático de `/dashboard`, `/plan-semanal`, `/workout-session`.
5. QA manual del flujo completo.

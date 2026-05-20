ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS genero TEXT CHECK (genero IN ('Hombre','Mujer'));

ALTER TABLE public.evaluaciones
  ADD COLUMN IF NOT EXISTS tiempo_agilidad NUMERIC,
  ADD COLUMN IF NOT EXISTS fuerza_tren_superior NUMERIC;
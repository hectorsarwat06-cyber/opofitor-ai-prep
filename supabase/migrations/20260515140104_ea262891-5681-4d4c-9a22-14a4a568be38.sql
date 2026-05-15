
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  peso NUMERIC,
  altura NUMERIC,
  fecha_examen DATE,
  dias_disponibles TEXT[] DEFAULT ARRAY['L','X','V'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- EVALUACIONES
CREATE TABLE public.evaluaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tiempo_1000m TEXT NOT NULL,
  max_dominadas INTEGER NOT NULL,
  vam_estimada NUMERIC,
  fecha_test DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eval own select" ON public.evaluaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "eval own insert" ON public.evaluaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "eval own update" ON public.evaluaciones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "eval own delete" ON public.evaluaciones FOR DELETE USING (auth.uid() = user_id);

-- ENTRENAMIENTOS LOG
CREATE TABLE public.entrenamientos_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha_sesion DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_sesion TEXT NOT NULL,
  rpe_sesion INTEGER NOT NULL CHECK (rpe_sesion BETWEEN 1 AND 10),
  repeticiones_dominadas TEXT,
  tiempo_medio_series TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.entrenamientos_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "log own select" ON public.entrenamientos_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "log own insert" ON public.entrenamientos_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "log own update" ON public.entrenamientos_log FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "log own delete" ON public.entrenamientos_log FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX evaluaciones_user_idx ON public.evaluaciones(user_id, fecha_test DESC);
CREATE INDEX entrenamientos_user_idx ON public.entrenamientos_log(user_id, fecha_sesion DESC);

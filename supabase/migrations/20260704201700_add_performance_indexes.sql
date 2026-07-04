CREATE INDEX IF NOT EXISTS idx_entrenamientos_log_user_id_fecha 
ON public.entrenamientos_log (user_id, fecha_sesion);

CREATE INDEX IF NOT EXISTS idx_evaluaciones_user_id_fecha 
ON public.evaluaciones (user_id, fecha_test DESC);

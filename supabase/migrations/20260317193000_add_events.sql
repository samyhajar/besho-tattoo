CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date date NOT NULL,
  location text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.events IS
  'Studio events shown in the public homepage hero and managed from the admin dashboard.';

CREATE INDEX IF NOT EXISTS events_event_date_idx
  ON public.events (event_date, display_order, created_at);

CREATE INDEX IF NOT EXISTS events_published_event_date_idx
  ON public.events (is_published, event_date, display_order, created_at);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public or admin select events" ON public.events;
CREATE POLICY "public or admin select events" ON public.events
FOR SELECT TO authenticated, anon
USING (
  is_published = true
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
);

DROP POLICY IF EXISTS "admin insert events" ON public.events;
CREATE POLICY "admin insert events" ON public.events
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
);

DROP POLICY IF EXISTS "admin update events" ON public.events;
CREATE POLICY "admin update events" ON public.events
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
);

DROP POLICY IF EXISTS "admin delete events" ON public.events;
CREATE POLICY "admin delete events" ON public.events
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
);

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

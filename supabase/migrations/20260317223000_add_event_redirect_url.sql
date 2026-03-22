ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS redirect_url text;

COMMENT ON COLUMN public.events.redirect_url IS
  'Optional link visitors should be sent to when they click an event from the homepage hero timeline.';

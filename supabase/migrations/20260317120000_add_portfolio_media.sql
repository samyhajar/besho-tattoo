-- Add multi-media support for portfolio entries.
-- Keeps tattoos.image_url as a denormalized primary image path for compatibility.

CREATE TABLE IF NOT EXISTS public.portfolio_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tattoo_id uuid NOT NULL REFERENCES public.tattoos (id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.portfolio_media IS
  'Stores all images and videos for tattoo, art, and design portfolio entries.';

CREATE INDEX IF NOT EXISTS portfolio_media_tattoo_id_idx
  ON public.portfolio_media (tattoo_id);

CREATE INDEX IF NOT EXISTS portfolio_media_sort_order_idx
  ON public.portfolio_media (tattoo_id, sort_order, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_media_one_primary_image_per_tattoo_idx
  ON public.portfolio_media (tattoo_id)
  WHERE is_primary = true AND media_type = 'image';

ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public select portfolio media" ON public.portfolio_media;
CREATE POLICY "public select portfolio media" ON public.portfolio_media
FOR SELECT TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "admin insert portfolio media" ON public.portfolio_media;
CREATE POLICY "admin insert portfolio media" ON public.portfolio_media
FOR INSERT TO authenticated
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid()))
);

DROP POLICY IF EXISTS "admin update portfolio media" ON public.portfolio_media;
CREATE POLICY "admin update portfolio media" ON public.portfolio_media
FOR UPDATE TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid()))
)
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid()))
);

DROP POLICY IF EXISTS "admin delete portfolio media" ON public.portfolio_media;
CREATE POLICY "admin delete portfolio media" ON public.portfolio_media
FOR DELETE TO authenticated
USING (
  (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid()))
);

INSERT INTO public.portfolio_media (
  tattoo_id,
  storage_path,
  media_type,
  sort_order,
  is_primary
)
SELECT
  t.id,
  t.image_url,
  'image',
  0,
  true
FROM public.tattoos t
WHERE t.image_url IS NOT NULL
  AND t.image_url <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM public.portfolio_media pm
    WHERE pm.tattoo_id = t.id
      AND pm.storage_path = t.image_url
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'tattoos',
    'tattoos',
    false,
    104857600,
    ARRAY[
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ]
  )
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
WHERE id IN ('tattoos', 'art', 'designs');

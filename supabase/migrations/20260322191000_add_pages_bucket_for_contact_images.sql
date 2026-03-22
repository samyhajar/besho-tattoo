-- Create a dedicated pages bucket for editable page imagery
-- and seed the contact page image site-content field.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pages',
  'pages',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'pages';

DROP POLICY IF EXISTS "public read pages bucket" ON storage.objects;
CREATE POLICY "public read pages bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pages');

DROP POLICY IF EXISTS "admin upload pages bucket" ON storage.objects;
CREATE POLICY "admin upload pages bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pages'
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
);

DROP POLICY IF EXISTS "admin update pages bucket" ON storage.objects;
CREATE POLICY "admin update pages bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pages'
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
)
WITH CHECK (
  bucket_id = 'pages'
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
);

DROP POLICY IF EXISTS "admin delete pages bucket" ON storage.objects;
CREATE POLICY "admin delete pages bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pages'
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  )
);

INSERT INTO public.site_content (page, section, field_name, content)
SELECT
  'contact',
  'info',
  'image_url',
  '/1de18774-5b5c-4058-8ebc-26ad6594bdcf.png'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.site_content
  WHERE page = 'contact'
    AND section = 'info'
    AND field_name = 'image_url'
);

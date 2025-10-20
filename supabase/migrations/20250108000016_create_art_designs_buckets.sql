-- Create separate storage buckets for art and designs categories
-- This provides better organization and easier image fetching

-- Create the art bucket for storing art portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'art',
  'art',
  false, -- private bucket for secure access
  52428800, -- 50MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'] -- allowed image types
)
ON CONFLICT (id) DO NOTHING;

-- Create the designs bucket for storing design portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'designs',
  'designs',
  false, -- private bucket for secure access
  52428800, -- 50MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'] -- allowed image types
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the art bucket
-- Policy for authenticated users to upload files to art bucket
CREATE POLICY "Allow authenticated uploads to art bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'art');

-- Policy for authenticated users to read files from art bucket
CREATE POLICY "Allow authenticated reads from art bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'art');

-- Policy for authenticated users to delete files from art bucket
CREATE POLICY "Allow authenticated deletes from art bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'art');

-- Policy for authenticated users to update files in art bucket
CREATE POLICY "Allow authenticated updates to art bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'art')
WITH CHECK (bucket_id = 'art');

-- Create storage policies for the designs bucket
-- Policy for authenticated users to upload files to designs bucket
CREATE POLICY "Allow authenticated uploads to designs bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'designs');

-- Policy for authenticated users to read files from designs bucket
CREATE POLICY "Allow authenticated reads from designs bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'designs');

-- Policy for authenticated users to delete files from designs bucket
CREATE POLICY "Allow authenticated deletes from designs bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'designs');

-- Policy for authenticated users to update files in designs bucket
CREATE POLICY "Allow authenticated updates to designs bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'designs')
WITH CHECK (bucket_id = 'designs');


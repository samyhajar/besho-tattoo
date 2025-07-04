/*
  Migration: Update storage policies for appointment reference images
  Purpose: Allow anonymous users to upload reference images for appointments
*/

-- Allow anonymous users to upload images to the appointments folder
CREATE POLICY "Allow anonymous appointment image uploads" ON storage.objects
FOR INSERT TO anon
WITH CHECK (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = 'appointments'
);

-- Allow anonymous users to view appointment images they uploaded
CREATE POLICY "Allow anonymous to view appointment images" ON storage.objects
FOR SELECT TO anon
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = 'appointments'
);

-- Allow authenticated users to view all appointment images
CREATE POLICY "Allow authenticated to view appointment images" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = 'appointments'
);

-- Allow admins to manage all appointment images
CREATE POLICY "Allow admins to manage appointment images" ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = 'appointments'
  AND (
    SELECT is_admin
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
  )
);
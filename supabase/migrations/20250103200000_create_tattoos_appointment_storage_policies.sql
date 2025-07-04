-- Storage policies for tattoosappointment bucket
-- This bucket stores reference images uploaded during appointment booking

-- Allow anonymous users to upload images (for appointment booking)
CREATE POLICY "Allow anonymous uploads to tattoosappointment"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tattoosappointment');

-- Allow authenticated users to view all images (for admin dashboard)
CREATE POLICY "Allow authenticated users to view tattoosappointment images"
ON storage.objects FOR SELECT
USING (bucket_id = 'tattoosappointment' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images (for admin management)
CREATE POLICY "Allow authenticated users to delete tattoosappointment images"
ON storage.objects FOR DELETE
USING (bucket_id = 'tattoosappointment' AND auth.role() = 'authenticated');

-- Allow anonymous users to update their own uploads (in case they need to replace)
CREATE POLICY "Allow anonymous updates to tattoosappointment"
ON storage.objects FOR UPDATE
USING (bucket_id = 'tattoosappointment');
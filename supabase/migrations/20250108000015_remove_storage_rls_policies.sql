-- Remove RLS policies from storage buckets
-- This will allow public access to all storage buckets

-- Remove policies from tattoos bucket
DROP POLICY IF EXISTS "Public read access for tattoos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tattoos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own tattoos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own tattoos" ON storage.objects;

-- Remove policies from art bucket
DROP POLICY IF EXISTS "Public read access for art" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload art" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own art" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own art" ON storage.objects;

-- Remove policies from designs bucket
DROP POLICY IF EXISTS "Public read access for designs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own designs" ON storage.objects;

-- Remove policies from media bucket
DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own media" ON storage.objects;

-- Remove policies from tattoosappointment bucket
DROP POLICY IF EXISTS "Public read access for tattoosappointment" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tattoosappointment" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own tattoosappointment" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own tattoosappointment" ON storage.objects;


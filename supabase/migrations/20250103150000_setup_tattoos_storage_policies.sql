-- Migration: Setup storage policies for tattoos bucket
-- Created: 2025-01-03

-- Create storage policies for the tattoos bucket
-- These policies allow authenticated users to manage files in the tattoos bucket

-- Policy for authenticated users to upload files to tattoos bucket
CREATE POLICY "Allow authenticated uploads to tattoos bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tattoos');

-- Policy for authenticated users to read files from tattoos bucket
CREATE POLICY "Allow authenticated reads from tattoos bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tattoos');

-- Policy for authenticated users to delete files from tattoos bucket
CREATE POLICY "Allow authenticated deletes from tattoos bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tattoos');

-- Policy for authenticated users to update files in tattoos bucket
CREATE POLICY "Allow authenticated updates to tattoos bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tattoos')
WITH CHECK (bucket_id = 'tattoos');
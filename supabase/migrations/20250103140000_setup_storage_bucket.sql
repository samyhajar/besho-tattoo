/*
  Storage Bucket Setup Migration

  This migration creates the 'media' storage bucket for tattoo images
  and sets up appropriate RLS policies for secure access.

  Tables affected: storage.buckets, storage.objects
  Purpose: Enable image upload functionality for tattoo portfolio
*/

-- Create the media bucket for storing tattoo images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true, -- public bucket for easy access to portfolio images
  10485760, -- 10MB file size limit
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp'] -- allowed image types
)
on conflict (id) do nothing;

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Policy: Allow public read access to media bucket objects
-- This allows anyone to view tattoo portfolio images
create policy "Public read access for media bucket"
on storage.objects
for select
to public
using (bucket_id = 'media');

-- Policy: Allow authenticated users to upload to media bucket
-- This allows admin users to upload new tattoo images
create policy "Authenticated users can upload to media bucket"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media');

-- Policy: Allow authenticated users to update media bucket objects
-- This allows admin users to replace existing images
create policy "Authenticated users can update media bucket objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'media')
with check (bucket_id = 'media');

-- Policy: Allow authenticated users to delete from media bucket
-- This allows admin users to remove images when deleting tattoos
create policy "Authenticated users can delete from media bucket"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media');
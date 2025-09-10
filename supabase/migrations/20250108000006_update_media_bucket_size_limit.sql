/*
  Update Media Bucket File Size Limit Migration

  This migration increases the file size limit for the media bucket
  from 10MB to 50MB to allow for larger image uploads.

  Tables affected: storage.buckets
  Purpose: Increase upload capacity for tattoo images
*/

-- Update the media bucket file size limit from 10MB to 50MB
UPDATE storage.buckets
SET file_size_limit = 52428800  -- 50MB in bytes (50 * 1024 * 1024)
WHERE id = 'media';

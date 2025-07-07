-- Migration: Add is_public column to tattoos table
-- Purpose: Allow admins to control which tattoos are visible in the public portfolio
-- Created: 2025-01-07

-- Add is_public column to tattoos table
-- Default to true so existing tattoos remain visible
ALTER TABLE public.tattoos
ADD COLUMN is_public boolean NOT NULL DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN public.tattoos.is_public IS 'Controls whether tattoo appears in public portfolio. Default true for backward compatibility.';

-- Create index for better performance when filtering public tattoos
CREATE INDEX tattoos_is_public_idx ON public.tattoos (is_public);

-- Update RLS policy for tattoos to only show public tattoos to anonymous users
-- Keep existing admin policies unchanged
DROP POLICY "public select tattoos" ON public.tattoos;

-- New policy: anonymous users can only see public tattoos
CREATE POLICY "anonymous select public tattoos" ON public.tattoos
FOR SELECT TO anon
USING (is_public = true);

-- New policy: authenticated users can see public tattoos
CREATE POLICY "authenticated select public tattoos" ON public.tattoos
FOR SELECT TO authenticated
USING (is_public = true);

-- New policy: admins can see all tattoos (public and private)
CREATE POLICY "admin select all tattoos" ON public.tattoos
FOR SELECT TO authenticated
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Keep existing admin policies for insert, update, delete unchanged
-- (They already exist and work correctly)
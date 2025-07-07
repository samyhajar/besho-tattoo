-- Simple migration: Add is_public column to tattoos table
-- Purpose: Allow admins to control which tattoos are visible in the public portfolio
-- Created: 2025-01-07

-- Add is_public column to tattoos table
-- Default to true so existing tattoos remain visible
ALTER TABLE public.tattoos
ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN public.tattoos.is_public IS 'Controls whether tattoo appears in public portfolio. Default true for backward compatibility.';

-- Create index for better performance when filtering public tattoos
CREATE INDEX IF NOT EXISTS tattoos_is_public_idx ON public.tattoos (is_public);
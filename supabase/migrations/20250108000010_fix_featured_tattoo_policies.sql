-- Migration: Fix featured tattoo RLS policies
-- Purpose: Allow authenticated users to manage featured tattoos
-- Created: 2025-01-08

-- Drop existing policies
DROP POLICY IF EXISTS "public select featured tattoo" ON public.featured_tattoo;
DROP POLICY IF EXISTS "admin insert featured tattoo" ON public.featured_tattoo;
DROP POLICY IF EXISTS "admin update featured tattoo" ON public.featured_tattoo;
DROP POLICY IF EXISTS "admin delete featured tattoo" ON public.featured_tattoo;

-- Create new policies that allow authenticated users to manage featured tattoos
-- Public can read featured tattoo
CREATE POLICY "public select featured tattoo" ON public.featured_tattoo
FOR SELECT TO authenticated, anon
USING (true);

-- Authenticated users can insert featured tattoos
CREATE POLICY "authenticated insert featured tattoo" ON public.featured_tattoo
FOR INSERT TO authenticated
WITH CHECK (true);

-- Authenticated users can update featured tattoos
CREATE POLICY "authenticated update featured tattoo" ON public.featured_tattoo
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete featured tattoos
CREATE POLICY "authenticated delete featured tattoo" ON public.featured_tattoo
FOR DELETE TO authenticated
USING (true);

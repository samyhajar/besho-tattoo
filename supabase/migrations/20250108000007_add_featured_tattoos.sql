-- Migration: Add featured tattoos system
-- Purpose: Allow admins to select featured tattoos for portfolio categories
-- Created: 2025-01-08

-- Create featured_tattoos table to track which tattoo is featured for each category
CREATE TABLE public.featured_tattoos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL UNIQUE,
  tattoo_id uuid NOT NULL REFERENCES public.tattoos (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add comment for documentation
COMMENT ON TABLE public.featured_tattoos IS 'Tracks which tattoo is featured for each portfolio category. Only one tattoo per category can be featured.';

-- Create indexes for better performance
CREATE INDEX featured_tattoos_category_idx ON public.featured_tattoos (category);
CREATE INDEX featured_tattoos_tattoo_id_idx ON public.featured_tattoos (tattoo_id);

-- Enable RLS
ALTER TABLE public.featured_tattoos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for featured_tattoos
-- Public can read featured tattoos
CREATE POLICY "public select featured tattoos" ON public.featured_tattoos
FOR SELECT TO authenticated, anon
USING (true);

-- Only admins can manage featured tattoos
CREATE POLICY "admin insert featured tattoos" ON public.featured_tattoos
FOR INSERT TO authenticated
WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "admin update featured tattoos" ON public.featured_tattoos
FOR UPDATE TO authenticated
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "admin delete featured tattoos" ON public.featured_tattoos
FOR DELETE TO authenticated
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_featured_tattoos_updated_at
  BEFORE UPDATE ON public.featured_tattoos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

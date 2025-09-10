-- Migration: Simplify featured tattoos system
-- Purpose: Remove category-based featured tattoos and just store the featured image
-- Created: 2025-01-08

-- Drop the existing featured_tattoos table
DROP TABLE IF EXISTS public.featured_tattoos CASCADE;

-- Create a simpler featured_tattoo table (singular) that just stores the featured image
CREATE TABLE public.featured_tattoo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tattoo_id uuid NOT NULL REFERENCES public.tattoos (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add comment for documentation
COMMENT ON TABLE public.featured_tattoo IS 'Stores the single featured tattoo image for the portfolio page. Only one tattoo can be featured at a time.';

-- Create indexes for better performance
CREATE INDEX featured_tattoo_tattoo_id_idx ON public.featured_tattoo (tattoo_id);

-- Enable RLS
ALTER TABLE public.featured_tattoo ENABLE ROW LEVEL SECURITY;

-- RLS Policies for featured_tattoo
-- Public can read featured tattoo
CREATE POLICY "public select featured tattoo" ON public.featured_tattoo
FOR SELECT TO authenticated, anon
USING (true);

-- Only admins can manage featured tattoo
CREATE POLICY "admin insert featured tattoo" ON public.featured_tattoo
FOR INSERT TO authenticated
WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "admin update featured tattoo" ON public.featured_tattoo
FOR UPDATE TO authenticated
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "admin delete featured tattoo" ON public.featured_tattoo
FOR DELETE TO authenticated
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_featured_tattoo_updated_at
  BEFORE UPDATE ON public.featured_tattoo
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop the old functions
DROP FUNCTION IF EXISTS get_featured_tattoos_with_data();
DROP FUNCTION IF EXISTS get_featured_tattoo_for_category(text);
DROP FUNCTION IF EXISTS set_featured_tattoo(text, uuid);
DROP FUNCTION IF EXISTS remove_featured_tattoo(text);
DROP FUNCTION IF EXISTS is_tattoo_featured(uuid);

-- Create new simplified functions
CREATE OR REPLACE FUNCTION get_featured_tattoo_with_data()
RETURNS TABLE (
  id uuid,
  tattoo_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  tattoo_data jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id,
    ft.tattoo_id,
    ft.created_at,
    ft.updated_at,
    to_jsonb(t.*) as tattoo_data
  FROM featured_tattoo ft
  JOIN tattoos t ON ft.tattoo_id = t.id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_featured_tattoo(tattoo_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Delete any existing featured tattoo
  DELETE FROM featured_tattoo;
  
  -- Insert the new featured tattoo
  INSERT INTO featured_tattoo (tattoo_id)
  VALUES (tattoo_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION remove_featured_tattoo()
RETURNS void AS $$
BEGIN
  DELETE FROM featured_tattoo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_tattoo_featured(tattoo_id_param uuid)
RETURNS TABLE (is_featured boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT EXISTS(
    SELECT 1 FROM featured_tattoo WHERE tattoo_id = tattoo_id_param
  ) as is_featured;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_featured_tattoo_with_data() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION set_featured_tattoo(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_featured_tattoo() TO authenticated;
GRANT EXECUTE ON FUNCTION is_tattoo_featured(uuid) TO authenticated, anon;

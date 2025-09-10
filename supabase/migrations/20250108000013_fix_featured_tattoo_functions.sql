-- Migration: Fix featured tattoo functions
-- Purpose: Remove SECURITY DEFINER and simplify functions to fix permission issues
-- Created: 2025-01-08

-- Drop existing functions
DROP FUNCTION IF EXISTS get_featured_tattoo_with_data();
DROP FUNCTION IF EXISTS set_featured_tattoo(uuid);
DROP FUNCTION IF EXISTS remove_featured_tattoo();
DROP FUNCTION IF EXISTS is_tattoo_featured(uuid);

-- Create new simplified functions without SECURITY DEFINER
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_featured_tattoo(tattoo_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Delete any existing featured tattoo
  DELETE FROM featured_tattoo;
  
  -- Insert the new featured tattoo
  INSERT INTO featured_tattoo (tattoo_id)
  VALUES (tattoo_id_param);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_featured_tattoo()
RETURNS void AS $$
BEGIN
  DELETE FROM featured_tattoo;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_tattoo_featured(tattoo_id_param uuid)
RETURNS TABLE (is_featured boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT EXISTS(
    SELECT 1 FROM featured_tattoo WHERE tattoo_id = tattoo_id_param
  ) as is_featured;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_featured_tattoo_with_data() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION set_featured_tattoo(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_featured_tattoo() TO authenticated;
GRANT EXECUTE ON FUNCTION is_tattoo_featured(uuid) TO authenticated, anon;

-- Migration: Add database functions for featured tattoos
-- Purpose: Create RPC functions for managing featured tattoos
-- Created: 2025-01-08

-- Function to get all featured tattoos with their associated tattoo data
CREATE OR REPLACE FUNCTION get_featured_tattoos_with_data()
RETURNS TABLE (
  id uuid,
  category text,
  tattoo_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  tattoo_data jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id,
    ft.category,
    ft.tattoo_id,
    ft.created_at,
    ft.updated_at,
    to_jsonb(t.*) as tattoo_data
  FROM featured_tattoos ft
  JOIN tattoos t ON ft.tattoo_id = t.id
  ORDER BY ft.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get featured tattoo for a specific category
CREATE OR REPLACE FUNCTION get_featured_tattoo_for_category(category_param text)
RETURNS TABLE (
  id uuid,
  category text,
  tattoo_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  tattoo_data jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id,
    ft.category,
    ft.tattoo_id,
    ft.created_at,
    ft.updated_at,
    to_jsonb(t.*) as tattoo_data
  FROM featured_tattoos ft
  JOIN tattoos t ON ft.tattoo_id = t.id
  WHERE ft.category = category_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set a tattoo as featured for a category
CREATE OR REPLACE FUNCTION set_featured_tattoo(category_param text, tattoo_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Use upsert to either insert new or update existing
  INSERT INTO featured_tattoos (category, tattoo_id)
  VALUES (category_param, tattoo_id_param)
  ON CONFLICT (category) 
  DO UPDATE SET 
    tattoo_id = EXCLUDED.tattoo_id,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove featured status from a category
CREATE OR REPLACE FUNCTION remove_featured_tattoo(category_param text)
RETURNS void AS $$
BEGIN
  DELETE FROM featured_tattoos WHERE category = category_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a tattoo is featured for any category
CREATE OR REPLACE FUNCTION is_tattoo_featured(tattoo_id_param uuid)
RETURNS TABLE (category text) AS $$
BEGIN
  RETURN QUERY
  SELECT ft.category
  FROM featured_tattoos ft
  WHERE ft.tattoo_id = tattoo_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_featured_tattoos_with_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_featured_tattoo_for_category(text) TO authenticated;
GRANT EXECUTE ON FUNCTION set_featured_tattoo(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_featured_tattoo(text) TO authenticated;
GRANT EXECUTE ON FUNCTION is_tattoo_featured(uuid) TO authenticated;

-- Grant execute permissions to anonymous users for read functions
GRANT EXECUTE ON FUNCTION get_featured_tattoos_with_data() TO anon;
GRANT EXECUTE ON FUNCTION get_featured_tattoo_for_category(text) TO anon;
GRANT EXECUTE ON FUNCTION is_tattoo_featured(uuid) TO anon;

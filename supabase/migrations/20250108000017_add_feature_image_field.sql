-- Add is_feature_image field to tattoos table
-- This allows marking one image per category as the feature/background image

-- Add the is_feature_image column
ALTER TABLE tattoos
ADD COLUMN IF NOT EXISTS is_feature_image BOOLEAN DEFAULT false;

-- Create an index for better performance when querying feature images
CREATE INDEX IF NOT EXISTS idx_tattoos_feature_image ON tattoos(is_feature_image);

-- Create a unique constraint to ensure only one feature image per category
-- This will prevent multiple feature images in the same category
CREATE UNIQUE INDEX IF NOT EXISTS idx_tattoos_unique_feature_per_category
ON tattoos(category)
WHERE is_feature_image = true AND category IS NOT NULL;




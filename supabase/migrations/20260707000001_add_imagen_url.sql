-- Agrega columna imagen_url a grupo_edad para las imágenes del onboarding
ALTER TABLE grupo_edad ADD COLUMN IF NOT EXISTS imagen_url text;

-- Actualiza registros existentes con las URLs del bucket público
UPDATE grupo_edad
SET imagen_url = 'https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/' || codigo || '.png'
WHERE imagen_url IS NULL;

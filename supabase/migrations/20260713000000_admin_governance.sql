ALTER TABLE revision_contenido
  ADD COLUMN IF NOT EXISTS notas_envio text,
  ADD COLUMN IF NOT EXISTS notas_revision text;

UPDATE revision_contenido
SET notas_envio = notas
WHERE notas_envio IS NULL AND notas IS NOT NULL;

CREATE OR REPLACE FUNCTION sincronizar_notas_revision_contenido()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.notas_revision IS NOT NULL THEN
    NEW.notas := NEW.notas_revision;
  ELSIF NEW.notas_envio IS NOT NULL THEN
    NEW.notas := NEW.notas_envio;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sincronizar_notas_revision_contenido_trigger ON revision_contenido;
CREATE TRIGGER sincronizar_notas_revision_contenido_trigger
BEFORE INSERT OR UPDATE OF notas, notas_envio, notas_revision ON revision_contenido
FOR EACH ROW EXECUTE FUNCTION sincronizar_notas_revision_contenido();

CREATE TABLE IF NOT EXISTS configuracion_plataforma (
  id varchar(20) PRIMARY KEY DEFAULT 'principal' CHECK (id = 'principal'),
  nombre_plataforma varchar(80) NOT NULL DEFAULT 'Semillas',
  correo_soporte varchar(255),
  zona_horaria varchar(80) NOT NULL DEFAULT 'America/Guayaquil',
  notas_obligatorias_cambios boolean NOT NULL DEFAULT true,
  notas_obligatorias_rechazo boolean NOT NULL DEFAULT true,
  actualizado_por uuid REFERENCES usuario_app(id) ON DELETE SET NULL,
  actualizado_en timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF to_regclass('public.ajuste_sistema') IS NOT NULL THEN
    EXECUTE '
      INSERT INTO configuracion_plataforma (
        id,
        nombre_plataforma,
        correo_soporte,
        zona_horaria,
        notas_obligatorias_cambios,
        notas_obligatorias_rechazo,
        actualizado_en
      )
      SELECT
        ''principal'',
        nombre_plataforma,
        correo_soporte,
        zona_horaria,
        notas_obligatorias_cambios,
        notas_obligatorias_rechazo,
        actualizado_en
      FROM ajuste_sistema
      ORDER BY actualizado_en DESC
      LIMIT 1
      ON CONFLICT (id) DO UPDATE SET
        nombre_plataforma = EXCLUDED.nombre_plataforma,
        correo_soporte = EXCLUDED.correo_soporte,
        zona_horaria = EXCLUDED.zona_horaria,
        notas_obligatorias_cambios = EXCLUDED.notas_obligatorias_cambios,
        notas_obligatorias_rechazo = EXCLUDED.notas_obligatorias_rechazo,
        actualizado_en = EXCLUDED.actualizado_en';
  END IF;
END;
$$;

INSERT INTO configuracion_plataforma (id)
VALUES ('principal')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_revision_contenido_estado_creado_en
  ON revision_contenido (estado, creado_en DESC);

CREATE OR REPLACE VIEW v_admin_revisiones
WITH (security_invoker = true)
AS
SELECT
  revision.id,
  revision.tema_id,
  revision.estado,
  revision.notas_envio,
  revision.notas_revision,
  revision.creado_en,
  revision.revisado_en,
  tema.titulo,
  senda.nombre AS senda,
  enviado.nombre_visible AS enviado_por,
  revisado.nombre_visible AS revisado_por
FROM revision_contenido AS revision
JOIN tema ON tema.id = revision.tema_id
JOIN senda ON senda.id = tema.senda_id
LEFT JOIN usuario_app AS enviado ON enviado.id = revision.enviado_por
LEFT JOIN usuario_app AS revisado ON revisado.id = revision.revisado_por;

ALTER TABLE configuracion_plataforma ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON configuracion_plataforma FROM anon, authenticated;
REVOKE ALL ON v_admin_revisiones FROM anon, authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT ALL ON configuracion_plataforma TO service_role;
    GRANT SELECT ON v_admin_revisiones TO service_role;
  END IF;
END;
$$;

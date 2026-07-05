-- ============================================================
--  SEMILLAS · Base de datos adaptada MVP + escalable
--  Stack sugerido: React PWA + Hono API + PostgreSQL (Supabase/Neon)
--  Versión: 2.0 adaptada
--  Fecha: 2026-07-05
--
--  Cómo levantar:
--    createdb semillas
--    psql -d semillas -f semillas_db_adaptada_mvp.sql
--
--  En Supabase:
--    SQL Editor -> pegar/ejecutar este archivo completo.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
--  0. TIPOS ENUM
-- ============================================================

DO $$ BEGIN
  CREATE TYPE publication_status AS ENUM ('draft', 'review', 'approved', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest', 'parent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE auth_provider AS ENUM ('google', 'facebook', 'guest', 'email');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE media_kind AS ENUM ('image', 'audio', 'video', 'document', 'icon');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE content_review_status AS ENUM ('draft', 'submitted', 'changes_requested', 'approved', 'published', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE progress_event_type AS ENUM (
    'theme_started',
    'theme_completed',
    'block_started',
    'block_completed',
    'activity_started',
    'activity_answered',
    'activity_completed',
    'reward_claimed',
    'theme_downloaded',
    'sync_marker'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
--  1. CATÁLOGOS BASE
-- ============================================================

CREATE TABLE IF NOT EXISTS age_group (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  name          text NOT NULL,
  min_age       int NOT NULL,
  max_age       int NOT NULL,
  description   text,
  sort_order    int NOT NULL UNIQUE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CHECK (min_age >= 0),
  CHECK (max_age >= min_age)
);

CREATE TABLE IF NOT EXISTS path (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  name          text NOT NULL,
  description   text,
  color_hex     text NOT NULL,
  icon_name     text,
  sort_order    int NOT NULL UNIQUE,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE IF NOT EXISTS bible_testament (
  id          smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code        text NOT NULL UNIQUE,
  name        text NOT NULL
);

CREATE TABLE IF NOT EXISTS bible_book (
  id            smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  testament_id  smallint NOT NULL REFERENCES bible_testament(id),
  name          text NOT NULL UNIQUE,
  sort_order    smallint NOT NULL UNIQUE,
  CHECK (sort_order BETWEEN 1 AND 66)
);

CREATE TABLE IF NOT EXISTS bible_version (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code               text NOT NULL UNIQUE,
  name               text NOT NULL,
  is_public_domain   boolean NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crecer_step_type (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  name          text NOT NULL,
  description   text,
  sort_order    int NOT NULL UNIQUE,
  color_hex     text,
  CHECK (color_hex IS NULL OR color_hex ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE IF NOT EXISTS activity_type (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  name          text NOT NULL,
  description   text,
  is_game       boolean NOT NULL DEFAULT true,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS level_rule (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_no    int NOT NULL UNIQUE,
  name        text NOT NULL,
  min_xp      int NOT NULL UNIQUE,
  badge_color text DEFAULT '#6D35E8',
  CHECK (level_no > 0),
  CHECK (min_xp >= 0),
  CHECK (badge_color IS NULL OR badge_color ~ '^#[0-9A-Fa-f]{6}$')
);

-- ============================================================
--  2. USUARIOS, PERFILES Y ADULTOS/TUTORES
-- ============================================================

CREATE TABLE IF NOT EXISTS app_user (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role           user_role NOT NULL DEFAULT 'user',
  provider       auth_provider NOT NULL,
  external_id    text,
  email          text,
  display_name   text NOT NULL,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  last_login_at  timestamptz,
  CONSTRAINT ux_app_user_provider_external UNIQUE (provider, external_id),
  CONSTRAINT ck_external_id_for_non_guest CHECK (
    provider = 'guest' OR external_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS ix_app_user_email ON app_user(email);
CREATE INDEX IF NOT EXISTS ix_app_user_role ON app_user(role);

CREATE TABLE IF NOT EXISTS profile (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL UNIQUE REFERENCES app_user(id) ON DELETE CASCADE,
  nickname         text NOT NULL,
  age_group_id     uuid REFERENCES age_group(id),
  avatar_url       text,
  avatar_key       text,
  preferred_audio  boolean NOT NULL DEFAULT true,
  preferred_text_size text NOT NULL DEFAULT 'medium',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CHECK (preferred_text_size IN ('small', 'medium', 'large'))
);

-- Vinculación padre/tutor <-> menor. Útil para las pantallas de padres.
CREATE TABLE IF NOT EXISTS guardian_child_link (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id    uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  child_id       uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  relationship   text NOT NULL DEFAULT 'tutor',
  status         text NOT NULL DEFAULT 'pending',
  invite_code    text UNIQUE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  accepted_at    timestamptz,
  CHECK (status IN ('pending', 'accepted', 'revoked')),
  CHECK (guardian_id <> child_id),
  UNIQUE (guardian_id, child_id)
);

-- ============================================================
--  3. MEDIA / RECURSOS
-- ============================================================

CREATE TABLE IF NOT EXISTS media_asset (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind           media_kind NOT NULL,
  storage_bucket text,
  storage_key    text,
  public_url     text NOT NULL,
  alt_text       text,
  title          text,
  mime_type      text,
  size_bytes     bigint,
  duration_sec   int,
  width_px       int,
  height_px      int,
  created_by     uuid REFERENCES app_user(id),
  created_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (size_bytes IS NULL OR size_bytes >= 0),
  CHECK (duration_sec IS NULL OR duration_sec >= 0)
);

CREATE INDEX IF NOT EXISTS ix_media_asset_kind ON media_asset(kind);

-- ============================================================
--  4. CONTENIDO: TEMAS, VERSIONES POR EDAD Y CRECER
-- ============================================================

CREATE TABLE IF NOT EXISTS theme (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id             uuid NOT NULL REFERENCES path(id),
  title               text NOT NULL,
  slug                text NOT NULL UNIQUE,
  objective           text NOT NULL,
  summary             text,
  cover_media_id      uuid REFERENCES media_asset(id),
  bible_version_id    uuid REFERENCES bible_version(id),
  status              publication_status NOT NULL DEFAULT 'draft',
  xp_reward           int NOT NULL DEFAULT 0,
  estimated_minutes   int NOT NULL DEFAULT 5,
  content_version     int NOT NULL DEFAULT 1,
  created_by          uuid REFERENCES app_user(id),
  reviewed_by         uuid REFERENCES app_user(id),
  published_by        uuid REFERENCES app_user(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  reviewed_at         timestamptz,
  published_at        timestamptz,
  CHECK (xp_reward >= 0),
  CHECK (estimated_minutes > 0)
);

CREATE INDEX IF NOT EXISTS ix_theme_path_status ON theme(path_id, status);
CREATE INDEX IF NOT EXISTS ix_theme_slug ON theme(slug);

CREATE TABLE IF NOT EXISTS theme_age_group (
  theme_id       uuid NOT NULL REFERENCES theme(id) ON DELETE CASCADE,
  age_group_id   uuid NOT NULL REFERENCES age_group(id),
  PRIMARY KEY (theme_id, age_group_id)
);

CREATE TABLE IF NOT EXISTS bible_reference (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id        uuid NOT NULL REFERENCES theme(id) ON DELETE CASCADE,
  book_id         smallint NOT NULL REFERENCES bible_book(id),
  chapter         int NOT NULL,
  verse_start     int NOT NULL,
  verse_end       int NOT NULL,
  is_main         boolean NOT NULL DEFAULT true,
  CHECK (chapter > 0),
  CHECK (verse_start > 0),
  CHECK (verse_end >= verse_start)
);

CREATE TABLE IF NOT EXISTS key_verse (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id        uuid NOT NULL UNIQUE REFERENCES theme(id) ON DELETE CASCADE,
  text            text NOT NULL,
  book_id         smallint NOT NULL REFERENCES bible_book(id),
  chapter         int NOT NULL,
  verse           int NOT NULL,
  CHECK (chapter > 0),
  CHECK (verse > 0)
);

CREATE TABLE IF NOT EXISTS theme_step (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id            uuid NOT NULL REFERENCES theme(id) ON DELETE CASCADE,
  step_type_id        uuid NOT NULL REFERENCES crecer_step_type(id),
  sort_order          int NOT NULL,
  is_required         boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (theme_id, step_type_id),
  UNIQUE (theme_id, sort_order)
);

CREATE TABLE IF NOT EXISTS theme_step_content (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id           uuid NOT NULL REFERENCES theme_step(id) ON DELETE CASCADE,
  age_group_id      uuid NOT NULL REFERENCES age_group(id),
  title             text NOT NULL,
  body              text NOT NULL,
  short_instruction text,
  media_id          uuid REFERENCES media_asset(id),
  audio_media_id    uuid REFERENCES media_asset(id),
  extra             jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (step_id, age_group_id)
);

CREATE INDEX IF NOT EXISTS ix_theme_step_content_extra_gin ON theme_step_content USING gin(extra);

CREATE TABLE IF NOT EXISTS reflection_question (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id        uuid NOT NULL REFERENCES theme_step(id) ON DELETE CASCADE,
  age_group_id   uuid NOT NULL REFERENCES age_group(id),
  question       text NOT NULL,
  sort_order     int NOT NULL,
  UNIQUE (step_id, age_group_id, sort_order)
);

-- ============================================================
--  5. ACTIVIDADES Y JUEGOS
--
--  Diseño híbrido:
--  - activity mantiene lo común en 3FN.
--  - config JSONB permite muchos tipos de juegos sin migrar cada vez.
--  Esto acelera el MVP y deja el CMS flexible.
-- ============================================================

CREATE TABLE IF NOT EXISTS activity (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id            uuid NOT NULL REFERENCES theme(id) ON DELETE CASCADE,
  step_id             uuid REFERENCES theme_step(id) ON DELETE CASCADE,
  age_group_id        uuid NOT NULL REFERENCES age_group(id),
  activity_type_id    uuid NOT NULL REFERENCES activity_type(id),
  title               text NOT NULL,
  prompt              text NOT NULL,
  feedback            text,
  sort_order          int NOT NULL,
  xp_reward           int NOT NULL DEFAULT 10,
  time_limit_sec      int,
  difficulty          text NOT NULL DEFAULT 'normal',
  config              jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_required         boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CHECK (xp_reward >= 0),
  CHECK (time_limit_sec IS NULL OR time_limit_sec > 0),
  CHECK (difficulty IN ('easy', 'normal', 'hard')),
  UNIQUE (theme_id, age_group_id, sort_order)
);

CREATE INDEX IF NOT EXISTS ix_activity_theme_age ON activity(theme_id, age_group_id);
CREATE INDEX IF NOT EXISTS ix_activity_type ON activity(activity_type_id);
CREATE INDEX IF NOT EXISTS ix_activity_config_gin ON activity USING gin(config);

-- Para respuestas configuradas de forma más normalizada cuando haga falta.
-- No reemplaza config JSONB; se usa especialmente para quiz/completar.
CREATE TABLE IF NOT EXISTS activity_option (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id     uuid NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
  label          text,
  text           text NOT NULL,
  is_correct     boolean NOT NULL DEFAULT false,
  sort_order     int NOT NULL,
  feedback       text,
  UNIQUE (activity_id, sort_order)
);

-- ============================================================
--  6. PROGRESO, OFFLINE SYNC Y GAMIFICACIÓN
-- ============================================================

-- Evento append-only idempotente. El cliente genera client_event_id.
-- Sirve para sincronizar progreso offline sin duplicar XP.
CREATE TABLE IF NOT EXISTS progress_event (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  client_event_id     uuid NOT NULL,
  event_type          progress_event_type NOT NULL,
  theme_id            uuid REFERENCES theme(id),
  step_id             uuid REFERENCES theme_step(id),
  activity_id         uuid REFERENCES activity(id),
  is_correct          boolean,
  score               numeric(5,2),
  xp_awarded          int NOT NULL DEFAULT 0,
  payload             jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at_client  timestamptz NOT NULL,
  received_at_server  timestamptz NOT NULL DEFAULT now(),
  device_id           text,
  CHECK (xp_awarded >= 0),
  UNIQUE (user_id, client_event_id)
);

CREATE INDEX IF NOT EXISTS ix_progress_event_user_time ON progress_event(user_id, received_at_server DESC);
CREATE INDEX IF NOT EXISTS ix_progress_event_theme ON progress_event(theme_id);
CREATE INDEX IF NOT EXISTS ix_progress_event_activity ON progress_event(activity_id);
CREATE INDEX IF NOT EXISTS ix_progress_event_type ON progress_event(event_type);
CREATE INDEX IF NOT EXISTS ix_progress_event_payload_gin ON progress_event USING gin(payload);

-- Resumen práctico para acelerar pantallas. La fuente de verdad sigue siendo progress_event.
CREATE TABLE IF NOT EXISTS user_theme_progress (
  user_id             uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  theme_id            uuid NOT NULL REFERENCES theme(id) ON DELETE CASCADE,
  status              text NOT NULL DEFAULT 'not_started',
  percent             numeric(5,2) NOT NULL DEFAULT 0,
  last_step_id        uuid REFERENCES theme_step(id),
  started_at          timestamptz,
  completed_at        timestamptz,
  updated_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, theme_id),
  CHECK (status IN ('not_started', 'in_progress', 'completed')),
  CHECK (percent >= 0 AND percent <= 100)
);

CREATE TABLE IF NOT EXISTS user_activity_progress (
  user_id             uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  activity_id         uuid NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
  attempts            int NOT NULL DEFAULT 0,
  best_score          numeric(5,2) NOT NULL DEFAULT 0,
  is_completed        boolean NOT NULL DEFAULT false,
  completed_at        timestamptz,
  updated_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, activity_id),
  CHECK (attempts >= 0),
  CHECK (best_score >= 0 AND best_score <= 100)
);

CREATE TABLE IF NOT EXISTS achievement (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text NOT NULL UNIQUE,
  name           text NOT NULL,
  description    text,
  icon_url       text,
  criterion_code text NOT NULL,
  criterion_value int,
  xp_bonus       int NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (xp_bonus >= 0)
);

CREATE TABLE IF NOT EXISTS user_achievement (
  user_id          uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  achievement_id   uuid NOT NULL REFERENCES achievement(id),
  earned_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Descargas offline. El contenido real vive en IndexedDB; aquí se registra estado/sync.
CREATE TABLE IF NOT EXISTS offline_package (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id         uuid NOT NULL REFERENCES theme(id) ON DELETE CASCADE,
  content_version  int NOT NULL,
  manifest         jsonb NOT NULL DEFAULT '{}'::jsonb,
  size_bytes       bigint NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (theme_id, content_version),
  CHECK (size_bytes >= 0)
);

CREATE TABLE IF NOT EXISTS user_offline_download (
  user_id          uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  package_id       uuid NOT NULL REFERENCES offline_package(id) ON DELETE CASCADE,
  downloaded_at    timestamptz NOT NULL DEFAULT now(),
  last_opened_at   timestamptz,
  PRIMARY KEY (user_id, package_id)
);

-- ============================================================
--  7. CLUBES, RETOS Y SOCIAL LIGERO
-- ============================================================

CREATE TABLE IF NOT EXISTS club (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  description    text,
  invite_code    text NOT NULL UNIQUE,
  created_by     uuid NOT NULL REFERENCES app_user(id),
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_member (
  club_id       uuid NOT NULL REFERENCES club(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  member_role   text NOT NULL DEFAULT 'member',
  joined_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (club_id, user_id),
  CHECK (member_role IN ('owner', 'leader', 'member'))
);

CREATE TABLE IF NOT EXISTS club_challenge (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id         uuid REFERENCES club(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  metric_code     text NOT NULL,
  target_value    int NOT NULL,
  starts_on       date NOT NULL,
  ends_on         date NOT NULL,
  reward_xp       int NOT NULL DEFAULT 0,
  created_by      uuid REFERENCES app_user(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (target_value > 0),
  CHECK (reward_xp >= 0),
  CHECK (ends_on >= starts_on)
);

CREATE TABLE IF NOT EXISTS share_card (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  theme_id      uuid REFERENCES theme(id),
  achievement_id uuid REFERENCES achievement(id),
  image_url     text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
--  8. CMS, REVISIÓN, AUDITORÍA Y REPORTES
-- ============================================================

CREATE TABLE IF NOT EXISTS content_review (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id         uuid NOT NULL REFERENCES theme(id) ON DELETE CASCADE,
  status           content_review_status NOT NULL DEFAULT 'submitted',
  submitted_by     uuid REFERENCES app_user(id),
  reviewed_by      uuid REFERENCES app_user(id),
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  reviewed_at      timestamptz
);

CREATE TABLE IF NOT EXISTS audit_log (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id   uuid REFERENCES app_user(id),
  action          text NOT NULL,
  entity_type     text NOT NULL,
  entity_id       uuid,
  before_data     jsonb,
  after_data      jsonb,
  ip_address      inet,
  user_agent      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS ix_audit_actor_time ON audit_log(actor_user_id, created_at DESC);

-- ============================================================
--  9. VISTAS ÚTILES PARA API / REPORTES
-- ============================================================

CREATE OR REPLACE VIEW v_user_xp AS
SELECT
  u.id AS user_id,
  COALESCE(SUM(pe.xp_awarded), 0)::int AS xp_total
FROM app_user u
LEFT JOIN progress_event pe ON pe.user_id = u.id
GROUP BY u.id;

CREATE OR REPLACE VIEW v_user_level AS
SELECT
  ux.user_id,
  ux.xp_total,
  (
    SELECT lr.level_no
    FROM level_rule lr
    WHERE lr.min_xp <= ux.xp_total
    ORDER BY lr.min_xp DESC
    LIMIT 1
  ) AS level_no,
  (
    SELECT lr.name
    FROM level_rule lr
    WHERE lr.min_xp <= ux.xp_total
    ORDER BY lr.min_xp DESC
    LIMIT 1
  ) AS level_name
FROM v_user_xp ux;

CREATE OR REPLACE VIEW v_club_ranking AS
SELECT
  cm.club_id,
  cm.user_id,
  p.nickname,
  ux.xp_total,
  RANK() OVER (PARTITION BY cm.club_id ORDER BY ux.xp_total DESC) AS rank_no
FROM club_member cm
JOIN profile p ON p.user_id = cm.user_id
JOIN v_user_xp ux ON ux.user_id = cm.user_id;

CREATE OR REPLACE VIEW v_theme_public AS
SELECT
  t.id,
  t.slug,
  t.title,
  t.objective,
  t.summary,
  t.path_id,
  p.code AS path_code,
  p.name AS path_name,
  p.color_hex AS path_color_hex,
  t.cover_media_id,
  t.status,
  t.xp_reward,
  t.estimated_minutes,
  t.content_version,
  t.published_at
FROM theme t
JOIN path p ON p.id = t.path_id
WHERE t.status = 'published';

-- ============================================================
-- 10. DATOS SEMILLA
-- ============================================================

INSERT INTO age_group (code, name, min_age, max_age, description, sort_order) VALUES
  ('semillas', 'Semillas', 5, 8, 'Descubre a Dios con historias y actividades sencillas.', 1),
  ('exploradores', 'Exploradores', 9, 12, 'Aprende más de Dios y entiende su Palabra.', 2),
  ('embajadores', 'Embajadores', 13, 17, 'Profundiza tu fe y vive con propósito.', 3)
ON CONFLICT (code) DO NOTHING;

INSERT INTO path (code, name, description, color_hex, icon_name, sort_order) VALUES
  ('padre', 'Senda del Padre', 'Dios es nuestro Padre amoroso.', '#3D8BD4', 'crown', 1),
  ('hijo', 'Senda del Hijo', 'Jesús es nuestro Salvador y amigo.', '#6D35E8', 'heart', 2),
  ('espiritu', 'Senda del Espíritu Santo', 'El Espíritu Santo nos guía y fortalece.', '#F97316', 'flame', 3)
ON CONFLICT (code) DO NOTHING;

INSERT INTO bible_testament (code, name) VALUES
  ('AT', 'Antiguo Testamento'),
  ('NT', 'Nuevo Testamento')
ON CONFLICT (code) DO NOTHING;

INSERT INTO bible_book (testament_id, name, sort_order)
SELECT bt.id, v.name, v.sort_order
FROM (VALUES
  ('AT','Génesis',1),('AT','Éxodo',2),('AT','Levítico',3),('AT','Números',4),
  ('AT','Deuteronomio',5),('AT','Josué',6),('AT','Jueces',7),('AT','Rut',8),
  ('AT','1 Samuel',9),('AT','2 Samuel',10),('AT','1 Reyes',11),('AT','2 Reyes',12),
  ('AT','1 Crónicas',13),('AT','2 Crónicas',14),('AT','Esdras',15),('AT','Nehemías',16),
  ('AT','Ester',17),('AT','Job',18),('AT','Salmos',19),('AT','Proverbios',20),
  ('AT','Eclesiastés',21),('AT','Cantares',22),('AT','Isaías',23),('AT','Jeremías',24),
  ('AT','Lamentaciones',25),('AT','Ezequiel',26),('AT','Daniel',27),('AT','Oseas',28),
  ('AT','Joel',29),('AT','Amós',30),('AT','Abdías',31),('AT','Jonás',32),
  ('AT','Miqueas',33),('AT','Nahúm',34),('AT','Habacuc',35),('AT','Sofonías',36),
  ('AT','Hageo',37),('AT','Zacarías',38),('AT','Malaquías',39),
  ('NT','Mateo',40),('NT','Marcos',41),('NT','Lucas',42),('NT','Juan',43),
  ('NT','Hechos',44),('NT','Romanos',45),('NT','1 Corintios',46),('NT','2 Corintios',47),
  ('NT','Gálatas',48),('NT','Efesios',49),('NT','Filipenses',50),('NT','Colosenses',51),
  ('NT','1 Tesalonicenses',52),('NT','2 Tesalonicenses',53),('NT','1 Timoteo',54),
  ('NT','2 Timoteo',55),('NT','Tito',56),('NT','Filemón',57),('NT','Hebreos',58),
  ('NT','Santiago',59),('NT','1 Pedro',60),('NT','2 Pedro',61),('NT','1 Juan',62),
  ('NT','2 Juan',63),('NT','3 Juan',64),('NT','Judas',65),('NT','Apocalipsis',66)
) AS v(testament_code, name, sort_order)
JOIN bible_testament bt ON bt.code = v.testament_code
ON CONFLICT (name) DO NOTHING;

INSERT INTO bible_version (code, name, is_public_domain) VALUES
  ('TLA', 'Traducción en Lenguaje Actual', false),
  ('RVR1960', 'Reina-Valera 1960', false),
  ('RVR1909', 'Reina-Valera 1909', true),
  ('NVI', 'Nueva Versión Internacional', false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO crecer_step_type (code, name, description, sort_order, color_hex) VALUES
  ('conectar', 'Conectar', 'Enganche inicial del tema.', 1, '#22A447'),
  ('relatar', 'Relatar', 'Historia bíblica y contexto.', 2, '#2F80ED'),
  ('ensenar', 'Enseñar', 'Verdad central y versículo clave.', 3, '#6D35E8'),
  ('comprobar', 'Comprobar', 'Actividad lúdica para comprobar aprendizaje.', 4, '#F97316'),
  ('experimentar', 'Experimentar', 'Aplicación práctica a la vida.', 5, '#06B6D4'),
  ('recompensar', 'Recompensar', 'Cierre, XP e insignia.', 6, '#FFC83D')
ON CONFLICT (code) DO NOTHING;

INSERT INTO activity_type (code, name, description, is_game) VALUES
  ('quiz', 'Quiz', 'Preguntas de opción múltiple.', true),
  ('flashcards', 'Flashcards', 'Tarjetas de memorización.', true),
  ('complete_verse', 'Completar versículo', 'Completar palabras faltantes.', true),
  ('matching_pairs', 'Relacionar conceptos', 'Unir concepto con definición.', true),
  ('true_false', 'Verdadero o falso', 'Responder afirmaciones.', true),
  ('word_search', 'Sopa de letras bíblica', 'Buscar palabras ocultas.', true),
  ('drag_drop', 'Arrastrar y soltar', 'Ordenar o ubicar elementos.', true),
  ('puzzle', 'Rompecabezas', 'Armar imagen o secuencia.', true),
  ('decision_adventure', 'Aventura por decisiones', 'Elegir caminos de historia.', true),
  ('audio_activity', 'Actividad con audio', 'Escuchar y responder.', true),
  ('video_activity', 'Actividad con video', 'Ver y responder.', true),
  ('craft', 'Manualidad', 'Actividad práctica guiada.', false),
  ('song', 'Canción', 'Letra, audio y movimiento.', false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO level_rule (level_no, name, min_xp, badge_color) VALUES
  (1, 'Brote', 0, '#22A447'),
  (2, 'Raíz', 100, '#22A447'),
  (3, 'Tallo', 250, '#6D35E8'),
  (4, 'Rama', 500, '#6D35E8'),
  (5, 'Árbol', 1000, '#FFC83D'),
  (6, 'Cosecha', 2000, '#FFC83D'),
  (7, 'Explorador', 3000, '#2F80ED')
ON CONFLICT (level_no) DO NOTHING;

INSERT INTO achievement (code, name, description, criterion_code, criterion_value, xp_bonus) VALUES
  ('first_lesson', 'Primer paso', 'Completaste tu primera lección.', 'themes_completed', 1, 20),
  ('seven_day_streak', 'Semilla constante', 'Mantén 7 días de racha.', 'streak_days', 7, 50),
  ('word_explorer', 'Explorador de la Palabra', 'Completa 10 actividades.', 'activities_completed', 10, 50)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 11. NOTAS DE IMPLEMENTACIÓN
-- ============================================================
-- 1) Hono debe ser el único que escriba en la base en producción.
-- 2) El frontend PWA guarda en IndexedDB y sincroniza a /sync/events.
-- 3) client_event_id evita duplicados si se reintenta la sincronización.
-- 4) Para demo rápida, activity.config permite crear juegos sin migrar BD.
-- 5) En una fase futura pueden migrar cada tipo de juego a tablas propias.
-- ============================================================

-- Completa la gobernanza de gamificación, ajustes, notificaciones y trazabilidad.
-- Toda recompensa de XP se registra desde el backend en movimiento_xp.

create table if not exists public.configuracion_plataforma (
  clave text primary key,
  categoria text not null default 'general',
  valor jsonb not null default '{}'::jsonb,
  descripcion text,
  actualizado_por uuid references public.usuario_app(id) on delete set null,
  actualizado_en timestamptz not null default now()
);

create table if not exists public.movimiento_xp (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuario_app(id) on delete cascade,
  origen text not null,
  origen_id uuid,
  cantidad integer not null check (cantidad <> 0),
  metadatos jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now()
);

create unique index if not exists uq_movimiento_xp_origen
  on public.movimiento_xp(usuario_id, origen, origen_id)
  where origen_id is not null;
create index if not exists ix_movimiento_xp_usuario_fecha
  on public.movimiento_xp(usuario_id, creado_en desc);

create table if not exists public.racha_usuario (
  usuario_id uuid primary key references public.usuario_app(id) on delete cascade,
  dias_actuales integer not null default 0 check (dias_actuales >= 0),
  dias_maximos integer not null default 0 check (dias_maximos >= 0),
  ultima_actividad_fecha date,
  actualizado_en timestamptz not null default now()
);

create table if not exists public.notificacion_usuario (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuario_app(id) on delete cascade,
  tipo text not null,
  titulo text not null,
  mensaje text not null,
  datos jsonb not null default '{}'::jsonb,
  leida_en timestamptz,
  creado_en timestamptz not null default now()
);
create index if not exists ix_notificacion_usuario_fecha
  on public.notificacion_usuario(usuario_id, creado_en desc);
create index if not exists ix_notificacion_usuario_pendiente
  on public.notificacion_usuario(usuario_id, leida_en)
  where leida_en is null;

-- Conserva los XP históricos ya otorgados, sin volver a premiarlos.
insert into public.movimiento_xp (usuario_id, origen, origen_id, cantidad, metadatos, creado_en)
select
  ep.usuario_id,
  case ep.tipo_evento
    when 'tema_completado' then 'tema'
    when 'actividad_respondida' then 'actividad'
    when 'actividad_completada' then 'actividad'
    when 'recompensa_reclamada' then 'recompensa'
    else 'evento'
  end,
  coalesce(ep.actividad_id, ep.tema_id, ep.id),
  ep.xp_otorgada,
  jsonb_build_object('evento_progreso_id', ep.id, 'migrado', true),
  ep.recibido_en_servidor
from public.evento_progreso ep
where ep.xp_otorgada <> 0
on conflict do nothing;

insert into public.configuracion_plataforma (clave, categoria, valor, descripcion)
values
  ('gamificacion.racha_zona_horaria', 'gamificacion', '"America/Guayaquil"'::jsonb, 'Zona horaria IANA usada para calcular rachas.'),
  ('gamificacion.xp_tema_habilitado', 'gamificacion', 'true'::jsonb, 'Permite otorgar XP al completar temas.'),
  ('gamificacion.xp_actividad_habilitado', 'gamificacion', 'true'::jsonb, 'Permite otorgar XP al completar actividades.'),
  ('plataforma.modo_mantenimiento', 'general', 'false'::jsonb, 'Bloquea temporalmente las rutas de usuario.'),
  ('plataforma.nombre', 'general', '"Semillas"'::jsonb, 'Nombre visible de la plataforma.'),
  ('contenido.maximo_mb_imagen', 'media', '8'::jsonb, 'Tamaño máximo recomendado para imágenes.'),
  ('contenido.maximo_mb_audio', 'media', '30'::jsonb, 'Tamaño máximo recomendado para audio.'),
  ('contenido.maximo_mb_video', 'media', '150'::jsonb, 'Tamaño máximo recomendado para video.')
on conflict (clave) do nothing;

-- RLS: el navegador nunca consulta estas tablas directamente.
alter table public.configuracion_plataforma enable row level security;
alter table public.movimiento_xp enable row level security;
alter table public.racha_usuario enable row level security;
alter table public.notificacion_usuario enable row level security;

revoke all on public.configuracion_plataforma from anon, authenticated;
revoke all on public.movimiento_xp from anon, authenticated;
revoke all on public.racha_usuario from anon, authenticated;
revoke all on public.notificacion_usuario from anon, authenticated;

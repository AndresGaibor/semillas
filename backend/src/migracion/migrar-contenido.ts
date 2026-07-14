#!/usr/bin/env bun
/**
 * migrar-contenido.ts
 * Copia tablas de contenido y objetos Storage desde Supabase origen al destino.
 * Uso: bun --env-file=.dev.vars run src/migracion/migrar-contenido.ts
 *
 * Excluye: auth.*, usuario_app, perfiles, progreso, eventos, clubes, auditoría.
 * Idempotente: ON CONFLICT DO NOTHING en todas las tablas con PK.
 */

import postgres from "postgres";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cargarConfiguracionMigracion, type ConfiguracionMigracion } from "./contenido.config.ts";
import { writeFileSync } from "node:fs";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ConteoTabla {
  origen: number;
  destino: number;
}

interface ConteoStorage {
  bucket: string;
  copiados: number;
  errores: number;
}

export interface ManifiestoMigracion {
  iniciadoEn: string;
  completadoEn: string;
  tablas: Record<string, ConteoTabla>;
  storage: ConteoStorage[];
  adminUserId: string | undefined;
  errores: string[];
}

// ─── Configuración de tablas en orden de dependencias ────────────────────────

interface ConfigTabla {
  nombre: string;
  /** Columnas que referencian usuario_app (no migrado) → se fuerzan a null */
  nulificar: string[];
  /** Columnas PK para el ON CONFLICT. Vacío = DO NOTHING sin target (tablas sin PK única). */
  pkCols: string[];
}

export const TABLAS: ConfigTabla[] = [
  // Catálogos base
  { nombre: "testamento_biblico",    nulificar: [],                                         pkCols: ["id"] },
  { nombre: "libro_biblico",         nulificar: [],                                         pkCols: ["id"] },
  { nombre: "version_biblica",       nulificar: [],                                         pkCols: ["id"] },
  { nombre: "grupo_edad",            nulificar: [],                                         pkCols: ["id"] },
  { nombre: "tipo_paso_crecer",      nulificar: [],                                         pkCols: ["id"] },
  { nombre: "tipo_actividad",        nulificar: [],                                         pkCols: ["id"] },
  { nombre: "regla_nivel",           nulificar: [],                                         pkCols: ["id"] },
  { nombre: "logro",                 nulificar: [],                                         pkCols: ["id"] },
  // Media (FK a usuario_app → null)
  { nombre: "recurso_multimedia",    nulificar: ["creado_por"],                             pkCols: ["id"] },
  // Contenido
  { nombre: "senda",                 nulificar: [],                                         pkCols: ["id"] },
  { nombre: "tema",                  nulificar: ["creado_por", "revisado_por", "publicado_por"], pkCols: ["id"] },
  { nombre: "tema_grupo_edad",       nulificar: [],                                         pkCols: [] },   // sin PK definida
  { nombre: "paso_tema",             nulificar: [],                                         pkCols: ["id"] },
  { nombre: "contenido_paso_tema",   nulificar: [],                                         pkCols: ["id"] },
  { nombre: "pregunta_reflexion",    nulificar: [],                                         pkCols: ["id"] },
  { nombre: "versiculo_clave",       nulificar: [],                                         pkCols: ["id"] },
  { nombre: "referencia_biblica",    nulificar: [],                                         pkCols: ["id"] },
  { nombre: "actividad",             nulificar: [],                                         pkCols: ["id"] },
  { nombre: "opcion_actividad",      nulificar: [],                                         pkCols: ["id"] },
  { nombre: "paquete_sin_conexion",  nulificar: [],                                         pkCols: ["id"] },
  // Configuración global (FK a usuario_app → null)
  { nombre: "configuracion_plataforma", nulificar: ["actualizado_por"],                     pkCols: ["clave"] },
];

// ─── Helpers de base de datos ─────────────────────────────────────────────────

function conectarDb(url: string): postgres.Sql {
  return postgres(url, {
    prepare: false, // requerido para pgbouncer/Supabase pooler
    max: 3,
  });
}

async function copiarTabla(
  origen: postgres.Sql,
  destino: postgres.Sql,
  cfg: ConfigTabla
): Promise<ConteoTabla> {
  const { nombre, nulificar, pkCols } = cfg;

  const filas = await origen`SELECT * FROM ${origen(nombre)}`;
  const origenCount = filas.length;

  if (origenCount === 0) {
    console.log(`  ○ ${nombre}: 0 filas`);
    return { origen: 0, destino: 0 };
  }

  // Transformar: nulificar columnas que referencian usuario_app
  const rows = nulificar.length === 0
    ? filas
    : filas.map((f) => {
        const r = { ...f };
        for (const col of nulificar) r[col] = null;
        return r;
      });

  const CHUNK = 200;
  let destinoCount = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);

    if (pkCols.length > 0) {
      // Con PK conocida: ON CONFLICT (pk) DO NOTHING
      // OVERRIDING SYSTEM VALUE para tablas con serial/identity PK
      const serialTablas = ["testamento_biblico", "libro_biblico"];
      const overriding = serialTablas.includes(nombre);
      const conflictTarget = pkCols.map((c) => `"${c}"`).join(", ");
      const result = await destino.unsafe(
        buildInsertSQL(nombre, chunk, `ON CONFLICT (${conflictTarget}) DO NOTHING`, overriding),
        buildValues(chunk)
      );
      destinoCount += result.count;
    } else {
      // Sin PK definida: insertar fila a fila capturando duplicados
      for (const row of chunk) {
        try {
          const r = await destino`INSERT INTO ${destino(nombre)} ${destino([row])}`;
          destinoCount += r.count;
        } catch {
          // fila duplicada — ignorar
        }
      }
    }
  }

  // Resetear secuencia para tablas con serial PK
  if (nombre === "testamento_biblico" || nombre === "libro_biblico") {
    await destino.unsafe(
      `SELECT setval(pg_get_serial_sequence('${nombre}', 'id'), COALESCE((SELECT MAX(id) FROM "${nombre}"), 1))`
    );
  }

  const icon = destinoCount === origenCount ? "✓" : "~";
  console.log(`  ${icon} ${nombre}: ${origenCount} origen → ${destinoCount} insertadas`);
  return { origen: origenCount, destino: destinoCount };
}

/** Construye SQL parametrizado para INSERT masivo.
 *  OVERRIDING SYSTEM VALUE fuerza el valor de columnas serial/identity. */
function buildInsertSQL(
  tabla: string,
  rows: Record<string, unknown>[],
  conflictClause: string,
  overriding = false
): string {
  const cols = Object.keys(rows[0]!).map((c) => `"${c}"`).join(", ");
  const override = overriding ? "OVERRIDING SYSTEM VALUE" : "";
  const values = rows
    .map((_, i) =>
      "(" +
      Object.keys(rows[0]!).map((__, j) => `$${i * Object.keys(rows[0]!).length + j + 1}`).join(", ") +
      ")"
    )
    .join(", ");
  return `INSERT INTO "${tabla}" (${cols}) ${override} VALUES ${values} ${conflictClause}`;
}

/** Serializa valores: jsonb objects → string; Date → ISO string */
function buildValues(rows: Record<string, unknown>[]): unknown[] {
  return rows.flatMap((r) =>
    Object.values(r).map((v) => {
      if (v instanceof Date) return v.toISOString();
      if (v !== null && typeof v === "object" && !Array.isArray(v)) return JSON.stringify(v);
      if (Array.isArray(v)) return JSON.stringify(v);
      return v;
    })
  );
}

// ─── Helpers de Storage ───────────────────────────────────────────────────────

async function listarObjetos(
  client: SupabaseClient,
  bucket: string,
  prefijo = ""
): Promise<string[]> {
  const { data, error } = await client.storage.from(bucket).list(prefijo, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error || !data) return [];

  const rutas: string[] = [];
  for (const item of data) {
    if (item.id === null) {
      // carpeta
      const subPath = prefijo ? `${prefijo}/${item.name}` : item.name;
      rutas.push(...(await listarObjetos(client, bucket, subPath)));
    } else {
      rutas.push(prefijo ? `${prefijo}/${item.name}` : item.name);
    }
  }
  return rutas;
}

async function copiarStorage(
  origenClient: SupabaseClient,
  destinoClient: SupabaseClient
): Promise<ConteoStorage[]> {
  const { data: buckets, error } = await origenClient.storage.listBuckets();
  if (error || !buckets?.length) {
    console.log("  ○ Sin buckets en origen.");
    return [];
  }

  const resultados: ConteoStorage[] = [];

  for (const bucket of buckets) {
    process.stdout.write(`  ○ Bucket [${bucket.name}]: creando en destino...`);
    await destinoClient.storage.createBucket(bucket.name, {
      public: bucket.public,
      allowedMimeTypes: (bucket as { allowed_mime_types?: string[] | null }).allowed_mime_types ?? undefined,
      fileSizeLimit: (bucket as { file_size_limit?: number | null }).file_size_limit ?? undefined,
    });
    process.stdout.write(" OK\n");

    const rutas = await listarObjetos(origenClient, bucket.name);
    console.log(`    ${rutas.length} objetos encontrados`);

    let copiados = 0;
    let errores = 0;

    for (const ruta of rutas) {
      const { data: blob, error: dlErr } = await origenClient.storage.from(bucket.name).download(ruta);
      if (dlErr || !blob) {
        console.warn(`    ✗ download ${ruta}: ${dlErr?.message}`);
        errores++;
        continue;
      }
      const { error: ulErr } = await destinoClient.storage.from(bucket.name).upload(ruta, blob, { upsert: true });
      if (ulErr) {
        console.warn(`    ✗ upload ${ruta}: ${ulErr.message}`);
        errores++;
        continue;
      }
      copiados++;
    }

    const icon = errores === 0 ? "✓" : "~";
    console.log(`    ${icon} ${copiados} copiados, ${errores} errores`);
    resultados.push({ bucket: bucket.name, copiados, errores });
  }

  return resultados;
}

// ─── Función principal exportable ────────────────────────────────────────────

export async function ejecutarMigracionContenido(
  config: ConfiguracionMigracion
): Promise<ManifiestoMigracion> {
  const manifiesto: ManifiestoMigracion = {
    iniciadoEn: new Date().toISOString(),
    completadoEn: "",
    tablas: {},
    storage: [],
    adminUserId: config.destinoAdminAuthUserId,
    errores: [],
  };

  const origenDb = conectarDb(config.origen.databaseUrl);
  const destinoDb = conectarDb(config.destino.databaseUrl);
  const origenClient = createClient(config.origen.url, config.origen.secretKey);
  const destinoClient = createClient(config.destino.url, config.destino.secretKey);

  try {
    // 1. Tablas de contenido
    console.log("\n📋  Copiando tablas de contenido...");
    for (const tabla of TABLAS) {
      try {
        manifiesto.tablas[tabla.nombre] = await copiarTabla(origenDb, destinoDb, tabla);
      } catch (e) {
        const msg = `Error tabla ${tabla.nombre}: ${e instanceof Error ? e.message : e}`;
        console.error(`  ✗ ${msg}`);
        manifiesto.errores.push(msg);
      }
    }

    // 2. Storage
    console.log("\n📦  Copiando Storage...");
    try {
      manifiesto.storage = await copiarStorage(origenClient, destinoClient);
    } catch (e) {
      const msg = `Error Storage: ${e instanceof Error ? e.message : e}`;
      console.error(`  ✗ ${msg}`);
      manifiesto.errores.push(msg);
    }

    // 3. Admin (si se proveyó el UUID)
    if (config.destinoAdminAuthUserId) {
      console.log("\n👤  Insertando usuario administrador...");
      try {
        const existente = await destinoDb`
          SELECT id FROM usuario_app WHERE id_externo = ${config.destinoAdminAuthUserId} LIMIT 1
        `;
        if (existente.length === 0) {
          await destinoDb`
            INSERT INTO usuario_app (id, id_externo, nombre_visible, proveedor, rol, activo, creado_en, actualizado_en)
            VALUES (gen_random_uuid(), ${config.destinoAdminAuthUserId}, 'Administrador', 'correo', 'administrador', true, now(), now())
          `;
          console.log("  ✓ Admin insertado.");
        } else {
          console.log("  ○ Admin ya existe — omitiendo.");
        }
      } catch (e) {
        const msg = `Error admin: ${e instanceof Error ? e.message : e}`;
        console.error(`  ✗ ${msg}`);
        manifiesto.errores.push(msg);
      }
    } else {
      console.log("\n⚠️  DESTINO_ADMIN_AUTH_USER_ID no configurado — admin omitido.");
    }
  } finally {
    await origenDb.end();
    await destinoDb.end();
  }

  manifiesto.completadoEn = new Date().toISOString();

  // Guardar manifiesto local
  const archivoManifiesto = `./migration-manifest-${Date.now()}.json`;
  writeFileSync(archivoManifiesto, JSON.stringify(manifiesto, null, 2));
  console.log(`\n💾  Manifiesto guardado en ${archivoManifiesto}`);

  return manifiesto;
}

// ─── Punto de entrada ─────────────────────────────────────────────────────────

if (import.meta.main) {
  const config = cargarConfiguracionMigracion();

  console.log("🌱  Semillas — Migración de contenido");
  console.log(`   Origen:  ${config.origen.url}`);
  console.log(`   Destino: ${config.destino.url}`);
  console.log(`   Admin:   ${config.destinoAdminAuthUserId ?? "(omitido)"}`);

  ejecutarMigracionContenido(config)
    .then((m) => {
      console.log("\n─── Resumen ───────────────────────────────");
      for (const [tabla, c] of Object.entries(m.tablas)) {
        const ok = c.origen === c.destino ? "✓" : "⚠";
        console.log(`  ${ok} ${tabla.padEnd(30)} ${c.destino}/${c.origen}`);
      }
      for (const s of m.storage) {
        const ok = s.errores === 0 ? "✓" : "⚠";
        console.log(`  ${ok} Storage[${s.bucket}]: ${s.copiados} copiados, ${s.errores} errores`);
      }
      if (m.errores.length > 0) {
        console.error(`\n❌  ${m.errores.length} error(es) durante la migración.`);
        for (const e of m.errores) console.error(`   - ${e}`);
        process.exit(1);
      }
      console.log("\n✅  Migración completada sin errores.");
    })
    .catch((e) => {
      console.error("\n❌  Migración fallida:", e);
      process.exit(1);
    });
}

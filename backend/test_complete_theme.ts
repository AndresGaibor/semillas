import { createClient } from '@supabase/supabase-js';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema, crearDb } from "./src/db/client";
import { crearProgressRepository } from "./src/modules/progress/progress.repository";

const connectionString = 'postgresql://postgres:BaseConocimientoSeguridad@db.dmddyzftrkktzctrurmo.supabase.co:5432/postgres';
const clientePostgres = postgres(connectionString, { prepare: false });
const db = drizzle(clientePostgres, { schema });

async function run() {
  const userId = '6a3063e4-0ddc-4ad1-bb7f-605834870e58';
  const themeId = '47a2e22f-86da-466f-92ff-1847d85de609';
  
  const repo = crearProgressRepository(db);
  
  console.log('Sending tema_completado event directly to progress repository...');
  
  try {
    const result = await repo.registrarEvento(userId, {
      evento_id_cliente: 'f87a82ed-cfbf-488f-9a74-d4b998cfb46f', // random UUID
      tipo_evento: 'tema_completado',
      tema_id: themeId,
      ocurrido_en_cliente: new Date().toISOString(),
    });
    console.log('Result:', result);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

run();

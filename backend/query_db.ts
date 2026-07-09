import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dmddyzftrkktzctrurmo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZGR5emZ0cmtrdHpjdHJ1cm1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzIwNjYxOSwiZXhwIjoyMDk4NzgyNjE5fQ.2wsM31YUh0pFeeIS9jHKqhRuwezbASErBvYtHwz9aZw'
);

async function run() {
  const themeId = '47a2e22f-86da-466f-92ff-1847d85de609'; // El tema que ya tiene el quiz

  const { data: pasos } = await supabase.from('paso_tema').select('*').eq('tema_id', themeId);
  console.log('Pasos del tema origen:', pasos);

  if (pasos && pasos.length > 0) {
    for (const paso of pasos) {
      const { data: actividades } = await supabase.from('actividad').select('*').eq('paso_id', paso.id);
      console.log(`Actividades del paso ${paso.id}:`, actividades);

      if (actividades && actividades.length > 0) {
        for (const act of actividades) {
          const { data: opciones } = await supabase.from('opcion_actividad').select('*').eq('actividad_id', act.id);
          console.log(`Opciones de actividad ${act.id}:`, opciones);
        }
      }
    }
  }
}

run();

import type { Perfil, Usuario } from "@/shared/api/api";
import { Item } from "@/features/perfil/componentes/Item";

interface SeccionPreferenciasProps {
  perfil: Perfil | null | undefined;
  usuario: Usuario | undefined;
}

export function SeccionPreferencias({
  perfil,
  usuario,
}: SeccionPreferenciasProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Ajustes</p>
      <h2 className="mt-1 text-xl font-black text-slate-800">Preferencias</h2>

      <dl className="mt-4 grid gap-3 text-sm">
        <Item label="Franja" value={perfil?.grupo_edad_id ?? "Sin definir"} />
        <Item label="Audio" value={perfil?.prefiere_audio ? "Sí" : "No"} />
        <Item label="Texto" value={perfil?.tamano_texto_preferido ?? "mediano"} />
        <Item label="Correo" value={usuario?.correo ?? "No vinculado"} />
      </dl>
    </section>
  );
}

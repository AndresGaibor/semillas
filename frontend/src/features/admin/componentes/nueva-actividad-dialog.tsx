import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { obtenerTemasAdmin } from "../admin.api";

type NuevaActividadDialogProps = {
  onClose: () => void;
};

export function NuevaActividadDialog({ onClose }: NuevaActividadDialogProps) {
  const navigate = useNavigate();
  const [selectedThemeId, setSelectedThemeId] = useState<string>("");

  const { data: temas, isLoading } = useQuery({
    queryKey: ["admin", "themes"],
    queryFn: () => obtenerTemasAdmin({ status: "publicado" }),
  });

  const handleCrear = () => {
    if (selectedThemeId) {
      navigate({
        to: "/admin/temas/$themeId/activities",
        params: { themeId: selectedThemeId },
        search: { form: "nueva" },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-black text-slate-800 mb-2">Nueva actividad</h2>
        <p className="text-sm text-slate-500 mb-4">
          Selecciona el tema al que quieres agregar la nueva actividad.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin text-primario" size={24} />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tema
              </label>
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/20 focus:border-[#2e9e5b]"
              >
                <option value="">Selecciona un tema...</option>
                {temas?.map((tema) => (
                  <option key={tema.id} value={tema.id}>
                    {tema.titulo}
                  </option>
                ))}
              </select>
            </div>

            {temas?.length === 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                <p className="text-xs text-amber-700">
                  <i className="fa-solid fa-triangle-exclamation mr-1" />
                  No hay temas publicados. Crea y publica un tema primero.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrear}
                disabled={!selectedThemeId}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2e9e5b] text-white text-sm font-bold hover:bg-[#267d4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { HelpCircle } from "lucide-react";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
import type { GrupoEdad } from "../shared/api/api";

import logoImg from "@/assets/images/logos/Logotipo.png";
import semillaImg from "@/assets/images/Ilustraciones/Semilla.png";
import exploradoresImg from "@/assets/images/Ilustraciones/Exploradores.png";
import embajadoresImg from "@/assets/images/Ilustraciones/Embajadores.png";

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingPage,
});

const imagenesGrupo: Record<string, string> = {
  semillas: semillaImg,
  exploradores: exploradoresImg,
  embajadores: embajadoresImg,
};

const fallbacksGrupoEdad: GrupoEdad[] = [
  {
    id: "semillas",
    codigo: "semillas",
    nombre: "Semillas",
    edad_minima: 5,
    edad_maxima: 8,
    descripcion: "Descubre a Dios con historias y actividades sencillas.",
    orden: 1,
  },
  {
    id: "exploradores",
    codigo: "exploradores",
    nombre: "Exploradores",
    edad_minima: 9,
    edad_maxima: 12,
    descripcion: "Aprende más de Dios y entiende su Palabra.",
    orden: 2,
  },
  {
    id: "embajadores",
    codigo: "embajadores",
    nombre: "Embajadores",
    edad_minima: 13,
    edad_maxima: 17,
    descripcion: "Profundiza tu fe y vive con propósito.",
    orden: 3,
  },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: obtenerGruposEdad,
  });

  const data = useMemo(() => {
    if (ageGroupsQuery.data && ageGroupsQuery.data.length > 0) {
      return ageGroupsQuery.data;
    }
    return fallbacksGrupoEdad;
  }, [ageGroupsQuery.data]);

  // Pre-seleccionar la franja de "Semillas" por defecto una vez cargados los datos
  useEffect(() => {
    if (data && data.length > 0) {
      const semillas = data.find(
        (g) => g.codigo.toLowerCase() === "semillas"
      );
      setSelectedGroupId(semillas ? semillas.id : (data[0]?.id || ""));
    }
  }, [data]);

  const handleContinue = () => {
    if (selectedGroupId) {
      localStorage.setItem("onboarding_grupo_edad_id", selectedGroupId);
      navigate({ to: "/onboarding/customize" as any });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 text-left">
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src={logoImg}
            alt="Logo de Semillas"
            className="w-14 h-14 object-contain"
          />
          <div className="flex flex-col text-left">
            <span className="text-[1.95rem] font-extrabold text-[#512DA8] leading-none">
              Semillas
            </span>
            <span className="text-[0.64rem] text-[#43A047] font-semibold hidden xs:block">
              Crecer en la Palabra, vivir Su verdad
            </span>
          </div>
        </Link>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-2 bg-transparent border-[1.5px] border-[#e5e7eb] rounded-full px-4 py-2 font-bold text-sm text-[#1A1A1A] cursor-pointer hover:border-[#B39DDB] hover:bg-[#EDE7F6] transition-all"
        >
          <HelpCircle size={16} />
          Ayuda
        </button>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 md:px-5 py-8 md:py-10">
        
        {/* Sección del Formulario */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#512DA8] mb-2 leading-tight">
            Elige tu franja de edad
          </h1>
          <p className="text-sm md:text-base text-[#5C5C5C] mb-8">
            Selecciona la opción que mejor te representa. Podrás cambiarla después.
          </p>

          {/* Indicador de Pasos (Tabs) */}
          <div className="flex bg-[#F4F5F7] rounded-xl p-1 mb-8 w-full max-w-[600px] mx-auto">
            <div className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-white text-[#7E57C2] shadow-sm">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#7E57C2]">1</span>
              Tu edad
            </div>
            <div className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 text-slate-400">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-slate-300">2</span>
              Tu información
            </div>
          </div>

          {/* PASO 1: Selección de Edad */}
          <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center md:items-stretch mb-8 w-full flex-1">
            {ageGroupsQuery.isLoading && (
              <p className="text-center text-[#123b2c]/40 font-semibold py-12 w-full">
                Cargando franjas...
              </p>
            )}

            {data?.map((ageGroup) => {
              const isSelected = selectedGroupId === ageGroup.id;
              const img = imagenesGrupo[ageGroup.codigo.toLowerCase()] || semillaImg;
              return (
                <label
                  key={ageGroup.id}
                  className={`w-full max-w-[400px] md:w-[280px] flex flex-row md:flex-col rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm overflow-hidden relative hover:-translate-y-1 hover:shadow-md ${
                    isSelected ? "border-[#7E57C2] bg-[#EDE7F6]" : "border-[#e5e7eb] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="age_group"
                    value={ageGroup.id}
                    checked={isSelected}
                    onChange={() => setSelectedGroupId(ageGroup.id)}
                    className="sr-only"
                  />

                  <div className="w-[100px] h-[110px] md:w-full md:h-[160px] flex-shrink-0 relative bg-[#e5f0f9]">
                    <img
                      src={img}
                      alt={ageGroup.nombre}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute flex items-center justify-center font-bold text-white bg-[#7E57C2] rounded-full shadow transition-all duration-200 top-1.5 right-1.5 w-5 h-5 text-[10px] md:top-4 md:right-4 md:w-8 md:h-8 md:text-lg ${
                        isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
                      }`}
                    >
                      ✓
                    </div>
                  </div>

                  <div className="p-3 md:p-4 flex-1 flex flex-col justify-center text-left">
                    <h2 className="text-base md:text-xl font-bold text-[#1A1A1A] mb-0.5 md:mb-1">
                      {ageGroup.nombre}
                    </h2>
                    <div className="text-xs md:text-sm font-semibold text-[#7E57C2] mb-1 md:mb-3">
                      {ageGroup.edad_minima || 5} - {ageGroup.edad_maxima || 8} años
                    </div>
                    <p className="text-xs md:text-sm text-[#5c5c5c] leading-[1.3] md:leading-normal">
                      {ageGroup.descripcion}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Footer del Formulario (Acciones) */}
          <div className="flex justify-end items-center mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={handleContinue}
              disabled={!selectedGroupId}
              className="bg-[#7E57C2] hover:bg-[#4527A0] text-white border-none rounded-lg px-8 py-3 text-base font-bold cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Ayuda */}
      <div
        onClick={() => setIsHelpOpen(false)}
        className={`fixed inset-0 bg-black/60 z-[1000] flex justify-center items-center backdrop-blur-[2px] transition-all duration-300 ${
          isHelpOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-2xl w-[90%] max-w-[450px] p-8 shadow-2xl transition-all duration-300 ${
            isHelpOpen ? "translate-y-0 scale-100" : "translate-y-5 scale-95"
          }`}
        >
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-xl font-extrabold text-[#512DA8] leading-tight">
              ¿Por qué elegir tu edad?
            </h3>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="bg-[#F5F5F5] border-none text-2xl w-8 h-8 rounded-full flex justify-center items-center text-[#5c5c5c] cursor-pointer hover:bg-[#EDE7F6] hover:text-[#4527A0] transition-all duration-200"
              aria-label="Cerrar modal"
            >
              &times;
            </button>
          </div>
          <div className="text-left">
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed mb-4">
              Queremos que tu experiencia en{" "}
              <strong className="font-bold text-[#512DA8]">Semillas</strong> sea la mejor
              posible. Al elegir tu franja de edad, adaptaremos el contenido, las historias y
              las actividades para que sean más afines a tus intereses y nivel de comprensión.
            </p>
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed">
              ¡No te preocupes! Siempre podrás cambiar esta configuración más adelante desde tu
              perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

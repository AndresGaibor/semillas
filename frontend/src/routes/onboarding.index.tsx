import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { HelpCircle } from "lucide-react";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
import type { GrupoEdad } from "../shared/api/api";

import logoImg from "@/assets/images/logos/Logotipo.png";

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingPage,
});

const fallbacksGrupoEdad: GrupoEdad[] = [
  {
    id: "semillas",
    codigo: "semillas",
    nombre: "Semillas",
    edad_minima: 5,
    edad_maxima: 8,
    descripcion: "Descubre a Dios con historias y actividades sencillas.",
    imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/semillas.png",
    orden: 1,
  },
  {
    id: "exploradores",
    codigo: "exploradores",
    nombre: "Exploradores",
    edad_minima: 9,
    edad_maxima: 12,
    descripcion: "Aprende más de Dios y entiende su Palabra.",
    imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/exploradores.png",
    orden: 2,
  },
  {
    id: "embajadores",
    codigo: "embajadores",
    nombre: "Embajadores",
    edad_minima: 13,
    edad_maxima: 17,
    descripcion: "Profundiza tu fe y vive con propósito.",
    imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/embajadores.png",
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
    <div className="min-h-screen bg-[#F7F4EC] flex flex-col font-sans text-[#123B2C]">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 w-full">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src={logoImg}
            alt="Logo de Semilla"
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
          className="flex items-center gap-2 bg-transparent border-2 border-slate-200 rounded-full px-4 py-2 font-bold text-sm text-[#1A1A1A] cursor-pointer hover:border-[#B39DDB] hover:bg-[#EDE7F6] transition-all"
        >
          <HelpCircle size={16} />
          Ayuda
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 md:py-12 md:px-6 max-w-[1200px] w-full mx-auto">
        <div className="text-center mb-8 max-w-lg">
          <div className="text-3xl md:text-4xl font-extrabold text-[#311B92] mb-3 leading-tight font-sans">
            Elige tu franja de edad
          </div>
          <p className="text-base text-[#5C5C5C]">
            Selecciona la opción que mejor te representa. Podrás cambiarla después.
          </p>
        </div>

        {/* Indicador de Pasos (Tabs) */}
        <div className="flex bg-[#F4F5F7] rounded-xl p-1 mb-10 w-full max-w-[600px] mx-auto border border-slate-100">
          <div className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-white text-[#7E57C2] shadow-sm">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#7E57C2] font-bold">1</span>
            Tu edad
          </div>
          <div className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 text-slate-400 bg-transparent">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-slate-300 font-bold">2</span>
            Tu información
          </div>
        </div>

        {/* Cards Grid */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 mb-8 w-full justify-center flex-wrap">
          {ageGroupsQuery.isLoading && (
            <p className="text-center text-[#123b2c]/40 font-semibold py-12 w-full">
              Cargando franjas...
            </p>
          )}

          {data?.map((ageGroup) => {
            const isSelected = selectedGroupId === ageGroup.id;
            return (
              <label
                key={ageGroup.id}
                className={`flex flex-col rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm overflow-hidden relative hover:-translate-y-1 hover:shadow-md w-full max-w-[400px] md:w-[280px] ${
                  isSelected ? "border-[#7E57C2] bg-[#EDE7F6]" : "border-slate-200 bg-white hover:border-[#7E57C2]/30"
                }`}
              >
                <input
                  type="radio"
                  name="age_group"
                  value={ageGroup.id}
                  checked={isSelected}
                  onChange={() => setSelectedGroupId(ageGroup.id)}
                  className="absolute opacity-0 w-0 h-0"
                />
                
                <div className="w-full h-[160px] relative bg-[#e5f0f9] overflow-hidden shrink-0">
                  <img
                    src={ageGroup.imagen_url ?? undefined}
                    alt={ageGroup.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute flex items-center justify-center font-bold text-white bg-[#7E57C2] rounded-full shadow transition-all duration-200 top-4 right-4 w-8 h-8 text-lg ${
                      isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    }`}
                  >
                    ✓
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-start text-left">
                  <div className="text-xl font-bold text-[#1A1A1A] mb-1">
                    {ageGroup.nombre}
                  </div>
                  <div className="text-sm font-semibold text-[#7E57C2] mb-3">
                    {ageGroup.edad_minima} - {ageGroup.edad_maxima} años
                  </div>
                  <p className="text-sm text-[#5C5C5C] leading-relaxed">
                    {ageGroup.descripcion}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-[400px] flex justify-center mt-4">
          <button
            onClick={handleContinue}
            disabled={!selectedGroupId}
            className="w-full border-none rounded-lg py-4 text-base font-bold transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
            style={{
              background: selectedGroupId ? '#7E57C2' : '#E0E0E0',
              color: selectedGroupId ? '#FFFFFF' : '#9E9E9E',
              cursor: selectedGroupId ? 'pointer' : 'not-allowed'
            }}
          >
            Continuar
          </button>
        </div>
      </main>

      {/* Modal de Ayuda */}
      <div
        onClick={() => setIsHelpOpen(false)}
        className={`fixed inset-0 bg-black/60 z-[1000] flex justify-center items-center backdrop-blur-[2px] transition-all duration-300 ${
          isHelpOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-2xl w-[90%] max-w-[450px] p-8 shadow-2xl transition-all duration-300 text-left ${
            isHelpOpen ? "translate-y-0 scale-100" : "translate-y-5 scale-95"
          }`}
        >
          <div className="flex justify-between items-start mb-5">
            <div className="text-xl font-extrabold text-[#512DA8] leading-tight m-0">
              ¿Por qué elegir tu edad?
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="border-none text-2xl w-8 h-8 rounded-full flex justify-center items-center text-[#5C5C5C] hover:text-[#4527A0] transition-all duration-200"
              style={{ background: '#F5F5F5', cursor: 'pointer' }}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
          </div>
          <div className="text-left">
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed mb-4">
              Queremos que tu experiencia en <strong className="font-bold text-[#512DA8]">Semillas</strong> sea la mejor posible. Al elegir tu franja de edad, adaptaremos el contenido, las historias y las actividades para que sean más afines a tus intereses y nivel de comprensión.
            </p>
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed">
              ¡No te preocupes! Siempre podrás cambiar esta configuración más adelante desde tu perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

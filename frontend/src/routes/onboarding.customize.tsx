import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { actualizarPerfil } from "../features/profile/profile.api";

// Logo
import logoImg from "@/assets/images/logos/Logotipo.png";

import { MAPA_AVATARES } from "@/shared/constants/avatares";
import fondoAvatarImg from "@/assets/images/backgrounds/Fondo Avatar.png";

export const Route = createFileRoute("/onboarding/customize")({
  component: CustomizePage,
});

function CustomizePage() {
  const navigate = useNavigate();
  const [grupoEdadId, setGrupoEdadId] = useState<string>("");
  
  // Datos del formulario
  const [nickname, setNickname] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("onboarding_grupo_edad_id");
    if (savedId) {
      setGrupoEdadId(savedId);
    }
  }, []);

  const actualizarPerfilMutation = useMutation({
    mutationFn: actualizarPerfil,
    onSuccess() {
      // Limpiamos la selección temporal
      localStorage.removeItem("onboarding_grupo_edad_id");
      navigate({ to: "/app" });
    },
  });

  const isUuid = (str: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

  const handleFinish = () => {
    actualizarPerfilMutation.mutate({
      grupo_edad_id: isUuid(grupoEdadId) ? grupoEdadId : null,
      apodo: nickname,
      url_avatar: String(selectedAvatar),
    });
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
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1200px] w-full mx-auto px-4 md:px-5 py-8 md:py-10 gap-8 md:gap-10">
        
        {/* Sección del Formulario (Paso 2) */}
        <div className="flex-1 lg:flex-[3] bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#512DA8] mb-2 leading-tight">
            Crea tu perfil
          </h1>
          <p className="text-sm md:text-base text-[#5C5C5C] mb-8">
            Cuéntanos un poco sobre ti para personalizar tu experiencia en Semillas.
          </p>

          {/* Indicador de Pasos (Tabs) */}
          <div className="flex bg-[#F4F5F7] rounded-xl p-1 mb-8 w-full">
            <button
              onClick={() => navigate({ to: "/onboarding" })}
              className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border-0 cursor-pointer bg-transparent text-slate-400 hover:text-slate-600"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#7E57C2]">✓</span>
              Tu edad
            </button>
            <div className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-white text-[#7E57C2] shadow-sm">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#7E57C2]">2</span>
              Tu información
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            {/* Form Input Apodo */}
            <div className="flex flex-col">
              <label className="flex items-center gap-3 text-lg font-bold text-[#1A1A1A] mb-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7E57C2] text-white text-sm font-bold">1</span>
                ¿Cómo quieres que te llamemos?
              </label>
              <p className="text-sm text-[#5C5C5C] mb-2 font-semibold">Apodo</p>
              <div className="relative flex items-center w-full">
                <svg className="absolute left-4 w-5 h-5 text-[#7E57C2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  id="nicknameInput"
                  maxLength={20}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Escribe tu apodo"
                  className="w-full pl-12 pr-4 py-4 border border-[#e5e7eb] rounded-xl text-base font-sans outline-none focus:border-[#7E57C2] transition-colors"
                />
              </div>
              <div className="text-right text-xs text-slate-400 mt-1">
                {nickname.length}/20 caracteres (Máx. 20)
              </div>
            </div>

            {/* Form Selección Avatar */}
            <div className="flex flex-col">
              <label className="flex items-center gap-3 text-lg font-bold text-[#1A1A1A] mb-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7E57C2] text-white text-sm font-bold">2</span>
                Elige un avatar que te represente
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isSelected = selectedAvatar === num;
                  return (
                    <label key={num} className="cursor-pointer block relative">
                      <input
                        type="radio"
                        name="avatar"
                        value={num}
                        checked={isSelected}
                        onChange={() => setSelectedAvatar(num)}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-2xl p-1 transition-all duration-200 relative hover:scale-105 ${
                        isSelected ? "border-[#7E57C2] bg-[#EDE7F6]" : "border-transparent bg-white"
                      }`}>
                        <img
                          src={MAPA_AVATARES[String(num)]}
                          alt={`Avatar ${num}`}
                          className="w-full h-auto rounded-xl block"
                        />
                        <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#7E57C2] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow transition-all duration-200 ${
                          isSelected ? "opacity-100 scale-100" : "opacity-0 scale-0"
                        }`}>
                          ✓
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer del Formulario (Acciones) */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate({ to: "/onboarding" })}
              className="bg-transparent border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold text-base cursor-pointer hover:bg-slate-50 transition-colors"
            >
              ← Atrás
            </button>

            <button
              onClick={handleFinish}
              disabled={!nickname.trim() || actualizarPerfilMutation.isPending}
              className="bg-[#7E57C2] hover:bg-[#4527A0] text-white border-none rounded-lg px-8 py-3 text-base font-bold cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actualizarPerfilMutation.isPending ? "Guardando..." : "Finalizar →"}
            </button>
          </div>
        </div>

        {/* Sección de Vista Previa (Preview Section - Lado Derecho) */}
        <div className="w-full lg:w-[350px] flex flex-col justify-start">
          <h2 className="flex items-center justify-center gap-2 text-lg font-bold text-[#4527A0] mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z"/>
            </svg>
            Así se verá tu perfil
          </h2>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-center pb-8">
            <div className="w-full h-[180px] bg-[#e5f0f9] relative">
              <img
                src={fondoAvatarImg}
                alt="Fondo de avatar"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="w-[140px] h-[140px] mx-auto -mt-[70px] mb-4 rounded-full border-6 border-white bg-white relative z-10 overflow-hidden shadow-md">
              <img
                src={MAPA_AVATARES[String(selectedAvatar)]}
                alt="Tu avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-extrabold text-[#1A1A1A] mb-6 px-4 truncate max-w-full">
              {nickname.trim() || "Tú"}
            </h3>
            
            <div className="bg-[#E8F5E9] mx-6 p-4 rounded-xl text-left flex flex-col gap-1">
              <strong className="text-[#2E7D32] text-base font-bold flex items-center gap-2">
                ¡Bienvenido a Semillas!
              </strong>
              <p className="text-[#2E2E2E] text-xs leading-normal">
                Aquí aprenderás, explorarás y harás del mundo un lugar mejor.
              </p>
            </div>
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
              Preguntas Frecuentes
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
            <strong className="font-bold text-[#512DA8] block mb-1">¿Qué es el apodo?</strong>
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed mb-4">
              Es un nombre corto o sobrenombre que usaremos para llamarte dentro de la aplicación de manera amigable. Te sugerimos no usar tu nombre real completo para proteger tu privacidad.
            </p>
            
            <strong className="font-bold text-[#512DA8] block mb-1">¿Para qué sirve el avatar?</strong>
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed">
              Tu avatar es el personaje que te representará en las actividades de Semillas. Elige el que más te guste o con el que más te identifiques. ¡No te preocupes, podrás cambiarlo más adelante!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

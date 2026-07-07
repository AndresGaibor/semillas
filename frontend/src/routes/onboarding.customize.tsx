import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { actualizarPerfil } from "../features/profile/profile.api";

import logoImg from "@/assets/images/logos/Logotipo.png";
import { MAPA_AVATARES } from "@/shared/constants/avatares";
import fondoAvatarImg from "@/assets/images/backgrounds/Fondo Avatar.png";

export const Route = createFileRoute("/onboarding/customize")({
  component: CustomizePage,
});

function CustomizePage() {
  const navigate = useNavigate();
  const [grupoEdadId, setGrupoEdadId] = useState<string>("");
  
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
      localStorage.removeItem("onboarding_grupo_edad_id");
      navigate({ to: "/app" });
    },
  });

  const isUuid = (str: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

  const handleFinish = () => {
    actualizarPerfilMutation.mutate({
      grupo_edad_id: isUuid(grupoEdadId) ? grupoEdadId : null,
      apodo: nickname.trim(),
      url_avatar: String(selectedAvatar),
    });
  };

  const isButtonEnabled = nickname.trim().length > 0 && !actualizarPerfilMutation.isPending;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans text-[#123B2C]">
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
            <span className="text-[0.64rem] text-[#43A047] font-semibold max-[480px]:hidden">
              Crecer en la Palabra, vivir Su verdad
            </span>
          </div>
        </Link>

        <button onClick={() => setIsHelpOpen(true)} className="flex items-center gap-2 bg-transparent border border-slate-200 rounded-full px-4 py-2 font-bold text-sm text-[#1A1A1A] cursor-pointer hover:border-[#B39DDB] hover:bg-[#EDE7F6] transition-all">
          <HelpCircle size={16} />
          Ayuda
        </button>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row max-w-[1200px] w-full mx-auto px-4 md:px-6 py-10 gap-10 items-start shrink-0">
        <div className="flex-[3] w-full bg-white p-6 md:p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col text-left shrink-0">
          <div className="text-[32px] font-extrabold text-[#512DA8] mb-2 leading-tight">
            Crea tu perfil
          </div>
          <p className="text-base text-[#5C5C5C] mb-8">
            Cuéntanos un poco sobre ti para personalizar tu experiencia en Semillas.
          </p>

          <div className="flex bg-[#F4F5F7] rounded-xl p-1 mb-10 w-full shrink-0">
            <button onClick={() => navigate({ to: "/onboarding" })} className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border-0 cursor-pointer bg-transparent text-slate-400 hover:text-slate-600 transition-colors">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#7E57C2] font-bold">✓</span>
              Tu edad
            </button>
            <div className="flex-1 text-center py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-white text-[#7E57C2] shadow-sm">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#7E57C2] font-bold">2</span>
              Tu información
            </div>
          </div>

          <div className="mb-8 flex flex-col shrink-0">
            <label className="flex items-center gap-3 text-lg font-bold text-[#1A1A1A] mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7E57C2] text-white text-sm font-bold shrink-0">1</span>
              ¿Cómo quieres que te llamemos?
            </label>
            <p className="text-sm text-[#5C5C5C] mb-2">Apodo</p>
            <div className="relative flex items-center w-full">
              <svg className="absolute left-4 w-5 h-5 text-[#7E57C2] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                type="text"
                maxLength={20}
                placeholder="Escribe tu apodo"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full border border-slate-200 rounded-xl text-base outline-none focus:border-[#7E57C2] transition-colors text-[#1A1A1A] bg-white font-sans pl-12 pr-4 py-4"
              />
            </div>
            <div className="text-right text-xs text-[#9E9E9E] mt-1 font-medium">
              Máx. 20 caracteres
            </div>
          </div>

          <div className="mb-8 flex flex-col shrink-0">
            <label className="flex items-center gap-3 text-lg font-bold text-[#1A1A1A] mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7E57C2] text-white text-sm font-bold shrink-0">2</span>
              Elige un avatar que te represente
            </label>
            <div className="grid grid-cols-2 max-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 w-full shrink-0">
              {Array.from({ length: 10 }).map((_, index) => {
                const avatarNum = index + 1;
                const isSelected = selectedAvatar === avatarNum;
                return (
                  <label key={avatarNum} className="cursor-pointer block relative">
                    <input
                      type="radio"
                      name="avatar"
                      value={avatarNum}
                      checked={isSelected}
                      onChange={() => setSelectedAvatar(avatarNum)}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <div className={`border-2 rounded-2xl p-1 transition-all duration-200 relative hover:scale-105 ${
                      isSelected ? "border-[#7E57C2] bg-[#EDE7F6]" : "border-transparent bg-transparent"
                    }`}>
                      <img src={MAPA_AVATARES[String(avatarNum)]} alt={`Avatar ${avatarNum}`} className="w-full h-auto rounded-xl block" />
                      <div className={`absolute -top-2 -right-2 w-6 h-6 bg-[#7E57C2] text-white rounded-full flex items-center justify-center font-bold text-sm shadow z-10 transition-all duration-200 ${
                        isSelected ? "opacity-100 scale-100" : "opacity-0 scale-0"
                      }`}>✓</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200 pt-6 mt-10 w-full shrink-0">
            <button
              onClick={() => navigate({ to: "/onboarding" })}
              className="bg-transparent border border-[#9E9E9E] text-[#2E2E2E] px-6 py-3 rounded-lg font-bold text-base cursor-pointer transition-all hover:bg-[#F5F5F5] flex items-center justify-center gap-2"
            >
              &larr; Atrás
            </button>
            <button
              onClick={handleFinish}
              disabled={!isButtonEnabled}
              className="border-none px-8 py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
              style={{
                background: isButtonEnabled ? '#7E57C2' : '#E0E0E0',
                color: isButtonEnabled ? '#FFFFFF' : '#9E9E9E',
                cursor: isButtonEnabled ? 'pointer' : 'not-allowed'
              }}
            >
              {actualizarPerfilMutation.isPending ? "Finalizando..." : "Finalizar \u2192"}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[350px] flex flex-col justify-start shrink-0 lg:sticky lg:top-[120px]">
          <div className="flex items-center justify-center gap-2 text-lg font-bold text-[#4527A0] mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z"/>
            </svg>
            Así se verá tu perfil
          </div>
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden text-center pb-8 w-full">
            <div className="w-full h-[180px] bg-[#e5f0f9] relative overflow-hidden">
              <img src={fondoAvatarImg} alt="Fondo del avatar" className="w-full h-full object-cover" />
            </div>
            <div className="w-[140px] h-[140px] mx-auto -mt-[70px] mb-4 rounded-full border-[6px] border-white bg-white relative z-10 overflow-hidden shadow-md">
              <img src={MAPA_AVATARES[String(selectedAvatar)]} alt="Tu avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-2xl font-extrabold text-[#1A1A1A] mb-6 px-4 truncate max-w-full leading-none font-sans">{nickname.trim() || "Tú"}</div>
            
            <div className="bg-[#E8F5E9] mx-6 p-4 rounded-xl text-left flex flex-col gap-1">
              <strong className="text-[#2E7D32] text-base font-bold flex items-center gap-2">
                ¡Bienvenido a Semillas!
              </strong>
              <p className="text-[#2E2E2E] text-xs leading-relaxed">Aquí aprenderás, explorarás y harás del mundo un lugar mejor.</p>
            </div>
          </div>
        </div>
      </main>

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
            <div className="text-xl font-extrabold text-[#512DA8] leading-tight m-0">Preguntas Frecuentes</div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="border-none text-2xl w-8 h-8 rounded-full flex justify-center items-center text-[#5C5C5C] hover:text-[#4527A0] transition-all duration-200"
              style={{ background: '#F5F5F5', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>
          <div className="text-left">
            <strong className="font-bold text-[#512DA8] block mb-1">¿Qué es el apodo?</strong>
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed mb-4">Es un nombre corto o sobrenombre que usaremos para llamarte dentro de la aplicación de manera amigable. Te sugerimos no usar tu nombre real completo para proteger tu privacidad.</p>
            
            <strong className="font-bold text-[#512DA8] block mb-1">¿Para qué sirve el avatar?</strong>
            <p className="text-[15px] text-[#2E2E2E] leading-relaxed">Tu avatar es el personaje que te representará en las actividades de Semillas. Elige el que más te guste o con el que más te identifiques. ¡No te preocupes, podrás cambiarlo más adelante!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

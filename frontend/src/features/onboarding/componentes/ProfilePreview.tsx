import { MAPA_AVATARES } from "@/shared/constants/avatares";
import fondoAvatarImg from "@/assets/images/backgrounds/Fondo Avatar.png";

interface ProfilePreviewProps {
  selectedAvatar: number;
  nickname: string;
}

export function ProfilePreview({ selectedAvatar, nickname }: ProfilePreviewProps) {
  return (
    <div
      className="onboarding-preview flex flex-col min-w-[280px] max-w-[380px]"
    >
      <div className="flex items-center justify-center gap-2 text-lg font-bold text-[#4527A0] mb-6">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z" />
        </svg>
        Así se verá tu perfil
      </div>

      <div className="onboarding-preview-card bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden text-center pb-8">
        <div className="w-full h-[180px] bg-[#e5f0f9] relative overflow-hidden">
          <img src={fondoAvatarImg} alt="Fondo del avatar" className="w-full h-full object-cover block" />
        </div>
        <div className="w-[140px] h-[140px] -mt-[70px] mx-auto mb-4 rounded-full border-8 border-white bg-white relative z-10 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <img
            src={MAPA_AVATARES[String(selectedAvatar)]}
            alt="Tu avatar"
            className="w-full h-full object-cover block"
          />
        </div>
        <div className="text-2xl font-extrabold text-[#1A1A1A] mb-6 px-4 overflow-hidden text-ellipsis whitespace-nowrap">
          {nickname.trim() || "Tú"}
        </div>
        <div className="bg-[#E8F5E9] mx-6 p-4 rounded-xl text-left">
          <strong className="text-[#2E7D32] text-base font-bold block mb-1">
            ¡Bienvenido a Semillas!
          </strong>
          <p className="text-[#2E2E2E] text-sm leading-relaxed m-0">
            Aquí aprenderás, explorarás y harás del mundo un lugar mejor.
          </p>
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { Lock, Share2, Star, Users } from "lucide-react";
import { BarraProgreso, ProgresoCircular } from "@/componentes/ui/indicadores-progreso";

export const SidebarDerecho: React.FC = () => {
  return (
    <aside className="w-[300px] border-l border-[#E2E8F0] p-5 bg-white flex flex-col gap-5 flex-shrink-0">

      <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
          <h3 className="text-xs font-extrabold text-[#123B2C]">Tu progreso</h3>
          <button type="button" className="text-[10px] text-[#6C3AED] font-bold hover:underline">Ver detalles</button>
        </div>
        <div className="flex items-center gap-4">
          <ProgresoCircular porcentaje={72} etiqueta="Completado" color="verde" tamano={70} />
          <div className="flex-1">
            <h4 className="text-xs font-black text-gray-800 leading-none">Nivel 7</h4>
            <p className="text-[10px] text-[#2E9E5B] font-bold mt-1">Explorador</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 font-bold">
              <Star className="size-3 text-[#FBBF24] fill-[#FBBF24]" />
              <span>1,250 XP acumulados</span>
            </div>
            <div className="mt-3">
              <BarraProgreso valor={550} maximo={1000} mostrarEtiquetas={false} color="morado" />
              <span className="text-[9px] text-gray-400 font-bold mt-1 block">550 XP para el nivel 8</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
          <h3 className="text-xs font-extrabold text-[#123B2C]">Próxima meta</h3>
          <button type="button" className="text-[10px] text-[#6C3AED] font-bold hover:underline">Ver todas</button>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-11 h-14 bg-[#FAF5FF] border border-[#6C3AED]/20 rounded-xl flex items-center justify-center text-[#6C3AED] flex-shrink-0">
            <Lock className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-gray-800 leading-none">Nivel 8</h4>
            <span className="text-[10px] text-[#6C3AED] font-extrabold mt-1 block">1,500 XP</span>
            <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-snug">
              Sigue aprendiendo para alcanzar el siguiente nivel.
            </p>
            <div className="mt-3">
              <BarraProgreso valor={1250} maximo={1500} mostrarEtiquetas={false} color="morado" />
              <span className="text-[8px] text-gray-400 font-bold mt-1 block self-end">1,250 / 1,500</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-extrabold text-[#123B2C]">Comparte tu logro</h3>
        <p className="text-[10px] text-gray-400 font-semibold leading-snug">
          ¡Comparte esta imagen con tus amigos y tu club!
        </p>

        <div className="w-full h-28 bg-[#ECFDF5] rounded-xl flex items-center justify-center overflow-hidden border border-[#D1FAE5] relative">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <path d="M 0 90 Q 50 60 100 90 Q 150 110 200 95 L 200 110 L 0 110 Z" fill="#D1FAE5" />
            <path d="M 0 100 Q 100 80 200 100 L 200 110 L 0 110 Z" fill="#A7F3D0" />
            <circle cx="150" cy="40" r="15" fill="#FEF3C7" opacity="0.4" />
            <circle cx="150" cy="40" r="8" fill="#FBBF24" opacity="0.7" />
            <path d="M 140 40 L 160 40 L 157 70 Q 150 78 143 70 Z" fill="#FBBF24" />
            <circle cx="150" cy="40" r="10" fill="#FBBF24" />
            <path d="M 145 72 L 155 72 L 155 85 L 145 85 Z" fill="#D97706" />
            <path d="M 135 85 L 165 85 L 165 92 L 135 92 Z" fill="#78350F" />
            <path d="M 137 45 Q 130 50 138 60" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
            <path d="M 163 45 Q 170 50 162 60" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
            <rect x="50" y="70" width="22" height="30" rx="6" fill="#10B981" />
            <circle cx="61" cy="52" r="14" fill="#FDBA74" />
            <path d="M 47 50 Q 55 35 65 42 Q 73 38 75 48 C 73 45 60 45 47 50 Z" fill="#78350F" />
            <circle cx="56" cy="52" r="1.5" fill="#1E293B" />
            <circle cx="66" cy="52" r="1.5" fill="#1E293B" />
            <path d="M 58 58 Q 61 62 64 58" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <path d="M 50 75 Q 35 60 40 50" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 72 75 Q 85 60 82 50" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 border border-[#6C3AED] rounded-xl text-xs font-bold text-[#6C3AED] hover:bg-violet-50 transition-all"
        >
          <Share2 className="size-4" />
          <span>Compartir</span>
        </button>
      </section>

      <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
          <h3 className="text-xs font-extrabold text-[#123B2C]">Insignia reciente</h3>
          <button type="button" className="text-[10px] text-[#6C3AED] font-bold hover:underline">Ver todas</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-16 flex items-center justify-center flex-shrink-0 relative">
            <svg viewBox="0 0 100 115" className="w-full h-full" fill="none">
              <path
                d="M50 0C77.7778 0 95.8333 13.5833 100 40.8333C100 78.4333 75.9259 102.35 50 115C24.0741 102.35 0 78.4333 0 40.8333C4.16667 13.5833 22.2222 0 50 0Z"
                fill="url(#gradiente-reciente)"
              />
              <path
                d="M50 4C74.7778 4 91.8333 16.5833 96 42.8333C96 75.4333 73.9259 97.35 50 109C26.0741 97.35 4 75.4333 4 42.8333C8.16667 16.5833 25.2222 4 50 4Z"
                stroke="#5B30C8"
                strokeWidth="4"
              />
              <defs>
                <linearGradient id="gradiente-reciente" x1="0" y1="0" x2="100" y2="115">
                  <stop offset="0%" stopColor="#6C3AED" />
                  <stop offset="100%" stopColor="#5B30C8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Users className="size-6 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-gray-800 leading-none">Buen Pastor</h4>
            <span className="text-[10px] text-[#2E9E5B] font-bold mt-1.5 block">Obtenida hoy</span>
            <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-snug">
              Completaste la senda &quot;Dios cuida de mí&quot;.
            </p>
          </div>
        </div>
      </section>

    </aside>
  );
};

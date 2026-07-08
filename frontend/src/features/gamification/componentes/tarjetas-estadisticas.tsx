import * as React from "react";
import { Award, Flame, Star, Trophy } from "lucide-react";
import { BarraProgreso } from "@/componentes/ui/indicadores-progreso";
import { EscudoEstadistica } from "./escudo-estadistica";

export const TarjetasEstadisticas: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
        <EscudoEstadistica
          colorBg="linear-gradient(135deg, #6C3AED, #5B30C8)"
          colorBorder="#FAF5FF"
          icono={<Trophy className="size-5 text-white" />}
        />
        <div className="flex-1">
          <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">Nivel actual</span>
          <h3 className="text-lg font-black text-gray-800 leading-none">7</h3>
          <p className="text-[11px] text-[#6C3AED] font-bold mt-1">Explorador</p>
          <div className="mt-3">
            <BarraProgreso valor={550} maximo={1000} mostrarEtiquetas={false} color="morado" />
            <span className="text-[9px] text-gray-400 font-bold mt-1 block">550 XP para el nivel 8</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, #3D8BD4, #2563EB)" }}
        >
          <Star className="size-6 text-white fill-white" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">XP total</span>
          <h3 className="text-lg font-black text-gray-800 leading-none">1,250</h3>
          <p className="text-[11px] text-gray-500 font-semibold mt-1">Experiencia acumulada</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, #EE6C4D, #C2410C)" }}
        >
          <Flame className="size-6 text-white fill-white" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">Racha actual</span>
          <h3 className="text-lg font-black text-gray-800 leading-none">12 días</h3>
          <p className="text-[11px] text-[#EE6C4D] font-bold mt-1">¡Sigue así!</p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <span
                key={d}
                className="size-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                style={{ backgroundColor: "#EE6C4D" }}
              >
                ✓
              </span>
            ))}
            <span className="size-3.5 rounded-full border border-gray-300 bg-white" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
        <EscudoEstadistica
          colorBg="linear-gradient(135deg, #2E9E5B, #123B2C)"
          colorBorder="#F0FDF4"
          icono={<Award className="size-5 text-white" />}
        />
        <div className="flex-1">
          <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">Insignias</span>
          <h3 className="text-lg font-black text-gray-800 leading-none">8 / 16</h3>
          <p className="text-[11px] text-[#2E9E5B] font-bold mt-1">50% completado</p>
          <div className="mt-3">
            <BarraProgreso valor={8} maximo={16} mostrarEtiquetas={false} color="verde" />
          </div>
        </div>
      </div>
    </div>
  );
};

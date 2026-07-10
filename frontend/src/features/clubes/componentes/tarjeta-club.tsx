import { Copy, UserPlus, Share2, Shield, Edit2, Check } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { Boton } from "@/componentes/ui/boton";
import bannerKidsImg from "@/assets/images/Ilustraciones/Ninños 2.png";

type PropsTarjetaClub = {
  nombre: string;
  descripcion: string;
  codigoInvitacion: string;
  miembros: number;
  onCopiarCodigo: () => void;
  onCompartirCodigo: () => void;
  onInvitar: () => void;
  onEditar: () => void;
  copiado: boolean;
};

export function TarjetaClub({
  nombre,
  descripcion,
  codigoInvitacion,
  miembros,
  onCopiarCodigo,
  onCompartirCodigo,
  onInvitar,
  onEditar,
  copiado,
}: PropsTarjetaClub) {
  return (
    <Card sombra="sm" className="p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-[42%] h-48 rounded-2xl overflow-hidden bg-[#F7F4EC] relative flex items-center justify-center flex-shrink-0">
          <img src={bannerKidsImg} alt={nombre} className="h-full object-cover" />
        </div>

        <div className="flex-1 text-left flex flex-col justify-center w-full">
          <div className="flex items-center gap-2.5 mb-1.5">
            <h2 className="text-2xl font-black text-[#1E1B4B]">{nombre}</h2>
            <Boton
              variante="texto"
              tamano="pequeno"
              onClick={onEditar}
              className="!p-1 hover:!bg-slate-100 !rounded-full !text-slate-400 hover:!text-slate-600"
            >
              <Edit2 size={16} />
            </Boton>
          </div>
          <p className="text-sm font-semibold text-slate-400 mb-6">{descripcion}</p>

          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Código de invitación</span>
              <div className="flex items-center gap-2 bg-[#F3E8FF] border border-[#E9D5FF] px-3.5 py-1.5 rounded-xl">
                <span className="text-sm font-black text-[#7E57C2] tracking-wide">{codigoInvitacion}</span>
                <Boton
                  variante="texto"
                  tamano="pequeno"
                  onClick={onCopiarCodigo}
                  className="!p-0 !text-[#7E57C2] hover:!text-[#5B21B6]"
                  title="Copiar código"
                >
                  {copiado ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </Boton>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Miembros</span>
              <div className="flex items-center gap-2 py-1.5">
                <i className="fa-solid fa-users text-slate-400 text-sm" />
                <span className="text-base font-black text-slate-700">{miembros}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full">
            <Boton
              variante="contorno"
              tamano="pequeno"
              onClick={onCompartirCodigo}
              className="!flex-1 !border-[#7E57C2] hover:!bg-[#F3E8FF] !text-[#7E57C2] !bg-white !py-3 !px-4 !rounded-2xl !text-xs !font-bold !shadow-sm !min-w-[140px]"
            >
              <Share2 size={14} />
              Compartir código
            </Boton>
            <Boton
              variante="primario"
              tamano="pequeno"
              onClick={onInvitar}
              className="!flex-1 !bg-[#7E57C2] hover:!bg-[#5B21B6] !text-white !py-3 !px-4 !rounded-2xl !text-xs !font-bold !shadow-sm !min-w-[140px]"
            >
              <UserPlus size={14} />
              Invitar
            </Boton>
          </div>
        </div>

        <div className="absolute top-6 right-6 w-16 h-16 bg-[#7E57C2] rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <Shield size={32} className="fill-white/10" />
        </div>
      </div>
    </Card>
  );
}

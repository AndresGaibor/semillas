import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { StateView } from "@/componentes/ui/state-view";

interface ContenidoPaso {
  titulo?: string;
  cuerpo?: string;
}

interface BotonesAccion {
  siguiente: {
    to: string;
    themeId: string;
    label: string;
    color?: string;
    onClick?: () => void;
  };
  regresar: {
    to: string;
    themeId: string;
  };
}

interface FaseConfig {
  numero: number;
  nombre: string;
  imagenSrc: string;
  colorAccent: string;
  colorLoader: string;
}

interface CrecerLayoutProps {
  fase: FaseConfig;
  paso: ContenidoPaso | null;
  isLoading: boolean;
  isError: boolean;
  children?: ReactNode;
  botonesAccion: BotonesAccion;
  emptyMessage?: string;
}

export function CrecerLayout({
  fase,
  paso,
  isLoading,
  isError,
  children,
  botonesAccion,
  emptyMessage = "No hay contenido ni actividades disponibles para esta fase."
}: CrecerLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-slate-50 pb-16 animate-in fade-in duration-500">
      <div className="w-full px-4 sm:px-8 pt-6 pb-10 flex flex-col gap-6 relative z-10">
        
        {/* Banner con imagen de fase */}
        <div className="w-full h-[200px] sm:h-[280px] rounded-[2.5rem] overflow-hidden relative shadow-lg shadow-slate-200/50">
          <img 
            src={fase.imagenSrc} 
            alt={`Fase ${fase.nombre}`} 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
            <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">{fase.nombre}</span>
          </div>
        </div>

        {/* Loading / Error / Contenido */}
        <StateView
          cargando={isLoading}
          error={isError ? "Ocurrió un error al cargar la fase." : null}
          colorCarga={fase.colorLoader}
          mensajeCarga={`Cargando fase ${fase.nombre}...`}
        >
          <ContentCard paso={paso} numeroFase={fase.numero} emptyMessage={emptyMessage}>
            {children}
          </ContentCard>
        </StateView>

        {/* Botones de acción - solo visibles cuando NO está cargando ni hay error */}
        {!isLoading && !isError && (
          <BotonesAccion botones={botonesAccion} colorAccent={fase.colorAccent} />
        )}
      </div>
    </div>
  );
}

interface ContentCardProps {
  paso: ContenidoPaso | null;
  numeroFase: number;
  emptyMessage: string;
  children?: ReactNode;
}

function ContentCard({ paso, numeroFase, emptyMessage, children }: ContentCardProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col w-full">
      <div className="flex justify-start items-center mb-6">
        <span className="bg-slate-100 text-slate-600 font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wider">
          Fase {numeroFase}
        </span>
      </div>

      <div className="flex-1 flex flex-col w-full gap-6">
        {paso && (
          <div className="mb-4">
            {paso.titulo && <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{paso.titulo}</h2>}
            {paso.cuerpo && <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{paso.cuerpo}</div>}
          </div>
        )}

        {children ? children : (
          !paso && (
            <div className="flex-1 flex flex-col justify-center items-center opacity-50 h-full py-12">
              <p className="text-lg text-slate-400 font-medium text-center">{emptyMessage}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

interface BotonesAccionProps {
  botones: BotonesAccion;
  colorAccent: string;
}

function BotonesAccion({ botones, colorAccent }: BotonesAccionProps) {
  return (
    <div className="w-full mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
      <Link
        to={botones.siguiente.to}
        params={{ themeId: botones.siguiente.themeId }}
        onClick={(e) => {
          if (botones.siguiente.onClick) {
            botones.siguiente.onClick();
          }
        }}
        className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 text-white"
        style={{ 
          backgroundColor: colorAccent, 
          boxShadow: `0 20px 25px -5px ${colorAccent}33, 0 8px 10px -6px ${colorAccent}1a`
        }}
      >
        {botones.siguiente.label}
      </Link>
      <Link
        to={botones.regresar.to}
        params={{ themeId: botones.regresar.themeId }}
        className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-bold text-lg text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
      >
        Regresar
      </Link>
    </div>
  );
}

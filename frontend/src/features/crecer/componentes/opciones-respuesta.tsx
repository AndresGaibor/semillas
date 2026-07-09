interface Opcion {
  id: string;
  etiqueta?: string | null;
  texto: string;
}

interface OpcionesRespuestaProps {
  opciones: Opcion[];
  colorHover: string;
}

export function OpcionesRespuesta({ opciones, colorHover }: OpcionesRespuestaProps) {
  return (
    <div className="flex flex-col gap-3 mt-4">
      {opciones.map((opcion) => (
        <div 
          key={opcion.id} 
          className={`flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[${colorHover}] hover:bg-slate-50/30 cursor-pointer transition-all`}
          style={{ 
            '--hover-color': colorHover 
          } as React.CSSProperties}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
            {opcion.etiqueta}
          </span>
          <span className="text-slate-700 font-medium">{opcion.texto}</span>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { playSound } from "../../lib/audio";

interface Par {
  izquierda: string;
  derecha: string;
}

interface RelacionarParesActividadProps {
  actividad: any;
  onComplete: (actividadId: string, xpRecompensa: number) => void;
}

export function RelacionarParesActividad({ actividad, onComplete }: RelacionarParesActividadProps) {
  const [paresIzquierda, setParesIzquierda] = useState<Par[]>([]);
  const [paresDerecha, setParesDerecha] = useState<Par[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<{ left: number, right: number } | null>(null);
  const [completed, setCompleted] = useState(false);

  // Inicialización y mezcla de la columna derecha
  useEffect(() => {
    const configuracionPares = actividad.configuracion?.pares || [];
    
    // Asignamos un ID único a cada par para compararlos fácilmente
    const paresConId = configuracionPares.map((p: any, index: number) => ({
      ...p,
      id: `par_${index}`
    }));

    setParesIzquierda([...paresConId]);

    // Barajar la columna derecha
    const barajados = [...paresConId].sort(() => Math.random() - 0.5);
    setParesDerecha(barajados);
  }, [actividad]);

  const handleLeftClick = (index: number, parId: string) => {
    if (matchedPairs.includes(parId) || completed || errorPair) return;
    playSound('pop');
    setSelectedLeft(index === selectedLeft ? null : index);
  };

  const handleRightClick = (index: number, parId: string) => {
    if (matchedPairs.includes(parId) || completed || errorPair) return;
    playSound('pop');
    
    // Si ya hay uno seleccionado en la izquierda, comprobamos si hacen match
    if (selectedLeft !== null) {
      setSelectedRight(index);
      
      const leftId = paresIzquierda[selectedLeft].id;
      const rightId = paresDerecha[index].id;

      if (leftId === rightId) {
        // MATCH CORRECTO
        playSound('acertado');
        const newMatched = [...matchedPairs, leftId];
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);

        // Verificar si completó todos
        if (newMatched.length === paresIzquierda.length) {
          setTimeout(() => {
            setCompleted(true);
            playSound('insignia');
            onComplete(actividad.id, actividad.xp_recompensa || 0);
          }, 600);
        }
      } else {
        // MATCH INCORRECTO
        playSound('error');
        setErrorPair({ left: selectedLeft, right: index });
        
        // Limpiar error después de la animación
        setTimeout(() => {
          setErrorPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    } else {
      setSelectedRight(index === selectedRight ? null : index);
    }
  };

  if (!paresIzquierda.length) return <div className="p-4 text-center text-slate-500">No hay pares configurados.</div>;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto py-4 animate-in fade-in zoom-in-95">
      
      {!completed ? (
        <div className="w-full flex flex-col md:flex-row gap-8 mt-4">
          
          {/* Columna Izquierda */}
          <div className="flex-1 flex flex-col gap-4">
            <h4 className="text-center font-bold text-slate-400 mb-2 uppercase tracking-widest text-sm">Concepto</h4>
            {paresIzquierda.map((par: any, i) => {
              const isMatched = matchedPairs.includes(par.id);
              const isSelected = selectedLeft === i;
              const isError = errorPair?.left === i;

              let btnClass = "w-full text-left p-4 sm:p-5 rounded-2xl font-medium text-base sm:text-lg transition-all border-2 flex items-center justify-between shadow-sm relative break-words ";
              
              if (isMatched) {
                btnClass += "bg-green-100 border-green-500 text-green-800 opacity-90 scale-95";
              } else if (isError) {
                btnClass += "bg-red-50 border-red-500 text-red-700 animate-shake";
              } else if (isSelected) {
                btnClass += "bg-blue-50 border-blue-500 text-blue-800 ring-4 ring-blue-500/20 transform scale-[1.02] z-10";
              } else {
                btnClass += "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50 cursor-pointer";
              }

              return (
                <button
                  key={`left_${par.id}`}
                  onClick={() => handleLeftClick(i, par.id)}
                  className={btnClass}
                >
                  <span>{par.izquierda}</span>
                  {isMatched && <CheckCircle2 className="text-green-600" />}
                </button>
              );
            })}
          </div>

          {/* Columna Derecha */}
          <div className="flex-1 flex flex-col gap-4">
            <h4 className="text-center font-bold text-slate-400 mb-2 uppercase tracking-widest text-sm">Definición</h4>
            {paresDerecha.map((par: any, i) => {
              const isMatched = matchedPairs.includes(par.id);
              const isSelected = selectedRight === i;
              const isError = errorPair?.right === i;

              let btnClass = "w-full text-left p-4 sm:p-5 rounded-2xl font-medium text-base sm:text-lg transition-all border-2 flex items-center justify-between shadow-sm relative break-words ";
              
              if (isMatched) {
                btnClass += "bg-green-100 border-green-500 text-green-800 opacity-90 scale-95";
              } else if (isError) {
                btnClass += "bg-red-50 border-red-500 text-red-700 animate-shake";
              } else if (isSelected) {
                btnClass += "bg-purple-50 border-purple-500 text-purple-800 ring-4 ring-purple-500/20 transform scale-[1.02] z-10";
              } else {
                btnClass += "bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50 cursor-pointer";
              }

              return (
                <button
                  key={`right_${par.id}_${i}`}
                  onClick={() => handleRightClick(i, par.id)}
                  className={btnClass}
                >
                  <span>{par.derecha}</span>
                  {isMatched && <CheckCircle2 className="text-green-600" />}
                </button>
              );
            })}
          </div>

        </div>
      ) : (
        /* Card de Completado */
        <div className="w-full p-8 bg-green-50 rounded-3xl border-2 border-green-200 text-center animate-in zoom-in-95 mt-8 shadow-sm">
          <div className="flex justify-center mb-6 text-green-500">
            <div className="bg-white p-4 rounded-full shadow-md">
              <Check size={64} strokeWidth={3} />
            </div>
          </div>
          <h4 className="text-3xl font-bold text-green-800 mb-4">¡Relación Perfecta!</h4>
          {actividad.retroalimentacion ? (
            <p className="text-green-700 text-xl font-medium max-w-lg mx-auto">{actividad.retroalimentacion}</p>
          ) : (
            <p className="text-green-700 text-xl font-medium">Has emparejado todos los conceptos correctamente.</p>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Check, ChevronLeft, RotateCw } from "lucide-react";
import { playSound } from "../../lib/audio";

interface FlashcardsProps {
  actividad: any;
  onComplete: (actividadId: string, xpRecompensa: number) => void;
}

export function Flashcards({ actividad, onComplete }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const opciones = actividad.opciones || [];
  const currentCard = opciones[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < opciones.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      if (!completed) {
        setCompleted(true);
        playSound('acertado');
        onComplete(actividad.id, actividad.xp_recompensa || 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  if (!opciones.length) return <div>No hay tarjetas disponibles.</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-4">
      {/* Indicador de progreso */}
      <div className="flex justify-between w-full mb-6 text-slate-500 font-bold px-2">
        <span>Tarjeta {currentIndex + 1} de {opciones.length}</span>
        {completed && <span className="text-green-500 flex items-center gap-1"><Check size={18} strokeWidth={3}/> ¡Repaso completado!</span>}
      </div>

      {/* Contenedor de la Tarjeta con Perspectiva 3D */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[3/2] cursor-pointer group perspective-1000 mb-8"
        onClick={handleFlip}
      >
        <div className={`w-full h-full absolute top-0 left-0 transition-transform duration-700 preserve-3d shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Lado Frontal */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-center justify-center p-8 text-center group-hover:border-purple-300 transition-colors">
            <span className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Concepto</span>
            <h3 className="text-4xl sm:text-5xl font-black text-slate-800">{currentCard?.texto}</h3>
            <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 font-medium">
              <RotateCw size={18} /> Toca para voltear
            </div>
          </div>

          {/* Lado Trasero */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center rotate-y-180">
            <span className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">Definición</span>
            <p className="text-2xl sm:text-3xl font-bold text-slate-700 leading-relaxed">{currentCard?.retroalimentacion}</p>
          </div>

        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between w-full gap-4">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-5 rounded-[1.5rem] bg-slate-100 text-slate-600 font-bold disabled:opacity-50 hover:bg-slate-200 transition-colors shadow-sm"
        >
          <ChevronLeft size={28} />
        </button>
        
        <button 
          onClick={handleNext}
          className={`flex-1 py-5 px-6 rounded-[1.5rem] font-black text-xl transition-all text-white shadow-xl hover:-translate-y-1 active:translate-y-0 ${completed ? 'bg-green-500 shadow-green-500/30' : 'bg-[#7c3aed] shadow-purple-500/30'}`}
        >
          {currentIndex === opciones.length - 1 ? (completed ? "¡Completado!" : "Finalizar Repaso") : "Siguiente Tarjeta"}
        </button>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

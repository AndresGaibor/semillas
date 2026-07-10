import { useState } from "react";
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { playSound } from "../../lib/audio";
import imgVerdadero from "../../assets/images/icons/Verdadero.png";
import imgFalso from "../../assets/images/icons/Falso.png";

interface VerdaderoFalsoActividadProps {
  actividad: any;
  onComplete: (actividadId: string, xpRecompensa: number) => void;
}

export function VerdaderoFalsoActividad({ actividad, onComplete }: VerdaderoFalsoActividadProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);

  const afirmaciones = actividad.configuracion?.afirmaciones || [];
  const currentAfirmacion = afirmaciones[currentIndex];

  if (!afirmaciones.length) return <div className="p-4 text-center text-slate-500">No hay afirmaciones configuradas.</div>;

  const selectedOption = answers[currentIndex] !== undefined ? answers[currentIndex] : null;

  const handleSelectOption = (esVerdadero: boolean) => {
    if (selectedOption !== null || completed) return; 
    
    setAnswers(prev => ({ ...prev, [currentIndex]: esVerdadero }));
    const correct = esVerdadero === currentAfirmacion.es_verdadero;
    
    if (correct) {
      playSound('acertado');
    } else {
      playSound('error');
    }
  };

  const handleNext = () => {
    if (currentIndex < afirmaciones.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (!completed) {
        setCompleted(true);
        playSound('insignia'); 
        onComplete(actividad.id, actividad.xp_recompensa || 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const renderButton = (isTrueButton: boolean) => {
    const isSelected = selectedOption === isTrueButton;
    const isCorrectAnswer = isTrueButton === currentAfirmacion.es_verdadero;
    
    let btnClass = "w-full text-left px-5 py-6 rounded-2xl font-medium text-xl sm:text-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 mb-4 ";
    let textClass = "text-slate-700";
    let iconClass = "text-slate-400";
    
    if (selectedOption === null) {
      btnClass += isTrueButton 
        ? "bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer shadow-sm" 
        : "bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer shadow-sm";
      iconClass = isTrueButton ? "text-blue-500" : "text-blue-500";
    } else {
      if (isSelected && isCorrectAnswer) {
        btnClass += "bg-green-50 border-green-500 z-10 shadow-sm";
        textClass = "text-slate-800 font-bold";
        iconClass = "text-green-500";
      } else if (isSelected && !isCorrectAnswer) {
        btnClass += "bg-red-50 border-red-400";
        textClass = "text-slate-800 font-bold";
        iconClass = "text-red-500";
      } else if (isCorrectAnswer) {
        btnClass += "bg-green-50/50 border-green-400 opacity-80";
        textClass = "text-slate-700 font-semibold";
        iconClass = "text-green-400";
      } else {
        btnClass += "bg-white border-slate-200 opacity-50";
        textClass = "text-slate-500";
      }
    }

    return (
      <button 
        onClick={() => handleSelectOption(isTrueButton)}
        disabled={selectedOption !== null}
        className={btnClass}
      >
        <div className={iconClass + " mb-2 flex justify-center"}>
          {isTrueButton ? (
            <img src={imgVerdadero} alt="Verdadero" className="w-20 h-20 object-contain drop-shadow-sm" />
          ) : (
            <img src={imgFalso} alt="Falso" className="w-20 h-20 object-contain drop-shadow-sm" />
          )}
        </div>
        <span className={textClass}>{isTrueButton ? "Verdadero" : "Falso"}</span>
        
        {isSelected && isCorrectAnswer && (
          <div className="absolute top-4 right-4 text-green-600"><Check size={28} strokeWidth={3} /></div>
        )}
        {isSelected && !isCorrectAnswer && (
          <div className="absolute top-4 right-4 text-red-500"><X size={28} strokeWidth={3} /></div>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-2 animate-in fade-in zoom-in-95">
      
      {/* Top Bar (Progress) */}
      <div className="flex justify-between w-full mb-8 bg-blue-50 text-blue-800 font-bold px-5 py-3 rounded-xl text-sm">
        <span>Afirmación {currentIndex + 1} de {afirmaciones.length}</span>
      </div>

      {/* Afirmación */}
      <div className="w-full mb-8 text-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xl sm:text-2xl font-medium text-slate-800">
          "{currentAfirmacion.texto}"
        </h3>
      </div>

      {/* Opciones */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mb-8 relative">
        <div className="flex-1 relative">
          {renderButton(true)}
        </div>
        <div className="flex-1 relative">
          {renderButton(false)}
        </div>
      </div>

      {/* Controles de Navegación */}
      {!completed && (
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 w-full mt-8">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-500 font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 disabled:opacity-0 transition-all"
          >
            <ArrowLeft size={18} /> Anterior
          </button>
          
          <button 
            onClick={handleNext}
            disabled={selectedOption === null}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-blue-200 text-blue-700 font-bold flex items-center justify-center gap-2 transition-colors hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            {currentIndex === afirmaciones.length - 1 ? "Finalizar" : "Siguiente"} <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Card de Completado */}
      {completed && (
        <div className="w-full p-8 bg-green-50 rounded-3xl border-2 border-green-200 text-center animate-in zoom-in-95 mt-8 shadow-sm">
          <div className="flex justify-center mb-6 text-green-500">
            <div className="bg-white p-4 rounded-full shadow-md">
              <Check size={64} strokeWidth={3} />
            </div>
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">¡Excelente Trabajo!</h4>
          {actividad.retroalimentacion ? (
            <p className="text-green-700 text-lg sm:text-xl font-medium max-w-lg mx-auto">{actividad.retroalimentacion}</p>
          ) : (
            <p className="text-green-700 text-lg sm:text-xl font-medium">Has respondido todas las afirmaciones.</p>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { playSound } from "../../lib/audio";

interface QuizActividadProps {
  actividad: any;
  onComplete: (actividadId: string, xpRecompensa: number) => void;
}

export function QuizActividad({ actividad, onComplete }: QuizActividadProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);

  const preguntas = actividad.configuracion?.preguntas || [];
  const currentQuestion = preguntas[currentQuestionIndex];

  if (!preguntas.length) return <div className="p-4 text-center text-slate-500">No hay preguntas configuradas.</div>;

  const selectedOption = answers[currentQuestionIndex] !== undefined ? answers[currentQuestionIndex] : null;

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null || completed) return; 
    
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: index }));
    const correct = index === currentQuestion.respuesta_correcta;
    
    if (correct) {
      playSound('acertado');
    } else {
      playSound('error');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < preguntas.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (!completed) {
        setCompleted(true);
        playSound('insignia'); 
        onComplete(actividad.id, actividad.xp_recompensa || 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-2 animate-in fade-in zoom-in-95">
      
      {/* Top Bar (Progress) */}
      <div className="flex justify-between w-full mb-8 bg-violet-50 text-violet-800 font-bold px-5 py-3 rounded-xl text-sm">
        <span>Pregunta {currentQuestionIndex + 1} de {preguntas.length}</span>
      </div>

      {/* Pregunta */}
      <div className="w-full mb-6 text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
          {currentQuestion.pregunta}
        </h3>
      </div>

      {/* Opciones */}
      <div className="w-full flex flex-col mb-8">
        {currentQuestion.opciones.map((opcion: string, index: number) => {
          const isSelected = selectedOption === index;
          const isCorrectAnswer = index === currentQuestion.respuesta_correcta;
          
          let btnClass = "w-full text-left px-5 py-4 rounded-xl font-medium text-base sm:text-lg border-2 transition-all flex items-center justify-between mb-3 ";
          let textClass = "text-slate-700";
          
          if (selectedOption === null) {
            btnClass += "bg-white border-slate-200 hover:border-violet-300 hover:bg-slate-50 cursor-pointer shadow-sm";
          } else {
            if (isSelected && isCorrectAnswer) {
              btnClass += "bg-green-50 border-green-500 z-10 shadow-sm";
              textClass = "text-slate-800 font-semibold";
            } else if (isSelected && !isCorrectAnswer) {
              btnClass += "bg-red-50 border-red-300";
              textClass = "text-slate-800 font-semibold";
            } else if (isCorrectAnswer) {
              // Mostrar cuál era la correcta si se equivocó
              btnClass += "bg-green-50/50 border-green-400 opacity-80";
              textClass = "text-slate-700";
            } else {
              btnClass += "bg-white border-slate-200 opacity-50";
              textClass = "text-slate-500";
            }
          }

          return (
            <button 
              key={index}
              onClick={() => handleSelectOption(index)}
              disabled={selectedOption !== null}
              className={btnClass}
            >
              <div className="flex items-center gap-4">
                <span className={`font-bold ${isSelected ? 'text-slate-800' : 'text-violet-800'}`}>
                  {letters[index]}.
                </span>
                <span className={textClass}>{opcion}</span>
              </div>
              {isSelected && isCorrectAnswer && <div className="text-green-600"><Check size={24} strokeWidth={2.5} /></div>}
              {isSelected && !isCorrectAnswer && <div className="text-red-500"><X size={24} strokeWidth={2.5} /></div>}
            </button>
          );
        })}
      </div>

      {/* Controles de Navegación */}
      {!completed && (
        <div className="w-full flex justify-between items-center mt-2 pt-6">
          <button 
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl border border-violet-200 text-violet-700 font-semibold flex items-center gap-2 transition-colors hover:bg-violet-50 disabled:opacity-0"
          >
            <ArrowLeft size={18} /> Anterior
          </button>
          
          <button 
            onClick={handleNext}
            disabled={selectedOption === null}
            className="px-6 py-3 rounded-xl border border-violet-200 text-violet-700 font-semibold flex items-center gap-2 transition-colors hover:bg-violet-50 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            {currentQuestionIndex === preguntas.length - 1 ? "Finalizar" : "Siguiente"} <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Card de Completado (Sin XP) */}
      {completed && (
        <div className="w-full p-6 bg-green-50 rounded-xl border border-green-200 text-center animate-in slide-in-from-bottom-2 mt-4">
          <h4 className="text-xl font-bold text-green-700 mb-1">¡Excelente Trabajo!</h4>
          <p className="text-green-600 text-sm">Has respondido todas las preguntas.</p>
        </div>
      )}
    </div>
  );
}

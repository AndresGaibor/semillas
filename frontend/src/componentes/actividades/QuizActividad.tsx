import { useState } from "react";
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { playSound } from "../../lib/audio";
import imgBannerQuiz from "../../assets/images/Ilustraciones/banner_quiz.png";

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
      <div 
        className="w-full mb-8 relative flex items-center justify-center p-8 sm:p-12 min-h-[160px] overflow-hidden rounded-3xl"
        style={{
          backgroundImage: `url(${imgBannerQuiz})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 text-center relative z-10">
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
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 w-full mt-8">
          <button 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-500 font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 disabled:opacity-0 transition-all"
          >
            <ArrowLeft size={18} /> Anterior
          </button>
          
          <button 
            onClick={handleNext}
            disabled={selectedOption === null}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-violet-200 text-violet-700 font-bold flex items-center justify-center gap-2 transition-colors hover:bg-violet-50 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            {currentQuestionIndex === preguntas.length - 1 ? "Finalizar" : "Siguiente"} <ArrowRight size={18} />
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
          <h4 className="text-3xl font-bold text-green-800 mb-4">¡Excelente Trabajo!</h4>
          {actividad.retroalimentacion ? (
            <p className="text-green-700 text-xl font-medium max-w-lg mx-auto">{actividad.retroalimentacion}</p>
          ) : (
            <p className="text-green-700 text-xl font-medium">Has respondido todas las preguntas.</p>
          )}
        </div>
      )}
    </div>
  );
}

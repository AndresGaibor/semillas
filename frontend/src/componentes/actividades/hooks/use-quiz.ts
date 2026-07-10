import { useState } from "react";
import { playSound } from "../../../lib/audio";

interface UseQuizProps {
  actividad: any;
  onComplete: (actividadId: string, xpRecompensa: number) => void;
}

export function useQuiz({ actividad, onComplete }: UseQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);

  const preguntas = actividad.configuracion?.preguntas || [];
  const currentQuestion = preguntas[currentQuestionIndex];

  const selectedOption = answers[currentQuestionIndex] !== undefined ? answers[currentQuestionIndex] : null;

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null || completed) return;

    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: index }));
    const correct = index === currentQuestion.respuesta_correcta;

    if (correct) {
      playSound("acertado");
    } else {
      playSound("error");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < preguntas.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      if (!completed) {
        setCompleted(true);
        playSound("insignia");
        onComplete(actividad.id, actividad.xp_recompensa || 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return {
    currentQuestionIndex,
    answers,
    completed,
    preguntas,
    currentQuestion,
    selectedOption,
    handleSelectOption,
    handleNext,
    handlePrev,
  };
}

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { playSound } from "../../lib/audio";
import dorsoCarta from "../../assets/images/Ilustraciones/flascards.png";
import { AlertaCompletado } from "@/componentes/ui/alerta-completado";

interface ParData {
  id: number;
  texto: string;
}

interface FlashcardItem {
  uid: string;
  parId: number;
  texto: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface FlashcardsProps {
  actividad: any;
  onComplete: (actividadId: string, xpRecompensa: number) => void;
}

export function Flashcards({ actividad, onComplete }: FlashcardsProps) {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Inicializar cartas
  useEffect(() => {
    const paresData: ParData[] = actividad.configuracion?.pares || [];
    
    // Duplicar para hacer parejas
    const deck: FlashcardItem[] = [];
    paresData.forEach((par) => {
      deck.push({ uid: `${par.id}_1`, parId: par.id, texto: par.texto, isFlipped: false, isMatched: false });
      deck.push({ uid: `${par.id}_2`, parId: par.id, texto: par.texto, isFlipped: false, isMatched: false });
    });

    // Barajar aleatoriamente
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [actividad]);

  const handleCardClick = (index: number) => {
    // Evitar clic si el tablero está bloqueado, si la carta ya está volteada o emparejada
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    playSound('pop'); // Sonidito de giro

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // Si volteamos dos cartas, comprobamos el match
    if (newFlippedIndices.length === 2) {
      setIsLocked(true); // Bloqueamos clics adicionales

      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.parId === secondCard.parId) {
        // MATCH CORRECTO
        setTimeout(() => {
          playSound('acertado');
          setCards(prev => {
            const matched = [...prev];
            matched[firstIndex].isMatched = true;
            matched[secondIndex].isMatched = true;
            return matched;
          });
          setFlippedIndices([]);
          setIsLocked(false);
          checkWinCondition(newCards);
        }, 500);
      } else {
        // MATCH INCORRECTO
        setTimeout(() => {
          playSound('error');
          setCards(prev => {
            const flippedBack = [...prev];
            flippedBack[firstIndex].isFlipped = false;
            flippedBack[secondIndex].isFlipped = false;
            return flippedBack;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1200);
      }
    }
  };

  const checkWinCondition = (currentCards: FlashcardItem[]) => {
    // Si todas las cartas están flipped (y matched)
    if (currentCards.every(card => card.isFlipped)) {
      setTimeout(() => {
        setCompleted(true);
        playSound('insignia');
        onComplete(actividad.id, actividad.xp_recompensa || 0);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto py-2 animate-in fade-in zoom-in-95">
      
      {!completed ? (
        <div className="w-full">
          {/* Grid responsivo: 2 col en móvil, 4 col en pantallas más grandes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 place-items-center">
            {cards.map((card, index) => {
              // Estilo base para matched
              const matchedStyle = card.isMatched ? "opacity-60 scale-95" : "";

              return (
                <div
                  key={card.uid}
                  className={`w-full h-24 sm:h-32 cursor-pointer transition-all duration-300 [perspective:1000px] ${matchedStyle}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div 
                    className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] shadow-md rounded-xl ${
                      card.isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                  >
                    {/* Reverso de la carta (boca abajo) */}
                    <div 
                      className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-slate-100 rounded-xl border-4 border-white flex items-center justify-center overflow-hidden"
                    >
                      <img 
                        src={dorsoCarta} 
                        alt="Reverso Flashcard" 
                        className="w-full h-full object-cover opacity-90 transition-transform hover:scale-110 duration-500"
                      />
                    </div>

                    {/* Frente de la carta (boca arriba) */}
                    <div 
                      className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border-2 sm:border-4 flex flex-col items-center justify-center p-2 text-center overflow-hidden ${
                        card.isMatched ? "bg-green-100 border-green-500" : "bg-amber-50 border-amber-400"
                      }`}
                    >
                      <p className={`font-bold ${card.isMatched ? "text-green-800" : "text-amber-700"} text-xs sm:text-sm break-words w-full px-1`}>
                        {card.texto}
                      </p>
                      {card.isMatched && <Check className="text-green-600 mt-1 shrink-0" size={16} strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <AlertaCompletado
          clase="mt-4"
          mensaje={actividad.retroalimentacion || "Has encontrado todos los pares con éxito."}
        />
      )}
    </div>
  );
}

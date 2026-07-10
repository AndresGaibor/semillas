import { useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";
import { playSound } from "../../lib/audio";

interface SopaLetrasProps {
  actividad: any;
  onComplete: (actividadId: string, xpRecompensa: number) => void;
}

type Direction = [number, number]; // [dRow, dCol]

const DIRECTIONS: Direction[] = [
  [0, 1],   // Derecha
  [1, 0],   // Abajo
  [1, 1],   // Diagonal Abajo-Derecha
  [-1, 1],  // Diagonal Arriba-Derecha
  [0, -1],  // Izquierda
  [-1, 0],  // Arriba
  [-1, -1], // Diagonal Arriba-Izquierda
  [1, -1]   // Diagonal Abajo-Izquierda
];

interface CellCoord {
  r: number;
  c: number;
}

export function SopaLetrasActividad({ actividad, onComplete }: SopaLetrasProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [palabras, setPalabras] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  
  // Array of found cell coordinates, stringified for easy Set lookup like "r,c"
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  
  const [selectionStart, setSelectionStart] = useState<CellCoord | null>(null);
  const [completed, setCompleted] = useState(false);
  const [errorFlash, setErrorFlash] = useState<Set<string>>(new Set());

  const numFilas = actividad.configuracion?.filas || 8;
  const numColumnas = actividad.configuracion?.columnas || 8;

  const generarSopa = useCallback(() => {
    const words: string[] = (actividad.configuracion?.palabras || []).map((w: string) => w.toUpperCase());
    setPalabras(words);
    
    // Iniciar grid vacío
    const newGrid = Array(numFilas).fill(null).map(() => Array(numColumnas).fill(''));

    // Intentar colocar cada palabra
    for (const word of words) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        attempts++;
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startR = Math.floor(Math.random() * numFilas);
        const startC = Math.floor(Math.random() * numColumnas);
        
        let canPlace = true;
        
        // Verificar si cabe y no colisiona
        for (let i = 0; i < word.length; i++) {
          const r = startR + dir[0] * i;
          const c = startC + dir[1] * i;
          
          if (r < 0 || r >= numFilas || c < 0 || c >= numColumnas) {
            canPlace = false;
            break;
          }
          if (newGrid[r][c] !== '' && newGrid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }
        
        // Colocar palabra
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = startR + dir[0] * i;
            const c = startC + dir[1] * i;
            newGrid[r][c] = word[i];
          }
          placed = true;
        }
      }
    }

    // Rellenar espacios vacíos
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < numFilas; r++) {
      for (let c = 0; c < numColumnas; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
      }
    }
    
    setGrid(newGrid);
  }, [actividad, numFilas, numColumnas]);

  useEffect(() => {
    generarSopa();
    setFoundWords([]);
    setFoundCells(new Set());
    setSelectionStart(null);
    setCompleted(false);
  }, [generarSopa]);

  const handleCellClick = (r: number, c: number) => {
    if (completed) return;

    if (!selectionStart) {
      // Iniciar selección
      playSound('pop');
      setSelectionStart({ r, c });
      setErrorFlash(new Set());
    } else {
      // Terminar selección
      const startR = selectionStart.r;
      const startC = selectionStart.c;
      
      // Verificar si forman una línea recta (horizontal, vertical o diagonal)
      const diffR = r - startR;
      const diffC = c - startC;
      
      const stepR = diffR === 0 ? 0 : diffR / Math.abs(diffR);
      const stepC = diffC === 0 ? 0 : diffC / Math.abs(diffC);
      
      // Es una línea válida si las magnitudes de la diferencia son iguales (diagonal) 
      // o alguna es cero (horizontal/vertical)
      if (Math.abs(diffR) === Math.abs(diffC) || diffR === 0 || diffC === 0) {
        
        // Construir la palabra formada y guardar las celdas
        let currentWord = "";
        const selectedCells = new Set<string>();
        let currR = startR;
        let currC = startC;
        
        // Iterar hasta llegar al punto final inclusive
        const length = Math.max(Math.abs(diffR), Math.abs(diffC)) + 1;
        for (let i = 0; i < length; i++) {
          currentWord += grid[currR][currC];
          selectedCells.add(`${currR},${currC}`);
          currR += stepR;
          currC += stepC;
        }
        
        const reverseWord = currentWord.split('').reverse().join('');
        
        // Verificar si la palabra seleccionada está en la lista y no ha sido encontrada
        const matchedWord = palabras.find(w => (w === currentWord || w === reverseWord) && !foundWords.includes(w));
        
        if (matchedWord) {
          // ACIERTO
          playSound('acertado');
          setFoundWords(prev => [...prev, matchedWord]);
          setFoundCells(prev => new Set([...Array.from(prev), ...Array.from(selectedCells)]));
          
          // Verificar victoria
          if (foundWords.length + 1 === palabras.length) {
            setTimeout(() => {
              setCompleted(true);
              playSound('insignia');
              onComplete(actividad.id, actividad.xp_recompensa || 0);
            }, 800);
          }
        } else {
          // ERROR
          playSound('error');
          setErrorFlash(selectedCells);
          setTimeout(() => setErrorFlash(new Set()), 1000);
        }
      } else {
        // No es una línea válida
        playSound('error');
      }
      
      // Limpiar selección
      setSelectionStart(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 animate-in fade-in zoom-in-95">
      {!completed ? (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center">
          
          {/* Columna Izquierda: Instrucciones y Palabras */}
          <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center gap-6">
            {/* Instrucciones Rápidas */}
            <div className="bg-orange-50 border-2 border-orange-200 text-orange-800 rounded-2xl p-4 flex flex-col text-center shadow-sm">
              <p className="text-sm leading-tight">
                <strong>Toca la primera letra y luego la última</strong> para formar la palabra oculta.
              </p>
            </div>
            
            {/* Lista de palabras */}
            <div className="grid grid-cols-2 gap-2">
              {palabras.map((word) => (
                <div 
                  key={word}
                  className={`px-3 py-2 rounded-lg font-medium text-center border-2 transition-all ${
                    foundWords.includes(word) 
                      ? "bg-green-100 border-green-200 text-green-700 line-through decoration-2" 
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Sopa de Letras Grid */}
          <div className="w-full md:w-1/2 lg:w-3/5 flex justify-center items-center">
            <div 
              className="w-full max-w-[280px] sm:max-w-xs lg:max-w-sm aspect-square bg-slate-100 rounded-2xl p-2 grid gap-1 border-4 border-slate-200 shadow-inner"
              style={{ 
                gridTemplateColumns: `repeat(${numColumnas}, minmax(0, 1fr))` 
              }}
            >
              {grid.map((row, r) => 
                row.map((letter, c) => {
                  const cellKey = `${r},${c}`;
                  const isFound = foundCells.has(cellKey);
                  const isSelectedStart = selectionStart?.r === r && selectionStart?.c === c;
                  const isError = errorFlash.has(cellKey);
                  
                  let cellClass = "flex items-center justify-center font-bold text-base sm:text-xl rounded-md sm:rounded-lg cursor-pointer transition-colors select-none ";
                
                if (isFound) {
                  cellClass += "bg-green-400 text-white shadow-sm scale-95 opacity-90";
                } else if (isError) {
                  cellClass += "bg-red-400 text-white animate-pulse";
                } else if (isSelectedStart) {
                  cellClass += "bg-blue-400 text-white shadow-sm ring-4 ring-blue-200";
                } else {
                  cellClass += "bg-white text-slate-700 shadow-sm hover:bg-orange-100";
                }

                return (
                  <div 
                    key={cellKey}
                    onClick={() => handleCellClick(r, c)}
                    className={cellClass}
                  >
                    {letter}
                  </div>
                );
              })
            )}
            </div>
          </div>
        </div>
      ) : (
        /* Pantalla de Completado */
        <div className="w-full p-8 bg-green-50 rounded-3xl border-2 border-green-200 text-center animate-in zoom-in-95 mt-4 shadow-sm">
          <div className="flex justify-center mb-6 text-green-500">
            <div className="bg-white p-4 rounded-full shadow-md">
              <Check size={64} strokeWidth={3} />
            </div>
          </div>
          <h4 className="text-3xl font-bold text-green-800 mb-4">¡Excelente Trabajo!</h4>
          {actividad.retroalimentacion ? (
            <p className="text-green-700 text-xl font-medium max-w-lg mx-auto">{actividad.retroalimentacion}</p>
          ) : (
            <p className="text-green-700 text-xl font-medium">Has encontrado todas las palabras.</p>
          )}
        </div>
      )}
    </div>
  );
}

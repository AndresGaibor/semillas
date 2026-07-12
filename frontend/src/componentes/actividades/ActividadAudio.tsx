import { useState, useRef } from "react";
import type { Actividad } from "../../shared/api/api";
import { playSound } from "../../lib/audio";
import { Check, X, Play, Pause, Music, FileText } from "lucide-react";
import imagenDefault from "../../assets/images/Ilustraciones/Senda del Padre.png";
import { CompletadoCard } from "./CompletadoCard";

interface ReproductorProps {
  audioUrl: string;
  imagenUrl?: string;
  titulo: string;
  subtitulo: string;
  letra?: string;
}

// Función sencilla para parsear formato LRC
function parseLrc(lrcString: string) {
  const lines = lrcString.split('\n');
  const result: { time: number; text: string }[] = [];
  
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  
  for (const line of lines) {
    const match = timeReg.exec(line);
    if (match) {
      const min = parseInt(match[1]!, 10);
      const sec = parseInt(match[2]!, 10);
      const ms = parseInt(match[3]!, 10);
      const timeInSeconds = min * 60 + sec + (ms / (match[3]!.length === 3 ? 1000 : 100));
      const text = line.replace(timeReg, '').trim();
      result.push({ time: timeInSeconds, text });
    } else {
      // Si no tiene tiempo, lo ponemos en el segundo 0 por defecto
      result.push({ time: 0, text: line });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

function ReproductorConLetra({ audioUrl, imagenUrl, titulo, subtitulo, letra }: ReproductorProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Parsear la letra solo una vez
  const lineasLetra = useRef(letra ? parseLrc(letra) : []).current;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newPercentage = clickX / rect.width;
      const newTime = newPercentage * audioRef.current.duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(newPercentage * 100);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  return (
    <div className={`w-full max-w-5xl flex flex-col md:flex-row md:items-stretch gap-6 mx-auto ${!letra ? 'justify-center' : ''}`}>
      {/* Tarjeta del Reproductor (Estilo de la imagen de referencia) */}
      <div className={`bg-[#FDF9EA] rounded-3xl overflow-hidden shadow-sm border border-amber-100 flex flex-col relative ${letra ? 'flex-1' : 'w-full max-w-sm'}`}>
        
        {/* Imagen Superior */}
        <div className="w-full relative overflow-hidden bg-amber-50 group flex-1">
          <img 
            src={imagenUrl || imagenDefault} 
            alt={titulo} 
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          {/* Sutil degradado para que el botón resalte */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDF9EA] via-transparent to-transparent opacity-90"></div>
          
          {/* Botón flotante Play */}
          <button 
            onClick={togglePlay}
            className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-amber-600 z-10"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-amber-600" /> : <Play className="w-8 h-8 fill-amber-600 ml-1" />}
          </button>
        </div>

        {/* Info Inferior */}
        <div className="px-5 md:px-8 pb-5 md:pb-8 pt-6 flex flex-col relative z-20 shrink-0">
          <div className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-3 flex justify-between items-center">
            <span>Actividad Audio</span>
            <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <h2 className="text-2xl md:text-3xl font-medium text-slate-800 leading-tight mb-3 font-sans tracking-tight">{titulo}</h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed line-clamp-2">{subtitulo}</p>
          
          {/* Barra de progreso plana y navegable */}
          <div 
            className="w-full mt-6 bg-amber-200/50 h-3 rounded-full overflow-hidden cursor-pointer group/progress relative"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-amber-500 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onTimeUpdate={handleTimeUpdate} 
          onEnded={handleEnded} 
          className="hidden" 
        />
      </div>

      {/* Tarjeta de Letra (Sincronizada si tiene timestamps) */}
      {letra && (
        <div className="flex-1 bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100 flex flex-col md:h-[500px]">
          <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-amber-500" /> Letra de la canción
          </h3>
          <div className="overflow-y-auto pr-4 flex-1 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent space-y-4">
            {lineasLetra.length > 0 && lineasLetra.some(l => l.time > 0) ? (
              lineasLetra.map((linea, index) => {
                const isPast = currentTime >= linea.time;
                const isNext = index < lineasLetra.length - 1 ? currentTime < lineasLetra[index + 1]!.time : true;
                const isCurrent = isPast && isNext;
                
                return (
                  <p 
                    key={index} 
                    className={`text-xl font-medium transition-colors duration-300 ${isCurrent ? 'text-amber-600 font-bold scale-105 origin-left' : isPast ? 'text-slate-700' : 'text-slate-300'}`}
                  >
                    {linea.text || " "}
                  </p>
                );
              })
            ) : (
              <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {letra}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ActividadAudioProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void;
}

export function ActividadAudio({ actividad, onComplete }: ActividadAudioProps) {
  const [completed, setCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Extraer configuración de la base de datos
  const configuracion = actividad.configuracion || {};
  const opciones = (configuracion.opciones as string[]) || [];
  const pregunta = (configuracion.pregunta as string) || "Selecciona la respuesta correcta";
  const respuestaCorrecta = configuracion.respuesta_correcta as number;
  
  // Letra (en formato LRC para que se sincronice con el audio)
  const letraCancion = (configuracion.letra as string) || 
    "[00:00.00]🎶 (Intro musical)\n[00:05.00]Dios es nuestro Padre\n[00:10.00]El nos ama mucho\n[00:15.00]Nos cuida cada día\n[00:20.00]Y nos da su luz.\n[00:25.00]Escucha su voz\n[00:30.00]En tu corazón\n[00:35.00]Él siempre te guía\n[00:40.00]Con su inmenso amor.";

  // URL original de la base de datos
  // const audioUrlOriginal = configuracion.audio_url as string | undefined;
  
  // URL de prueba de Audio (MP3)
  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  const handleSelectOption = (index: number) => {
    if (completed || selectedOption !== null) return;
    
    setSelectedOption(index);
    const correct = index === respuestaCorrecta;
    
    if (correct) {
      playSound("acertado");
      setTimeout(() => {
        setCompleted(true);
        playSound("insignia");
        onComplete(actividad.id, actividad.xp_recompensa || 0);
      }, 1500);
    } else {
      playSound("error");
    }
  };

  const reintentar = () => {
    setSelectedOption(null);
  };

  return (
    <div className="flex flex-col gap-10 w-full mx-auto py-4 animate-in fade-in zoom-in-95">
      
      {/* Reproductor estilo Senda del Padre + Letra */}
      {audioUrl && (
        <ReproductorConLetra 
          audioUrl={audioUrl} 
          titulo={actividad.titulo}
          subtitulo={actividad.consigna}
          letra={letraCancion}
        />
      )}

      {/* Sección de Preguntas (Si existen opciones) */}
      {opciones.length > 0 && !completed && (
        <div className="w-full max-w-5xl mx-auto bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 mt-4">
          <h3 className="text-xl md:text-2xl font-bold text-slate-700 text-center mb-6 tracking-tight">
            {pregunta}
          </h3>

          <div className="flex flex-col w-full gap-4">
            {opciones.map((opcionText, index) => {
              const esSeleccionada = selectedOption === index;
              const esCorrecta = index === respuestaCorrecta;
              const respondida = selectedOption !== null;

              let clases = "border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50";
              let translateYClass = "hover:-translate-y-1 active:translate-y-0";

              if (respondida) {
                translateYClass = "translate-y-0";
                if (esCorrecta && esSeleccionada) {
                  clases = "border-emerald-500 bg-emerald-50 text-emerald-700";
                } else if (esSeleccionada && !esCorrecta) {
                  clases = "border-red-400 bg-red-50 text-red-700";
                } else if (esCorrecta) {
                  clases = "border-emerald-500 bg-emerald-50 opacity-60";
                } else {
                  clases = "border-slate-200 bg-slate-50 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  disabled={respondida || completed}
                  onClick={() => handleSelectOption(index)}
                  className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${clases} ${translateYClass} ${!respondida ? 'cursor-pointer shadow-sm hover:shadow-md' : 'cursor-default'}`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-lg ${esSeleccionada ? (esCorrecta ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') : 'bg-white text-slate-500 border border-slate-200'}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 font-medium text-lg text-slate-700">{opcionText}</span>
                  {respondida && esSeleccionada && esCorrecta && <Check className="text-emerald-600" size={28} strokeWidth={3} />}
                  {respondida && esSeleccionada && !esCorrecta && <X className="text-red-500" size={28} strokeWidth={3} />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && selectedOption !== respuestaCorrecta && (
            <div className="w-full mt-8 flex justify-center animate-in slide-in-from-bottom-4">
              <button
                onClick={reintentar}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold text-lg shadow-md active:scale-95 transition-all"
              >
                Intentar otra vez
              </button>
            </div>
          )}
        </div>
      )}

      {completed && (
        <div className="w-full mt-4">
          <CompletadoCard retroalimentacion={actividad.retroalimentacion ?? undefined} />
        </div>
      )}
    </div>
  );
}

import iniciarSoundUrl from '../assets/Sonidos/iniciar_actividad.mp3';
import siguienteSoundUrl from '../assets/Sonidos/siguiente_fase.mp3';
import acertadoSoundUrl from '../assets/Sonidos/acertado_quiz.mp3';
import errorSoundUrl from '../assets/Sonidos/error_quiz.mp3';
import insigniaSoundUrl from '../assets/Sonidos/insignia.mp3';

// Pre-cargar los sonidos para evitar delay al hacer clic
const audioCache = {
  iniciar: new Audio(iniciarSoundUrl),
  siguiente: new Audio(siguienteSoundUrl),
  acertado: new Audio(acertadoSoundUrl),
  error: new Audio(errorSoundUrl),
  insignia: new Audio(insigniaSoundUrl),
};

// Ajustar el volumen por defecto de todos los sonidos (0.0 a 1.0)
const VOLUMEN_POR_DEFECTO = 0.4;
Object.values(audioCache).forEach(audio => {
  audio.volume = VOLUMEN_POR_DEFECTO;
});

export const playSound = (type: 'iniciar' | 'siguiente' | 'acertado' | 'error' | 'insignia') => {
  try {
    const audio = audioCache[type];
    if (audio) {
      // Reiniciar el audio al principio por si se llama varias veces rápido
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error playing audio", e));
    }
  } catch (e) {
    console.error("Audio playback error", e);
  }
};

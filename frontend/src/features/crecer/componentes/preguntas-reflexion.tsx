interface Pregunta {
  id: string;
  pregunta: string;
}

interface PreguntasReflexionProps {
  preguntas: Pregunta[];
}

export function PreguntasReflexion({ preguntas }: PreguntasReflexionProps) {
  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-slate-800">Preguntas de Reflexión</h3>
        <p className="text-slate-500 mt-1">
          Tómate tu tiempo. Estas preguntas son para ti, para que las reflexiones personalmente en casa durante la semana.
        </p>
      </div>
      {preguntas.map((pregunta, index) => (
        <div key={pregunta.id} className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 shadow-sm relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shadow-md">
            {index + 1}
          </div>
          <p className="text-lg text-slate-700 font-medium ml-2">{pregunta.pregunta}</p>
        </div>
      ))}
    </div>
  );
}

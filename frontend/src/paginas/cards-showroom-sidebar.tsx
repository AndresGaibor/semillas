import {
  Activity,
  Award,
  Check,
  Users,
} from "lucide-react";

export function CardsShowroomSidebar() {
  return (
    <aside className="w-[240px] bg-white border-r border-[#E2E8F0] p-6 flex flex-col gap-6 flex-shrink-0 text-left">
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
          style={{ background: "linear-gradient(135deg, #16A34A, #2E9E5B)" }}
        >
          🌱
        </div>
        <div>
          <h2 className="text-base font-extrabold text-[#123B2C] leading-none">Semillas</h2>
          <span className="text-[10px] text-gray-400 font-bold">Crece en la fe cada día</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-800 leading-tight">Cards</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
          Las cards organizan el contenido en bloques visuales claros, con bordes redondeados, sombras suaves y estados definidos para cada situación.
        </p>
      </div>

      <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Principios</h3>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: <Users className="size-4.5 text-[#6C3AED]" />,
              title: "Agrupan información",
              desc: "Permiten escanear y comprender el contenido rápidamente.",
            },
            {
              icon: <Award className="size-4.5 text-[#6C3AED]" />,
              title: "Jerarquía visual",
              desc: "El color, sombra y tamaño indican importancia y estado.",
            },
            {
              icon: <Activity className="size-4.5 text-[#6C3AED]" />,
              title: "Interactivas",
              desc: "Indican que son clicables mediante hover, escala o sombra.",
            },
            {
              icon: <Check className="size-4.5 text-[#6C3AED]" />,
              title: "Estados claros",
              desc: "Cada estado comunica al usuario el progreso o disponibilidad.",
            },
          ].map((principio, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <span className="mt-0.5">{principio.icon}</span>
              <div>
                <h4 className="text-[11px] font-extrabold text-slate-700 leading-none">{principio.title}</h4>
                <p className="text-[10px] text-slate-400 leading-snug font-semibold mt-1">{principio.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-600">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Especificaciones</h3>
        <ul className="flex flex-col gap-2 list-none pl-0 m-0">
          <li className="flex justify-between border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-400">Radio de borde</span>
            <span>16px - 32px</span>
          </li>
          <li className="flex flex-col gap-0.5 border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-400">Shadow sm</span>
            <span className="font-mono text-[9px] text-[#6C3AED]">0 2px 8px rgba(15,23,42,0.06)</span>
          </li>
          <li className="flex flex-col gap-0.5 border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-400">Shadow md</span>
            <span className="font-mono text-[9px] text-[#6C3AED]">0 8px 24px rgba(15,23,42,0.10)</span>
          </li>
          <li className="flex flex-col gap-0.5 border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-400">Shadow lg</span>
            <span className="font-mono text-[9px] text-[#6C3AED]">0 16px 40px rgba(15,23,42,0.14)</span>
          </li>
          <li className="flex justify-between border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-400">Padding interno</span>
            <span>16px - 24px</span>
          </li>
          <li className="flex justify-between border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-400">Transiciones</span>
            <span>150ms ease</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-400">Hover</span>
            <span>eleva y aumenta sombra</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

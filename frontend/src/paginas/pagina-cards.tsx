import * as React from "react";
import {
  Activity,
  Award,
  Book,
  Check,
  Download,
  Flame,
  Gamepad2,
  Heart,
  Home,
  Hourglass,
  Info,
  Lock,
  Music,
  Share2,
  Shield,
  Smile,
  Sparkles,
  Sprout,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import {
  Card,
  CardLeccion,
  CardMetrica,
  CardInsignia,
  CardPerfil,
} from "../componentes/ui/card";
import { Chip } from "../componentes/ui/chip";
import { BarraProgreso } from "../componentes/ui/indicadores-progreso";


export const PaginaCards: React.FC = () => {
  return (
    <div
      className="flex min-h-screen bg-[#F7F4EC]"
      style={{ fontFamily: "Nunito, Inter, system-ui, sans-serif" }}
    >
      {/* ── Sidebar Izquierdo (Especificaciones) ────────────────────── */}
      <aside className="w-[240px] bg-white border-r border-[#E2E8F0] p-6 flex flex-col gap-6 flex-shrink-0 text-left">
        {/* Logo Semillas */}
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

        {/* Titulo */}
        <div>
          <h1 className="text-2xl font-black text-slate-800 leading-tight">Cards</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
            Las cards organizan el contenido en bloques visuales claros, con bordes redondeados, sombras suaves y estados definidos para cada situación.
          </p>
        </div>

        {/* Principios */}
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

        {/* Especificaciones */}
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

      {/* ── Contenido Principal (Ejemplos) ────────────────────────── */}
      <main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto max-w-[1040px]">
        {/* 01. Card de lección (ejemplo principal) */}
        <section className="flex flex-col gap-4 text-left">
          <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
            01. Card de lección (ejemplo principal)
          </h2>
          <div className="grid grid-cols-6 gap-4">
            <CardLeccion
              estado="porDefecto"
              senda="Senda del Padre"
              titulo="La creación"
              descripcion="Dios creó el cielo y la tierra en seis días."
              duracion="8 min"
              xp={20}
              favorito={false}
            />
            <CardLeccion
              estado="enProgreso"
              senda="Senda del Hijo"
              titulo="Jesús y los niños"
              descripcion="Jesús ama a los niños y los bendice siempre."
              duracion="10 min"
              xp={20}
              progreso={60}
              favorito={false}
            />
            <CardLeccion
              estado="completada"
              senda="Senda del Espíritu"
              titulo="El Espíritu Santo"
              descripcion="Él nos guía, nos consuela y nos da fuerza."
              duracion="12 min"
              xp={30}
              progreso={100}
              favorito={true}
            />
            <CardLeccion
              estado="descargada"
              senda="Senda del Padre"
              titulo="El arca de Noé"
              descripcion="Dios protegió a Noé, su familia y a los animales."
              duracion="9 min"
              xp={20}
              favorito={false}
            />
            <CardLeccion
              estado="bloqueada"
              senda="Senda del Hijo"
              titulo="La torre de Babel"
              descripcion="Completa la lección anterior para desbloquear."
              duracion="12 min"
              xp={30}
              favorito={false}
            />
            <CardLeccion
              estado="error"
              senda="Error"
              titulo="No disponible"
              descripcion="No se pudo cargar la lección. Intenta más tarde."
              duracion=""
              xp={0}
              favorito={false}
            />
          </div>
        </section>

        {/* 02. Card de progreso / métrica */}
        <section className="flex flex-col gap-4 text-left">
          <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
            02. Card de progreso / métrica
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <CardMetrica
              tipo="xp"
              titulo="XP total"
              valor="2,450"
              subtexto="+320 esta semana"
            />
            <CardMetrica
              tipo="racha"
              titulo="Racha actual"
              valor="5 días"
              subtexto="¡Sigue así!"
            />
            <CardMetrica
              tipo="lecciones"
              titulo="Lecciones completadas"
              valor="18 / 30"
              subtexto="60% completado"
            />
            <CardMetrica
              tipo="offline"
              titulo="Descargadas offline"
              valor="12"
              subtexto="Disponibles sin internet"
            />
          </div>
        </section>

        {/* 03. Card de logro / insignia & 04. Perfil & 05. Tamaños */}
        <div className="grid grid-cols-8 gap-6 text-left items-start">
          
          {/* 03. Card de logro / insignia (Columnas 1-4) */}
          <section className="col-span-4 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
              03. Card de logro / insignia
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <CardInsignia
                color="verde"
                titulo="Nueva Creación"
                descripcion="Completa tu primera lección"
                obtenida={true}
                icono={<Sprout />}
              />
              <CardInsignia
                color="morado"
                titulo="Explorador Bíblico"
                descripcion="Completa 10 lecciones"
                obtenida={false}
                icono={<Book />}
                progresoActual={7}
                progresoMaximo={10}
              />
              <CardInsignia
                color="amarillo"
                titulo="Fiel Aprendiz"
                descripcion="Mantén una racha de 7 días"
                obtenida={false}
                icono={<Flame />}
                progresoActual={5}
                progresoMaximo={7}
              />
              <CardInsignia
                color="gris"
                titulo="Guardián de la Fe"
                descripcion="Completa 100 lecciones"
                obtenida={false}
                icono={<Shield />}
              />
            </div>
          </section>

          {/* 04. Card de usuario / perfil pequeño (Columnas 5-6) */}
          <section className="col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
              04. Card de usuario / perfil pequeño
            </h2>
            <CardPerfil
              nombre="Samuel"
              nivel={7}
              racha={5}
              lecciones={18}
              logros={3}
              xpActual={2450}
              xpMaximo={3000}
            />
          </section>

          {/* 05. Variantes de tamaño (Columnas 7-8) */}
          <section className="col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-[#6C3AED] uppercase tracking-wider">
              05. Variantes de tamaño
            </h2>
            <div className="flex flex-col gap-4">
              {/* Card Pequeña */}
              <Card sombra="sm" clase="p-4 bg-white flex flex-col gap-1.5 text-left relative overflow-hidden">
                <span className="text-[9px] text-[#6C3AED] font-extrabold block">Pequeña (sm)</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Actividad de Quiz</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                  Responde correctamente las preguntas de la lección.
                </p>
                <div className="w-full h-1 bg-violet-100 rounded-full mt-2">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </Card>

              {/* Card Mediana */}
              <Card sombra="sm" clase="p-4.5 bg-white flex flex-col gap-2 text-left">
                <span className="text-[9px] text-emerald-500 font-extrabold block">Mediana (md)</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Club "Sembradores"</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                  Únete a otros niños para aprender juntos y cumplir retos colectivos semanales.
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] text-slate-500 font-extrabold">12 miembros</span>
                  <Chip color="verde" forma="badgePildora">Activo</Chip>
                </div>
              </Card>

              {/* Card Grande */}
              <Card sombra="sm" clase="p-5 bg-white flex flex-col gap-3.5 text-left">
                <span className="text-[9px] text-amber-500 font-extrabold block">Grande (lg)</span>
                <h4 className="text-sm font-black text-slate-800 leading-none">Senda: El Espíritu Santo</h4>
                <p className="text-[11px] text-slate-400 font-semibold leading-normal">
                  Descubre cómo el Espíritu Santo nos ayuda, nos guía y nos llena de gozo y paz en nuestro diario vivir con lecciones y dinámicas.
                </p>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>Avance de la senda</span>
                    <span>3 / 8 Lecciones</span>
                  </div>
                  <BarraProgreso valor={3} maximo={8} mostrarEtiquetas={false} color="naranja" />
                </div>
              </Card>
            </div>
          </section>
        </div>

        {/* Tip footer */}
        <div
          className="mt-6 bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 flex items-center gap-3"
        >
          <span className="text-xl">💡</span>
          <p className="text-xs text-[#6C3AED] margin-0 text-left">
            <strong>Tip:</strong> Usa las cards para destacar contenido importante, permitir acciones rápidas y mostrar progreso de manera visual.
          </p>
        </div>
      </main>
    </div>
  );
};

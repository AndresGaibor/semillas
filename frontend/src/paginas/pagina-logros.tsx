import * as React from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  Book,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Crown,
  Download,
  Eye,
  FileText,
  Flame,
  Gamepad2,
  Heart,
  Home,
  Hourglass,
  Info,
  Lock,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Mountain,
  Music,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Shield,
  Smile,
  Sparkles,
  Sprout,
  Star,
  Target,
  Trophy,
  User,
  Users,
  Wifi,
} from "lucide-react";

import { Chip, Badge, CampanaBadge } from "../componentes/ui/chip";
import { BarraProgreso, ProgresoCircular } from "../componentes/ui/indicadores-progreso";

// ── Reusable Custom Shield SVG (Insignia Escudo) ─────────────────────────────

interface PropiedadesInsigniaEscudo {
  titulo: string;
  subtitulo: string;
  obtenida: boolean;
  colorPrincipal: string;
  colorSecundario: string;
  icono: React.ReactNode;
}

const InsigniaEscudo: React.FC<PropiedadesInsigniaEscudo> = ({
  titulo,
  subtitulo,
  obtenida,
  colorPrincipal,
  colorSecundario,
  icono,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200"
      style={{
        backgroundColor: obtenida ? "#FFFFFF" : "#FAFAFA",
        borderColor: obtenida ? "#F1F5F9" : "#E2E8F0",
        opacity: obtenida ? 1 : 0.65,
        boxShadow: obtenida ? "0 4px 12px rgba(0, 0, 0, 0.03)" : "none",
        textAlign: "center",
      }}
    >
      {/* El Escudo SVG */}
      <div className="relative w-16 h-18 flex items-center justify-center mb-3">
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fondo del escudo */}
          <path
            d="M50 0C77.7778 0 95.8333 13.5833 100 40.8333C100 78.4333 75.9259 102.35 50 115C24.0741 102.35 0 78.4333 0 40.8333C4.16667 13.5833 22.2222 0 50 0Z"
            fill={obtenida ? `url(#gradiente-${titulo.replace(/\s+/g, "")})` : "#E2E8F0"}
          />
          {/* Borde del escudo */}
          <path
            d="M50 4C74.7778 4 91.8333 16.5833 96 42.8333C96 75.4333 73.9259 97.35 50 109C26.0741 97.35 4 75.4333 4 42.8333C8.16667 16.5833 25.2222 4 50 4Z"
            stroke={obtenida ? colorSecundario : "#CBD5E1"}
            strokeWidth="4"
          />
          {/* Gradientes dinámicos */}
          {obtenida && (
            <defs>
              <linearGradient
                id={`gradiente-${titulo.replace(/\s+/g, "")}`}
                x1="0"
                y1="0"
                x2="100"
                y2="115"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={colorPrincipal} />
                <stop offset="100%" stopColor={colorSecundario} />
              </linearGradient>
            </defs>
          )}
        </svg>

        {/* Icono flotando dentro del escudo */}
        <div
          className="absolute inset-0 flex items-center justify-center text-white"
          style={{ color: obtenida ? "#FFFFFF" : "#94A3B8" }}
        >
          {React.cloneElement(icono as React.ReactElement<{ className?: string }>, {
            className: "size-7 stroke-[2.2] drop-shadow-sm",
          })}
        </div>
      </div>

      <h4 className="text-xs font-bold text-gray-800 mb-1">{titulo}</h4>
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: obtenida ? "#DCFCE7" : "#F1F5F9",
          color: obtenida ? "#16A34A" : "#64748B",
        }}
      >
        {subtitulo}
      </span>
    </div>
  );
};

// ── Reusable Custom Shield for Stat Cards ────────────────────────────────────

interface PropiedadesEscudoEstadistica {
  colorBg: string;
  colorBorder: string;
  icono: React.ReactNode;
}

const EscudoEstadistica: React.FC<PropiedadesEscudoEstadistica> = ({
  colorBg,
  colorBorder,
  icono,
}) => {
  return (
    <div className="relative w-12 h-14 flex items-center justify-center flex-shrink-0">
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 0C77.7778 0 95.8333 13.5833 100 40.8333C100 78.4333 75.9259 102.35 50 115C24.0741 102.35 0 78.4333 0 40.8333C4.16667 13.5833 22.2222 0 50 0Z"
          fill={colorBg}
        />
        <path
          d="M50 4C74.7778 4 91.8333 16.5833 96 42.8333C96 75.4333 73.9259 97.35 50 109C26.0741 97.35 4 75.4333 4 42.8333C8.16667 16.5833 25.2222 4 50 4Z"
          stroke={colorBorder}
          strokeWidth="6"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white">
        {icono}
      </div>
    </div>
  );
};

// ── main Component: PaginaLogros ─────────────────────────────────────────────

export const PaginaLogros: React.FC = () => {
  const [seccionActiva, setSeccionActiva] = React.useState("Logros");

  const elementosMenu = [
    { id: "Inicio", etiqueta: "Inicio", icono: <Home className="size-4.5" /> },
    { id: "Sendas", etiqueta: "Sendas", icono: <BookOpen className="size-4.5" /> },
    { id: "Mis Temas", etiqueta: "Mis Temas", icono: <Book className="size-4.5" /> },
    { id: "Actividades", etiqueta: "Actividades", icono: <Gamepad2 className="size-4.5" /> },
    { id: "Clubes", etiqueta: "Clubes", icono: <Users className="size-4.5" /> },
    { id: "Logros", etiqueta: "Logros", icono: <Trophy className="size-4.5" /> },
    { id: "Perfil", etiqueta: "Perfil", icono: <User className="size-4.5" /> },
    { id: "Descargas", etiqueta: "Descargas", icono: <Download className="size-4.5" /> },
    { id: "Ajustes", etiqueta: "Ajustes", icono: <Settings className="size-4.5" /> },
  ];

  return (
    <div
      className="flex min-h-screen bg-[#F7F4EC]"
      style={{ fontFamily: "Nunito, Inter, system-ui, sans-serif" }}
    >
      {/* ── 1. Sidebar Izquierdo ────────────────────────────────────── */}
      <aside className="w-[240px] bg-white border-r border-[#E2E8F0] p-5 flex flex-col justify-between flex-shrink-0">
        <div className="flex flex-col gap-6">
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
              <span className="text-[10px] text-gray-400 font-bold">Crecer en la Palabra, vivir Su verdad</span>
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="flex flex-col gap-1">
            {elementosMenu.map((item) => {
              const esActivo = item.id === seccionActiva;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSeccionActiva(item.id)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all w-full text-left"
                  style={{
                    backgroundColor: esActivo ? "#FAF5FF" : "transparent",
                    color: esActivo ? "#6C3AED" : "#64748B",
                  }}
                >
                  <span style={{ color: esActivo ? "#6C3AED" : "#94A3B8" }}>{item.icono}</span>
                  <span>{item.etiqueta}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bloque inferior de Sync y Perfil */}
        <div className="flex flex-col gap-4">
          {/* Card de sincronización */}
          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center size-5.5 rounded-full bg-[#E8F8EE]">
                <Check className="size-3 text-[#2E9E5B] stroke-[3]" />
              </span>
              <div>
                <h4 className="text-[11px] font-extrabold text-[#123B2C] leading-none">Sincronizado</h4>
                <p className="text-[9px] text-[#64748B] font-bold mt-0.5">Todo actualizado</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-[9px] text-[#94A3B8] font-bold">
              <span>Hace 2 minutos</span>
              <button type="button" className="text-[#6C3AED] hover:underline">Ver detalles</button>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center gap-2.5 p-1">
            <div
              className="w-9 h-9 rounded-full bg-[#FFFBEB] border border-[#F4B740]/30 flex items-center justify-center text-lg overflow-hidden flex-shrink-0"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80')",
                backgroundSize: "cover",
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-800 truncate leading-none">Semillero</h4>
              <span className="text-[9px] text-gray-400 font-bold block mt-0.5">Explorador • Nivel 7</span>
              {/* Mini XP bar */}
              <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-[#6C3AED] rounded-full" style={{ width: "72%" }} />
              </div>
              <span className="text-[8px] text-[#6C3AED] font-extrabold mt-0.5 block">1,250 XP</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── 2. Contenido Central ────────────────────────────────────── */}
      <main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto max-w-[1040px]">
        {/* Cabecera del panel central */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#123B2C] leading-tight">Mis logros</h1>
            <p className="text-xs text-[#64748B] font-semibold mt-0.5">Revisa tus insignias, niveles y metas.</p>
          </div>

          {/* Notificaciones & Perfil desplegable */}
          <div className="flex items-center gap-3">
            <CampanaBadge conteo={3} />
            
            <div className="flex items-center gap-2.5 bg-white border border-[#E2E8F0] py-1.5 pl-2 pr-3.5 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
              <div
                className="w-7 h-7 rounded-full bg-cover"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80')",
                }}
              />
              <div className="text-left">
                <h4 className="text-[11px] font-extrabold text-[#123B2C] leading-none">Semillero</h4>
                <span className="text-[9px] text-gray-400 font-bold block mt-0.5">Explorador • Nivel 7</span>
              </div>
              <ChevronDown className="size-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Fila de 4 Tarjetas de Estadísticas Principales */}
        <div className="grid grid-cols-4 gap-4">
          {/* Card 1: Nivel actual */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
            <EscudoEstadistica
              colorBg="linear-gradient(135deg, #6C3AED, #5B30C8)"
              colorBorder="#FAF5FF"
              icono={<Trophy className="size-5 text-white" />}
            />
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">Nivel actual</span>
              <h3 className="text-lg font-black text-gray-800 leading-none">7</h3>
              <p className="text-[11px] text-[#6C3AED] font-bold mt-1">Explorador</p>
              <div className="mt-3">
                <BarraProgreso valor={550} maximo={1000} mostrarEtiquetas={false} color="morado" />
                <span className="text-[9px] text-gray-400 font-bold mt-1 block">550 XP para el nivel 8</span>
              </div>
            </div>
          </div>

          {/* Card 2: XP total */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #3D8BD4, #2563EB)" }}
            >
              <Star className="size-6 text-white fill-white" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">XP total</span>
              <h3 className="text-lg font-black text-gray-800 leading-none">1,250</h3>
              <p className="text-[11px] text-gray-500 font-semibold mt-1">Experiencia acumulada</p>
            </div>
          </div>

          {/* Card 3: Racha actual */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #EE6C4D, #C2410C)" }}
            >
              <Flame className="size-6 text-white fill-white" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">Racha actual</span>
              <h3 className="text-lg font-black text-gray-800 leading-none">12 días</h3>
              <p className="text-[11px] text-[#EE6C4D] font-bold mt-1">¡Sigue así!</p>
              {/* Calendario de días */}
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <span
                    key={d}
                    className="size-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                    style={{ backgroundColor: "#EE6C4D" }}
                  >
                    ✓
                  </span>
                ))}
                <span
                  className="size-3.5 rounded-full border border-gray-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Insignias obtenidas */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex items-start gap-3">
            <EscudoEstadistica
              colorBg="linear-gradient(135deg, #2E9E5B, #123B2C)"
              colorBorder="#F0FDF4"
              icono={<Award className="size-5 text-white" />}
            />
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 font-extrabold block uppercase leading-none mb-1">Insignias</span>
              <h3 className="text-lg font-black text-gray-800 leading-none">8 / 16</h3>
              <p className="text-[11px] text-[#2E9E5B] font-bold mt-1">50% completado</p>
              <div className="mt-3">
                <BarraProgreso valor={8} maximo={16} mostrarEtiquetas={false} color="verde" />
              </div>
            </div>
          </div>
        </div>

        {/* Panel: Mis insignias */}
        <section className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
            <h3 className="text-sm font-extrabold text-[#123B2C]">Mis insignias</h3>
            <button type="button" className="text-xs text-[#6C3AED] font-bold hover:underline">Ver todas</button>
          </div>

          {/* Grid de insignias 2x5 */}
          <div className="grid grid-cols-5 gap-4">
            <InsigniaEscudo
              titulo="Buen Pastor"
              subtitulo="Obtenida"
              obtenida={true}
              colorPrincipal="#6C3AED"
              colorSecundario="#5B30C8"
              icono={<Users />} // Lucide substitute for sheep/pastor
            />
            <InsigniaEscudo
              titulo="Paz en mi corazón"
              subtitulo="Obtenida"
              obtenida={true}
              colorPrincipal="#3D8BD4"
              colorSecundario="#2563EB"
              icono={<Heart />}
            />
            <InsigniaEscudo
              titulo="Crecí en la fe"
              subtitulo="Obtenida"
              obtenida={true}
              colorPrincipal="#2E9E5B"
              colorSecundario="#16A34A"
              icono={<Sprout />}
            />
            <InsigniaEscudo
              titulo="Buscador"
              subtitulo="Obtenida"
              obtenida={true}
              colorPrincipal="#2563EB"
              colorSecundario="#1E4D82"
              icono={<BookOpen />}
            />
            <InsigniaEscudo
              titulo="Primeros pasos"
              subtitulo="Obtenida"
              obtenida={true}
              colorPrincipal="#16A34A"
              colorSecundario="#123B2C"
              icono={<Compass />}
            />
            {/* Bloqueadas */}
            <InsigniaEscudo
              titulo="La oración"
              subtitulo="Bloqueada"
              obtenida={false}
              colorPrincipal="#94A3B8"
              colorSecundario="#64748B"
              icono={<Flame />} // substituted praying hands
            />
            <InsigniaEscudo
              titulo="Amigo fiel"
              subtitulo="Bloqueada"
              obtenida={false}
              colorPrincipal="#94A3B8"
              colorSecundario="#64748B"
              icono={<Smile />}
            />
            <InsigniaEscudo
              titulo="Líder servidor"
              subtitulo="Bloqueada"
              obtenida={false}
              colorPrincipal="#94A3B8"
              colorSecundario="#64748B"
              icono={<Crown />}
            />
            <InsigniaEscudo
              titulo="Fe inquebrantable"
              subtitulo="Bloqueada"
              obtenida={false}
              colorPrincipal="#94A3B8"
              colorSecundario="#64748B"
              icono={<Mountain />}
            />
            <InsigniaEscudo
              titulo="Campeón en Cristo"
              subtitulo="Bloqueada"
              obtenida={false}
              colorPrincipal="#94A3B8"
              colorSecundario="#64748B"
              icono={<Trophy />}
            />
          </div>
        </section>

        {/* Metas siguientes */}
        <section className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
            <h3 className="text-sm font-extrabold text-[#123B2C]">Metas siguientes</h3>
            <button type="button" className="text-xs text-[#6C3AED] font-bold hover:underline">Ver todas</button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Meta 1 */}
            <div className="border border-[#F1F5F9] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#FBBF24]">
                <Trophy className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-gray-800 leading-none">Alcanza el Nivel 8</h4>
                <p className="text-[10px] text-[#64748B] font-semibold mt-1">Obtén 1,500 XP en total.</p>
                <div className="mt-3 flex flex-col gap-1">
                  <BarraProgreso valor={1250} maximo={1500} mostrarEtiquetas={false} color="morado" />
                  <span className="text-[9px] text-gray-400 font-bold self-end mt-0.5">1,250 / 1,500</span>
                </div>
              </div>
            </div>

            {/* Meta 2 */}
            <div className="border border-[#F1F5F9] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#FBBF24]">
                <Trophy className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-gray-800 leading-none">Racha de 14 días</h4>
                <p className="text-[10px] text-[#64748B] font-semibold mt-1">Estudia tu senda por 14 días seguidos.</p>
                <div className="mt-3 flex flex-col gap-1">
                  <BarraProgreso valor={12} maximo={14} mostrarEtiquetas={false} color="naranja" />
                  <span className="text-[9px] text-gray-400 font-bold self-end mt-0.5">12 / 14</span>
                </div>
              </div>
            </div>

            {/* Meta 3 */}
            <div className="border border-[#F1F5F9] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#FBBF24]">
                <Trophy className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-gray-800 leading-none">Completa 5 sendas</h4>
                <p className="text-[10px] text-[#64748B] font-semibold mt-1">Termina 5 sendas diferentes.</p>
                <div className="mt-3 flex flex-col gap-1">
                  <BarraProgreso valor={3} maximo={5} mostrarEtiquetas={false} color="verde" />
                  <span className="text-[9px] text-gray-400 font-bold self-end mt-0.5">3 / 5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Historial de logros recientes */}
        <section className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
            <h3 className="text-sm font-extrabold text-[#123B2C]">Historial de logros recientes</h3>
            <button type="button" className="text-xs text-[#6C3AED] font-bold hover:underline">Ver todo</button>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                text: "¡Obtuviste la insignia \"Buen Pastor\"!",
                desc: "Completaste la senda \"Dios cuida de mí\".",
                time: "Hoy, 10:25 a.m.",
                color: "#6C3AED",
                icono: <Users />
              },
              {
                text: "¡Obtuviste la insignia \"Paz en mi corazón\"!",
                desc: "Completaste la senda \"Paz en mi corazón\".",
                time: "Ayer, 4:30 p.m.",
                color: "#3D8BD4",
                icono: <Heart />
              },
              {
                text: "¡Obtuviste la insignia \"Crecí en la fe\"!",
                desc: "Completaste 5 sendas en cualquier senda.",
                time: "May 10, 11:00 a.m.",
                color: "#2E9E5B",
                icono: <Sprout />
              }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-[#F8FAFC] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center rounded-full size-8 text-white flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {React.cloneElement(item.icono, { className: "size-4 stroke-[2.5]" })}
                  </span>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-800">{item.text}</h5>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold">{item.time}</span>
              </div>
            ))}
          </div>

          <button type="button" className="text-xs text-[#6C3AED] font-bold hover:underline mt-2 self-center">Ver más logros</button>
        </section>
      </main>

      {/* ── 3. Sidebar Derecho (Widgets de Resumen) ─────────────────── */}
      <aside className="w-[300px] border-l border-[#E2E8F0] p-5 bg-white flex flex-col gap-5 flex-shrink-0">
        
        {/* Widget: Tu progreso */}
        <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
            <h3 className="text-xs font-extrabold text-[#123B2C]">Tu progreso</h3>
            <button type="button" className="text-[10px] text-[#6C3AED] font-bold hover:underline">Ver detalles</button>
          </div>
          
          <div className="flex items-center gap-4">
            <ProgresoCircular porcentaje={72} etiqueta="Completado" color="verde" tamano={70} />
            <div className="flex-1">
              <h4 className="text-xs font-black text-gray-800 leading-none">Nivel 7</h4>
              <p className="text-[10px] text-[#2E9E5B] font-bold mt-1">Explorador</p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 font-bold">
                <Star className="size-3 text-[#FBBF24] fill-[#FBBF24]" />
                <span>1,250 XP acumulados</span>
              </div>
              <div className="mt-3">
                <BarraProgreso valor={550} maximo={1000} mostrarEtiquetas={false} color="morado" />
                <span className="text-[9px] text-gray-400 font-bold mt-1 block">550 XP para el nivel 8</span>
              </div>
            </div>
          </div>
        </section>

        {/* Widget: Próxima meta */}
        <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
            <h3 className="text-xs font-extrabold text-[#123B2C]">Próxima meta</h3>
            <button type="button" className="text-[10px] text-[#6C3AED] font-bold hover:underline">Ver todas</button>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-11 h-14 bg-[#FAF5FF] border border-[#6C3AED]/20 rounded-xl flex items-center justify-center text-[#6C3AED] flex-shrink-0">
              <Lock className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-gray-800 leading-none">Nivel 8</h4>
              <span className="text-[10px] text-[#6C3AED] font-extrabold mt-1 block">1,500 XP</span>
              <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-snug">
                Sigue aprendiendo para alcanzar el siguiente nivel.
              </p>
              <div className="mt-3">
                <BarraProgreso valor={1250} maximo={1500} mostrarEtiquetas={false} color="morado" />
                <span className="text-[8px] text-gray-400 font-bold mt-1 block self-end">1,250 / 1,500</span>
              </div>
            </div>
          </div>
        </section>

        {/* Widget: Comparte tu logro */}
        <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-3">
          <h3 className="text-xs font-extrabold text-[#123B2C]">Comparte tu logro</h3>
          <p className="text-[10px] text-gray-400 font-semibold leading-snug">
            ¡Comparte esta imagen con tus amigos y tu club!
          </p>

          {/* Premium Vector SVG Illustration Mockup of a child and gold cup */}
          <div className="w-full h-28 bg-[#ECFDF5] rounded-xl flex items-center justify-center overflow-hidden border border-[#D1FAE5] relative">
            <svg viewBox="0 0 200 110" className="w-full h-full">
              {/* Sky background / hills */}
              <path d="M 0 90 Q 50 60 100 90 Q 150 110 200 95 L 200 110 L 0 110 Z" fill="#D1FAE5" />
              <path d="M 0 100 Q 100 80 200 100 L 200 110 L 0 110 Z" fill="#A7F3D0" />
              
              {/* Sun rays or sparkles */}
              <circle cx="150" cy="40" r="15" fill="#FEF3C7" opacity="0.4" />
              <circle cx="150" cy="40" r="8" fill="#FBBF24" opacity="0.7" />

              {/* Gold Trophy */}
              <path d="M 140 40 L 160 40 L 157 70 Q 150 78 143 70 Z" fill="#FBBF24" />
              <circle cx="150" cy="40" r="10" fill="#FBBF24" />
              <path d="M 145 72 L 155 72 L 155 85 L 145 85 Z" fill="#D97706" />
              <path d="M 135 85 L 165 85 L 165 92 L 135 92 Z" fill="#78350F" />
              {/* Trophy handles */}
              <path d="M 137 45 Q 130 50 138 60" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
              <path d="M 163 45 Q 170 50 162 60" stroke="#FBBF24" strokeWidth="2.5" fill="none" />

              {/* Little Boy Vector Character */}
              {/* Body */}
              <rect x="50" y="70" width="22" height="30" rx="6" fill="#10B981" />
              {/* Head */}
              <circle cx="61" cy="52" r="14" fill="#FDBA74" />
              {/* Hair */}
              <path d="M 47 50 Q 55 35 65 42 Q 73 38 75 48 C 73 45 60 45 47 50 Z" fill="#78350F" />
              {/* Eyes */}
              <circle cx="56" cy="52" r="1.5" fill="#1E293B" />
              <circle cx="66" cy="52" r="1.5" fill="#1E293B" />
              {/* Smile */}
              <path d="M 58 58 Q 61 62 64 58" stroke="#1E293B" strokeWidth="1.5" fill="none" />
              {/* Arms raising */}
              <path d="M 50 75 Q 35 60 40 50" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 72 75 Q 85 60 82 50" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 border border-[#6C3AED] rounded-xl text-xs font-bold text-[#6C3AED] hover:bg-violet-50 transition-all"
          >
            <Share2 className="size-4" />
            <span>Compartir</span>
          </button>
        </section>

        {/* Widget: Insignia reciente */}
        <section className="border border-[#F1F5F9] p-4 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
            <h3 className="text-xs font-extrabold text-[#123B2C]">Insignia reciente</h3>
            <button type="button" className="text-[10px] text-[#6C3AED] font-bold hover:underline">Ver todas</button>
          </div>

          <div className="flex items-center gap-4">
            {/* Mini Escudo Buen Pastor */}
            <div className="w-14 h-16 flex items-center justify-center flex-shrink-0 relative">
              <svg viewBox="0 0 100 115" className="w-full h-full" fill="none">
                <path
                  d="M50 0C77.7778 0 95.8333 13.5833 100 40.8333C100 78.4333 75.9259 102.35 50 115C24.0741 102.35 0 78.4333 0 40.8333C4.16667 13.5833 22.2222 0 50 0Z"
                  fill="url(#gradiente-reciente)"
                />
                <path
                  d="M50 4C74.7778 4 91.8333 16.5833 96 42.8333C96 75.4333 73.9259 97.35 50 109C26.0741 97.35 4 75.4333 4 42.8333C8.16667 16.5833 25.2222 4 50 4Z"
                  stroke="#5B30C8"
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient id="gradiente-reciente" x1="0" y1="0" x2="100" y2="115">
                    <stop offset="0%" stopColor="#6C3AED" />
                    <stop offset="100%" stopColor="#5B30C8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Users className="size-6 stroke-[2.2]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-gray-800 leading-none">Buen Pastor</h4>
              <span className="text-[10px] text-[#2E9E5B] font-bold mt-1.5 block">Obtenida hoy</span>
              <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-snug">
                Completaste la senda "Dios cuida de mí".
              </p>
            </div>
          </div>
        </section>

      </aside>
    </div>
  );
};

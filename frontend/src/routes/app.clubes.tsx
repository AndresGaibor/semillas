import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Share2, Trophy, Flame, Shield, Heart, Plus, Download, Zap, Target } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { TarjetaClub } from "../features/clubes/componentes/tarjeta-club";
import { TablaRanking } from "../features/clubes/componentes/tabla-ranking";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { obtenerGamificacionPropia } from "../features/gamification/gamification.api";

import bannerKidsImg from "@/assets/images/Ilustraciones/Ninños 2.png";
import shareKidsImg from "@/assets/images/Ilustraciones/Niños_login.png";
import cover1 from "@/assets/images/Ilustraciones/Tema1.png";
import cover2 from "@/assets/images/Ilustraciones/Tema2.png";
import cover3 from "@/assets/images/Ilustraciones/Tema3.png";

export const Route = createFileRoute("/app/clubes")({
  component: ClubesPage,
});

const RANKING_MIEMBROS_EJEMPLO = [
  { posicion: 1, nombre: "Sara López", nivel: "Explorador • Nivel 8", xpSemana: 450, contribuciones: 16, avatarIndex: "1" },
  { posicion: 2, nombre: "Mateo Ruiz", nivel: "Explorador • Nivel 7", xpSemana: 380, contribuciones: 12, avatarIndex: "2" },
  { posicion: 3, nombre: "Julián Pérez", nivel: "Explorador • Nivel 7", xpSemana: 310, contribuciones: 10, avatarIndex: "3" },
  { posicion: 4, nombre: "María Núñez", nivel: "Explorador • Nivel 6", xpSemana: 250, contribuciones: 8, avatarIndex: "4" },
  { posicion: 5, nombre: "David Torres", nivel: "Explorador • Nivel 6", xpSemana: 210, contribuciones: 7, avatarIndex: "5" },
];

function ClubesPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const meQuery = useQuery({ queryKey: ["me"], queryFn: obtenerMiPerfil });
  const gamificationQuery = useQuery({ queryKey: ["gamification", "me"], queryFn: obtenerGamificacionPropia });

  const nivel = gamificationQuery.data?.nivel;

  const xpInfo = useMemo(() => {
    const xpTotal = nivel?.xp_total ?? 1250;
    const numNivel = nivel?.numero_nivel ?? 7;
    const xpEnNivel = xpTotal % 1000;
    const xpRestantes = 1000 - xpEnNivel;
    const porcentaje = Math.round((xpEnNivel / 1000) * 100);

    return {
      xpTotal,
      numNivel,
      nombreNivel: nivel?.nombre_nivel || "Explorador",
      porcentaje,
      xpRestantes,
    };
  }, [nivel]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("RIOB-1234");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareCode = () => {
    navigator.clipboard.writeText("¡Únete a mi club de Semillas con el código RIOB-1234!");
    setCopiedShare(true);
    alert("¡Código de invitación copiado para compartir!");
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleJoinClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    alert(`¡Solicitud enviada con éxito para unirse al club "${joinCode.toUpperCase()}"!`);
    setJoinCode("");
  };

  return (
    <div className="w-full flex flex-col font-sans text-slate-800 text-left">

      {/* Contenedor Principal con Dos Columnas */}
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">

        {/* COLUMNA IZQUIERDA: Banner del Club, Leaderboard, Reto Coop, Logros */}
        <div className="flex-1 lg:flex-[3] flex flex-col gap-6 w-full">

          <TarjetaClub
            nombre="Semillitas de Riobamba"
            descripcion="Creciendo juntos en la Palabra de Dios."
            codigoInvitacion="RIOB-1234"
            miembros={24}
            onCopiarCodigo={handleCopyCode}
            onCompartirCodigo={handleShareCode}
            onInvitar={() => alert("Función para enviar invitaciones por correo electrónico.")}
            onEditar={() => {}}
            copiado={copied}
          />

          {/* Grids Secundarias: Ranking y Reto Cooperativo */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">

            <TablaRanking
              miembros={RANKING_MIEMBROS_EJEMPLO}
              onVerCompleto={() => alert("Próximamente: Ranking histórico del club.")}
            />

            {/* Reto Cooperativo */}
            <Card className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Trophy size={18} className="fill-amber-500/10" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="text-base font-black text-slate-800 leading-tight mb-1">
                    Reto cooperativo de la semana
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    ¡Juntos podemos más! Completen actividades para alcanzar la meta del club.
                  </p>
                </div>
              </div>

              {/* Centro Gráfico */}
              <div className="flex flex-col items-center justify-center my-6 flex-grow">
                <div className="flex items-center gap-6">
                  {/* Círculo de porcentaje */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Progreso del club</span>
                    <span className="text-4xl font-black text-green-600 leading-none">72%</span>
                  </div>
                  {/* Ilustración de niños */}
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
                    <img src={bannerKidsImg} alt="Reto" className="h-full object-cover scale-110" />
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="w-full flex flex-col">
                {/* Barra de progreso */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: "72%" }}></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    ⭐ Meta: 250 actividades
                  </span>
                  <span className="font-black text-slate-800">180 / 250</span>
                </div>
              </div>
            </Card>

          </div>

          {/* Grids Terciarias: Logros del Club y Unirse a otro club */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">

            {/* Logros del Club */}
            <Card className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black text-slate-800">Logros del club</h3>
                <button
                  onClick={() => alert("Próximamente: Galería completa de insignias del club.")}
                  className="bg-transparent border-0 p-0 text-xs font-bold text-[#7E57C2] hover:underline cursor-pointer"
                >
                  Ver todos
                </button>
              </div>

              {/* Tarjetas de Logro Horizontal */}
              <div className="flex flex-col gap-3">
                {/* Logro 1 */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-[#EDE7F6] text-[#7E57C2] flex items-center justify-center flex-shrink-0">
                    <Shield size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight mb-0.5">Raíces firmes</h4>
                    <p className="text-[10px] text-slate-400">Completa 100 actividades como club.</p>
                  </div>
                  <span className="bg-green-50 text-green-700 border border-green-100 rounded-md text-[9px] font-extrabold uppercase px-2 py-0.5 flex-shrink-0">
                    ✓ Completado
                  </span>
                </div>

                {/* Logro 2 */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <Flame size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight mb-0.5">Luz del mundo</h4>
                    <p className="text-[10px] text-slate-400">Completa 250 actividades como club.</p>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-600 flex-shrink-0">
                    180 / 250
                  </span>
                </div>

                {/* Logro 3 */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <Heart size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight mb-0.5">Un solo corazón</h4>
                    <p className="text-[10px] text-slate-400">Participa juntos durante 7 días seguidos.</p>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "71%" }}></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-600 flex-shrink-0">
                    5 / 7
                  </span>
                </div>
              </div>
            </Card>

            {/* Unirse a otro club */}
            <Card className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[220px]">
              <div className="text-left w-full">
                <h3 className="text-base font-black text-slate-800 mb-1">Unirse a otro club</h3>
                <p className="text-xs text-slate-400 leading-normal font-semibold">
                  ¿Tienes un código de invitación? Únete a otro club y sigue aprendiendo.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleJoinClub} className="flex flex-col gap-4 mt-4 w-full">
                <div className="relative w-full flex items-center">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Ingresa el código del club"
                    className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-sm font-semibold outline-none focus:border-[#7E57C2] transition-colors pr-12 text-slate-700"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#7E57C2]/10 hover:bg-[#7E57C2] text-[#7E57C2] hover:text-white border-0 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!joinCode.trim()}
                  className="w-full bg-[#7E57C2] hover:bg-[#5B21B6] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white border-0 py-3.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                >
                  Unirse al club
                </button>
              </form>
            </Card>

          </div>

        </div>

        {/* COLUMNA DERECHA: Sidebar con Mi Progreso, Reto Semanal, Comparte y Offline */}
        <aside className="w-full lg:w-[320px] flex flex-col gap-6">

          {/* Tu progreso */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-black text-slate-800">Tu progreso</h2>
              <button
                onClick={() => navigate({ to: "/app/perfil" })}
                className="bg-transparent border-0 p-0 text-xs font-bold text-[#7E57C2] hover:underline cursor-pointer"
              >
                Ver detalles
              </button>
            </div>

            <div className="flex items-center gap-5">
              {/* Circular SVG */}
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#22c55e"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 - (xpInfo.porcentaje / 100) * (2 * Math.PI * 34)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-sm font-extrabold text-slate-800">{xpInfo.porcentaje}%</span>
                </div>
              </div>

              {/* Detalles */}
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-base font-extrabold text-indigo-950 truncate">
                  Nivel {xpInfo.numNivel}
                </span>
                <span className="text-xs font-extrabold text-green-600 mb-2">
                  {xpInfo.nombreNivel}
                </span>
                <div className="flex items-center gap-1.5 text-slate-700 mb-1">
                  <Zap size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-extrabold">{xpInfo.xpTotal} XP</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {xpInfo.xpRestantes} XP restantes
                </p>
              </div>
            </div>

            {/* Barra lineal */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${xpInfo.porcentaje}%` }} />
            </div>
          </div>

          {/* Reto Semanal */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#EDE7F6] text-[#7E57C2] flex items-center justify-center flex-shrink-0">
                <Target size={16} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-extrabold text-slate-800 leading-tight">Reto semanal</h3>
                <p className="text-[10px] text-slate-400">Completa 20 actividades esta semana.</p>
              </div>
            </div>

            {/* Progreso del Reto */}
            <div className="flex flex-col items-center mb-4">
              <span className="text-3xl font-black text-[#7E57C2]">12 / 20</span>
            </div>

            {/* Barra */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#7E57C2] rounded-full" style={{ width: "60%" }}></div>
            </div>
          </div>

          {/* Comparte tu Club */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="text-left mb-4">
              <h3 className="text-sm font-extrabold text-slate-800">Comparte tu club</h3>
              <p className="text-[10px] text-slate-400 leading-normal">Invita a otros a tu club y aprendan juntos.</p>
            </div>

            <div className="w-full h-28 rounded-2xl overflow-hidden bg-purple-50 flex items-center justify-center border border-[#EDE7F6] mb-4">
              <img src={shareKidsImg} alt="Comparte" className="h-full object-cover scale-105" />
            </div>

            <button
              onClick={handleShareCode}
              className="w-full flex items-center justify-center gap-2 border border-[#7E57C2] hover:bg-[#F3E8FF] text-[#7E57C2] bg-white py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Share2 size={14} />
              Compartir código
            </button>
          </div>

          {/* Contenido offline */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="text-left mb-3">
              <h3 className="text-sm font-extrabold text-slate-800">Contenido disponible offline</h3>
              <p className="text-[10px] text-slate-400">3 temas descargados</p>
            </div>

            {/* Fila de miniaturas */}
            <div className="flex gap-2.5 mb-4">
              {[cover1, cover2, cover3].map((cover, idx) => (
                <div key={idx} className="flex-1 aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                  <img src={cover} alt={`Tema ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate({ to: "/app/descargas" })}
              className="w-full flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 border border-slate-200 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Download size={14} />
              Ir a mis descargas
            </button>
          </div>

        </aside>

      </div>
    </div>
  );
}

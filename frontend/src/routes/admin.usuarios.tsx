import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerUsuariosAdmin } from "../features/admin/admin.api";
import { Loader } from "lucide-react";

import logoKids from "@/assets/images/Ilustraciones/Ninños 2.png";
import avatar1 from "@/assets/images/avatars/Avatar 1.png";
import avatar2 from "@/assets/images/avatars/Avatar 2.png";
import avatar3 from "@/assets/images/avatars/Avatar 3.png";
import avatar4 from "@/assets/images/avatars/Avatar 4.png";
import avatar5 from "@/assets/images/avatars/Avatar 5.png";
import avatar6 from "@/assets/images/avatars/Avatar 6.png";
import avatar7 from "@/assets/images/avatars/Avatar 7.png";
import avatar8 from "@/assets/images/avatars/Avatar 8.png";
import avatar9 from "@/assets/images/avatars/Avatar 9.png";
import avatar10 from "@/assets/images/avatars/Avatar 10.png";

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsuariosPage
});

type UserTableRow = {
  id: string;
  nombre: string;
  correo: string;
  avatarImg: string;
  rol: "Niño" | "Adolescente" | "Padre/Madre" | "Moderador" | "Administrador";
  franja: string;
  club: string;
  clubIcon: string;
  clubIconColor: string;
  clubBadgeBg: string;
  nivelText: string;
  xpText: string;
  isVinculado: boolean;
  estado: "activo" | "pendiente" | "bloqueado";
  ultimoAcceso: string;
};

function AdminUsuariosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters State
  const [searchValue, setSearchValue] = useState("");
  const [selectedRol, setSelectedRol] = useState("");
  const [selectedFranja, setSelectedFranja] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedClub, setSelectedClub] = useState("");

  // Fetch API data
  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => obtenerUsuariosAdmin()
  });

  // Mock users mapping exactly to mockup screenshot rows
  const mockupUsers: UserTableRow[] = [
    {
      id: "mock-usr-1",
      nombre: "Sofia Ramírez",
      correo: "sofia.ramirez@semillas.org",
      avatarImg: avatar1,
      rol: "Niño",
      franja: "8-10 años",
      club: "Semillitas de Luz",
      clubIcon: "fa-leaf",
      clubIconColor: "text-[#2e9e5b]",
      clubBadgeBg: "bg-[#eefcf4]",
      nivelText: "Nivel 12",
      xpText: "1,250 XP",
      isVinculado: false,
      estado: "activo",
      ultimoAcceso: "15 may, 2024 / 10:30"
    },
    {
      id: "mock-usr-2",
      nombre: "Mateo López",
      correo: "mateo.lopez@semillas.org",
      avatarImg: avatar2,
      rol: "Niño",
      franja: "8-10 años",
      club: "Guardianes de Paz",
      clubIcon: "fa-leaf",
      clubIconColor: "text-[#3d8bd4]",
      clubBadgeBg: "bg-[#3d8bd4]/10",
      nivelText: "Nivel 9",
      xpText: "850 XP",
      isVinculado: false,
      estado: "activo",
      ultimoAcceso: "14 may, 2024 / 16:45"
    },
    {
      id: "mock-usr-3",
      nombre: "Valentina Cruz",
      correo: "valentina.cruz@semillas.org",
      avatarImg: avatar3,
      rol: "Niño",
      franja: "11-13 años",
      club: "Corazones Valientes",
      clubIcon: "fa-heart",
      clubIconColor: "text-[#ee6c4d]",
      clubBadgeBg: "bg-[#ee6c4d]/10",
      nivelText: "Nivel 14",
      xpText: "1,750 XP",
      isVinculado: false,
      estado: "activo",
      ultimoAcceso: "14 may, 2024 / 09:20"
    },
    {
      id: "mock-usr-4",
      nombre: "Daniel Paredes",
      correo: "daniel.paredes@semillas.org",
      avatarImg: avatar4,
      rol: "Adolescente",
      franja: "14+ años",
      club: "Jóvenes en Misión",
      clubIcon: "fa-mountain",
      clubIconColor: "text-[#17a398]",
      clubBadgeBg: "bg-[#17a398]/10",
      nivelText: "Nivel 16",
      xpText: "2,300 XP",
      isVinculado: false,
      estado: "activo",
      ultimoAcceso: "13 may, 2024 / 20:10"
    },
    {
      id: "mock-usr-5",
      nombre: "Ana Torres",
      correo: "ana.torres@semillas.org",
      avatarImg: avatar5,
      rol: "Padre/Madre",
      franja: "-",
      club: "Semillitas de Luz",
      clubIcon: "fa-leaf",
      clubIconColor: "text-[#2e9e5b]",
      clubBadgeBg: "bg-[#eefcf4]",
      nivelText: "Vinculado",
      xpText: "",
      isVinculado: true,
      estado: "pendiente",
      ultimoAcceso: "10 may, 2024 / 11:05"
    },
    {
      id: "mock-usr-6",
      nombre: "Luis García",
      correo: "luis.garcia@semillas.org",
      avatarImg: avatar6,
      rol: "Padre/Madre",
      franja: "-",
      club: "Guardianes de Paz",
      clubIcon: "fa-leaf",
      clubIconColor: "text-[#3d8bd4]",
      clubBadgeBg: "bg-[#3d8bd4]/10",
      nivelText: "Vinculado",
      xpText: "",
      isVinculado: true,
      estado: "activo",
      ultimoAcceso: "9 may, 2024 / 08:50"
    },
    {
      id: "mock-usr-7",
      nombre: "María López",
      correo: "maria.lopez@semillas.org",
      avatarImg: avatar7,
      rol: "Moderador",
      franja: "Todas",
      club: "Todos los clubes",
      clubIcon: "fa-people-group",
      clubIconColor: "text-[#6c3aed]",
      clubBadgeBg: "bg-[#6c3aed]/10",
      nivelText: "Nivel 20",
      xpText: "3,800 XP",
      isVinculado: false,
      estado: "activo",
      ultimoAcceso: "15 may, 2024 / 12:15"
    },
    {
      id: "mock-usr-8",
      nombre: "Juan Pérez",
      correo: "juan.perez@semillas.org",
      avatarImg: avatar8,
      rol: "Administrador",
      franja: "Todas",
      club: "Todos los clubes",
      clubIcon: "fa-people-group",
      clubIconColor: "text-[#6c3aed]",
      clubBadgeBg: "bg-[#6c3aed]/10",
      nivelText: "Nivel 25",
      xpText: "5,600 XP",
      isVinculado: false,
      estado: "bloqueado",
      ultimoAcceso: "7 may, 2024 / 17:40"
    }
  ];

  // Map Database profiles
  const mappedUsers = useMemo(() => {
    const dbUsers = usersQuery.data?.usuarios ?? [];
    
    const dbMapped = dbUsers.map((u, index) => {
      const isActivo = u.activo ?? true;
      const apodo = u.perfil?.apodo || u.nombre_visible || u.correo?.split("@")[0] || "Usuario Semilla";
      const email = u.correo || "usuario@semillas.org";
      const lvl = u.perfil?.nivel_actual || 1;
      const xp = u.perfil?.xp_acumulada || 0;
      const dateObj = u.ultimo_login_en ? new Date(u.ultimo_login_en) : new Date();
      const dateStr = dateObj.toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" }) + " / " + dateObj.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });

      // Determine avatar
      const avatarsList = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];
      const avatarImg = u.perfil?.avatar_url || avatarsList[index % avatarsList.length]!;

      // Mapping role from DB role
      let rol: "Niño" | "Adolescente" | "Padre/Madre" | "Moderador" | "Administrador" = "Niño";
      let franja = "8-10 años";
      let club = "Semillitas de Luz";
      let clubIcon = "fa-leaf";
      let clubIconColor = "text-[#2e9e5b]";
      let clubBadgeBg = "bg-[#eefcf4]";
      let isVinculado = false;
      let levelText = `Nivel ${lvl}`;
      let xpText = `${xp.toLocaleString()} XP`;

      if (u.rol === "administrador") {
        rol = "Administrador";
        franja = "Todas";
        club = "Todos los clubes";
        clubIcon = "fa-people-group";
        clubIconColor = "text-[#6c3aed]";
        clubBadgeBg = "bg-[#6c3aed]/10";
      } else if (u.rol === "moderador") {
        rol = "Moderador";
        franja = "Todas";
        club = "Todos los clubes";
        clubIcon = "fa-people-group";
        clubIconColor = "text-[#6c3aed]";
        clubBadgeBg = "bg-[#6c3aed]/10";
      } else {
        if (!u.perfil?.grupo_edad_id) {
          rol = "Padre/Madre";
          franja = "-";
          club = "Semillitas de Luz";
          isVinculado = true;
          levelText = "Vinculado";
          xpText = "";
        } else {
          // Has kid age range
          rol = "Niño";
          franja = "8-10 años";
          club = "Semillitas de Luz";
        }
      }

      return {
        id: u.id,
        nombre: apodo,
        correo: email,
        avatarImg,
        rol: rol as UserTableRow["rol"],
        franja,
        club,
        clubIcon,
        clubIconColor,
        clubBadgeBg,
        nivelText: levelText,
        xpText,
        isVinculado,
        estado: (isActivo ? "activo" : "bloqueado") as any,
        ultimoAcceso: dateStr
      };
    });
    return dbMapped;
  }, [usersQuery.data]);

  const userStats = useMemo(() => {
    let activos = 0;
    let bloqueados = 0;
    let pendientes = 0;

    let ninos = 0;
    let adolescentes = 0;
    let padres = 0;
    let moderadores = 0;
    let administradores = 0;

    mappedUsers.forEach((u) => {
      if (u.estado === "activo") activos++;
      else if (u.estado === "bloqueado") bloqueados++;
      else pendientes++;

      if (u.rol === "Niño") ninos++;
      else if (u.rol === "Adolescente") adolescentes++;
      else if (u.rol === "Padre/Madre") padres++;
      else if (u.rol === "Moderador") moderadores++;
      else if (u.rol === "Administrador") administradores++;
    });

    const total = mappedUsers.length || 1;
    const c = 251.327;

    const ninosLen = (ninos / total) * c;
    const adolLen = (adolescentes / total) * c;
    const padresLen = (padres / total) * c;
    const modLen = (moderadores / total) * c;
    const adminLen = (administradores / total) * c;

    return {
      total: mappedUsers.length,
      activos,
      bloqueados,
      pendientes,
      ninos,
      adolescentes,
      padres,
      moderadores,
      administradores,
      actPct: Math.round((activos / total) * 100),
      pendPct: Math.round((pendientes / total) * 100),
      blockPct: Math.round((bloqueados / total) * 100),
      ninosPct: Math.round((ninos / total) * 100),
      adolPct: Math.round((adolescentes / total) * 100),
      padresPct: Math.round((padres / total) * 100),
      modPct: Math.round((moderadores / total) * 100),
      adminPct: Math.round((administradores / total) * 100),
      ninosLen,
      adolLen,
      padresLen,
      modLen,
      adminLen,
      ninosOff: 0,
      adolOff: -ninosLen,
      padresOff: -(ninosLen + adolLen),
      modOff: -(ninosLen + adolLen + padresLen),
      adminOff: -(ninosLen + adolLen + padresLen + modLen)
    };
  }, [mappedUsers]);

  // Apply filters
  const filteredUsers = useMemo(() => {
    return mappedUsers.filter((usr) => {
      // Search text filter
      if (searchValue && !usr.nombre.toLowerCase().includes(searchValue.toLowerCase()) && !usr.correo.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }

      // Role filter
      if (selectedRol && usr.rol !== selectedRol) {
        return false;
      }

      // Franja filter
      if (selectedFranja && usr.franja !== selectedFranja) {
        return false;
      }

      // State filter
      if (selectedEstado && usr.estado !== selectedEstado) {
        return false;
      }

      // Club filter
      if (selectedClub && usr.club !== selectedClub) {
        return false;
      }

      return true;
    });
  }, [mappedUsers, searchValue, selectedRol, selectedFranja, selectedEstado, selectedClub]);

  const clearFilters = () => {
    setSearchValue("");
    setSelectedRol("");
    setSelectedFranja("");
    setSelectedEstado("");
    setSelectedClub("");
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {usersQuery.isError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-lg" />
          <div>
            <p className="font-bold text-red-700 text-sm">Error al cargar usuarios</p>
            <p className="text-red-500 text-xs mt-0.5">{(usersQuery.error as Error)?.message ?? "No se pudo conectar con el servidor. Verifica que tienes permisos de administrador."}</p>
          </div>
          <button onClick={() => usersQuery.refetch()} className="ml-auto text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left block (3/4 width) */}
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img src={logoKids} alt="Usuarios" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Gestión de usuarios</h2>
                <p className="text-[13px] text-slate-500 mt-1">Administra cuentas, roles y participación dentro de la plataforma.</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex rounded-xl overflow-hidden shadow-xs h-[42px]">
                <button
                  onClick={() => console.log("Crear usuario clicked")}
                  className="!bg-verde-brote hover:opacity-90 !text-white px-5 font-bold text-sm flex items-center gap-2 transition-colors h-full outline-none cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Nuevo usuario
                </button>
                <div className="w-[1px] bg-white/20 h-full"></div>
                <button
                  className="!bg-verde-brote hover:opacity-90 !text-white px-3 flex items-center justify-center transition-colors h-full outline-none cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-down text-[10px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Buscar usuario por nombre o email..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all"
                />
              </div>

              {/* Rol select */}
              <div className="relative min-w-[120px]">
                <select
                  value={selectedRol}
                  onChange={(e) => setSelectedRol(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Rol</option>
                  <option value="Niño">Niño</option>
                  <option value="Adolescente">Adolescente</option>
                  <option value="Padre/Madre">Padre/Madre</option>
                  <option value="Moderador">Moderador</option>
                  <option value="Administrador">Administrador</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Franja select */}
              <div className="relative min-w-[120px]">
                <select
                  value={selectedFranja}
                  onChange={(e) => setSelectedFranja(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Franja</option>
                  <option value="8-10 años">8-10 años</option>
                  <option value="11-13 años">11-13 años</option>
                  <option value="14+ años">14+ años</option>
                  <option value="Todas">Todas</option>
                  <option value="-">-</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Estado select */}
              <div className="relative min-w-[120px]">
                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Estado</option>
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Club select */}
              <div className="relative min-w-[120px]">
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Club</option>
                  <option value="Semillitas de Luz">Semillitas de Luz</option>
                  <option value="Guardianes de Paz">Guardianes de Paz</option>
                  <option value="Corazones Valientes">Corazones Valientes</option>
                  <option value="Jóvenes en Misión">Jóvenes en Misión</option>
                  <option value="Todos los clubes">Todos los clubes</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Limpiar filters */}
              {(searchValue || selectedRol || selectedFranja || selectedEstado || selectedClub) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
            <div className="w-full overflow-x-auto select-none">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-black tracking-wider text-slate-400 uppercase select-none">
                    <th className="py-4 px-2 w-[40px] text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />
                    </th>
                    <th className="py-4 px-4 w-[25%]">Usuario</th>
                    <th className="py-4 px-4">Rol</th>
                    <th className="py-4 px-4">Franja</th>
                    <th className="py-4 px-4">Club</th>
                    <th className="py-4 px-4">Nivel</th>
                    <th className="py-4 px-4 text-center">Estado</th>
                    <th className="py-4 px-4">Último acceso</th>
                    <th className="py-4 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {/* Loading skeleton rows */}
                  {usersQuery.isLoading && Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="animate-pulse">
                      <td className="py-4 px-2"><div className="w-4 h-4 bg-slate-100 rounded mx-auto" /></td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100" />
                          <div className="flex flex-col gap-1.5">
                            <div className="w-28 h-3 bg-slate-100 rounded" />
                            <div className="w-36 h-2.5 bg-slate-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4"><div className="w-16 h-3 bg-slate-100 rounded" /></td>
                      <td className="py-4 px-4"><div className="w-20 h-3 bg-slate-100 rounded" /></td>
                      <td className="py-4 px-4"><div className="w-24 h-3 bg-slate-100 rounded" /></td>
                      <td className="py-4 px-4"><div className="w-14 h-3 bg-slate-100 rounded" /></td>
                      <td className="py-4 px-4 text-center"><div className="w-16 h-5 bg-slate-100 rounded-full mx-auto" /></td>
                      <td className="py-4 px-4"><div className="w-28 h-3 bg-slate-100 rounded" /></td>
                      <td className="py-4 px-4"><div className="w-16 h-3 bg-slate-100 rounded ml-auto" /></td>
                    </tr>
                  ))}

                  {/* Empty state */}
                  {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-16 text-center">
                        <i className="fa-regular fa-user text-slate-300 text-4xl mb-3 block" />
                        <p className="font-bold text-slate-500 text-sm">
                          {searchValue || selectedRol || selectedFranja || selectedEstado || selectedClub
                            ? "No hay usuarios que coincidan con los filtros"
                            : "No hay usuarios registrados en la plataforma"}
                        </p>
                        {(searchValue || selectedRol || selectedFranja || selectedEstado || selectedClub) && (
                          <button onClick={clearFilters} className="mt-3 text-xs font-bold text-[#2e9e5b] hover:underline cursor-pointer">
                            Limpiar filtros
                          </button>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* Real users from DB */}
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/40 transition-colors group cursor-pointer">
                      <td className="py-4 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />
                      </td>
                      
                      {/* Usuario profile (Avatar, name, email) */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0">
                            <img src={usr.avatarImg} alt={usr.nombre} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-slate-800 text-[13px] truncate group-hover:text-[#2e9e5b] transition-colors">{usr.nombre}</span>
                            <span className="text-[11px] text-slate-400 truncate mt-0.5">{usr.correo}</span>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {usr.rol === "Niño" ? (
                          <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#6c3aed]/10 text-[#6c3aed]">
                            Niño
                          </span>
                        ) : usr.rol === "Adolescente" ? (
                          <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#6c3aed]/15 text-[#6c3aed]">
                            Adolescente
                          </span>
                        ) : usr.rol === "Padre/Madre" ? (
                          <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold bg-orange-100 text-orange-650">
                            Padre/Madre
                          </span>
                        ) : usr.rol === "Moderador" ? (
                          <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-105 text-blue-700">
                            Moderador
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            Administrador
                          </span>
                        )}
                      </td>

                      {/* Franja */}
                      <td className="py-4 px-4 font-bold text-slate-500 text-[12px] whitespace-nowrap">
                        {usr.franja}
                      </td>

                      {/* Club */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full ${usr.clubBadgeBg} flex items-center justify-center shrink-0`}>
                            <i className={`fa-solid ${usr.clubIcon} text-[9px] ${usr.clubIconColor}`} />
                          </div>
                          <span className="font-bold text-slate-600 text-[12px] whitespace-nowrap">{usr.club}</span>
                        </div>
                      </td>

                      {/* Nivel */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {usr.isVinculado ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <i className="fa-solid fa-link text-[8px]" />
                            </div>
                            <span className="font-bold text-blue-600 text-[12px]">{usr.nivelText}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <i className="fa-solid fa-star text-amber-400 text-xs shrink-0" />
                            <span className="font-bold text-slate-700 text-[12px]">{usr.nivelText}</span>
                            {usr.xpText && <span className="text-slate-400 text-[10px] font-semibold ml-1">({usr.xpText})</span>}
                          </div>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {usr.estado === "activo" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2e9e5b]" />
                            <span className="text-[#2e9e5b] font-bold text-[12px]">Activo</span>
                          </div>
                        ) : usr.estado === "pendiente" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-amber-500 font-bold text-[12px]">Pendiente</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="text-slate-500 font-bold text-[12px]">Bloqueado</span>
                          </div>
                        )}
                      </td>

                      {/* Último acceso */}
                      <td className="py-4 px-4 text-slate-400 font-bold text-[11px] whitespace-nowrap">
                        {usr.ultimoAcceso}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="Ver detalles"
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            <i className="fa-solid fa-eye text-xs" />
                          </button>
                          <button
                            title="Opciones"
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            <i className="fa-solid fa-ellipsis-vertical text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-100 gap-4 text-xs font-semibold text-[#5c5c5c] select-none">
              <span>
                Mostrando 1 a 8 de {filteredUsers.length} usuarios
              </span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer" disabled>
                  <i className="fa-solid fa-chevron-left text-[10px]" />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2e9e5b] text-white transition-colors font-bold cursor-pointer">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  3
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  4
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  5
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  6
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>
              <select className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 focus:outline-none cursor-pointer">
                <option>10 por página</option>
                <option>20 por página</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right side widgets (1/4 width) */}
        <div className="flex flex-col gap-6">
          {/* Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm">Resumen de usuarios</h3>
            <span className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider select-none">Total usuarios</span>
            <div className="text-5xl font-black text-[#6c3aed] mt-4 mb-5 select-none">{userStats.total}</div>
            
            <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-circle-check text-[10px]" />
                  </div>
                  <span>Activos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{userStats.activos}</span>
                  <span className="text-slate-400 text-[10px]">{userStats.actPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#fff8eb] text-[#ea580c] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-clock text-[10px]" />
                  </div>
                  <span>Invitados/Pendientes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{userStats.pendientes}</span>
                  <span className="text-slate-400 text-[10px]">{userStats.pendPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-[#6c3aed] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-user-group text-[9px]" />
                  </div>
                  <span>Padres vinculados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{userStats.padres}</span>
                  <span className="text-slate-400 text-[10px]">{userStats.padresPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-shield-halved text-[9px]" />
                  </div>
                  <span>Administradores</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{userStats.administradores}</span>
                  <span className="text-slate-400 text-[10px]">{userStats.adminPct}%</span>
                </div>
              </div>
            </div>

            {/* Bottom green action button */}
            <button className="mt-5 w-full bg-[#eefcf4] hover:bg-[#e2f7ea] text-[#2e9e5b] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-colors select-none cursor-pointer">
              <span>Ver reporte completo</span>
              <i className="fa-solid fa-chevron-right text-[9px]" />
            </button>
          </div>

          {/* Donut Chart Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm">Distribución por rol</h3>
            
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center h-40 w-40 mx-auto mt-4 mb-5">
              <svg width="140" height="140" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Sector 1: Niños (purple #8b5cf6) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="11" strokeDasharray={`${userStats.ninosLen} 251.3`} strokeDashoffset={`${userStats.ninosOff}`} />
                {/* Sector 2: Adolescentes (sky blue #0ea5e9) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="11" strokeDasharray={`${userStats.adolLen} 251.3`} strokeDashoffset={`${userStats.adolOff}`} />
                {/* Sector 3: Padres/Madres (orange #f97316) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="11" strokeDasharray={`${userStats.padresLen} 251.3`} strokeDashoffset={`${userStats.padresOff}`} />
                {/* Sector 4: Moderadores (dark blue #2563eb) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563eb" strokeWidth="11" strokeDasharray={`${userStats.modLen} 251.3`} strokeDashoffset={`${userStats.modOff}`} />
                {/* Sector 5: Administradores (green #10b981) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="11" strokeDasharray={`${userStats.adminLen} 251.3`} strokeDashoffset={`${userStats.adminOff}`} />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-800 leading-none">{userStats.total}</span>
                <span className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-wider">Usuarios</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  <span>Niños</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-850">{userStats.ninos}</span>
                  <span className="text-slate-400 text-[10px]">({userStats.ninosPct}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
                  <span>Adolescentes</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-850">{userStats.adolescentes}</span>
                  <span className="text-slate-400 text-[10px]">({userStats.adolPct}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                  <span>Padres/Madres</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-850">{userStats.padres}</span>
                  <span className="text-slate-400 text-[10px]">({userStats.padresPct}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span>Moderadores</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-850">{userStats.moderadores}</span>
                  <span className="text-slate-400 text-[10px]">({userStats.modPct}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Administradores</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-850">{userStats.administradores}</span>
                  <span className="text-slate-400 text-[10px]">({userStats.adminPct}%)</span>
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <button className="mt-5 w-full bg-[#eefcf4] hover:bg-[#e2f7ea] text-[#2e9e5b] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-colors select-none cursor-pointer">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-user-group text-[10px]" />
                <span>Ver detalles por rol</span>
              </div>
              <i className="fa-solid fa-chevron-right text-[9px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

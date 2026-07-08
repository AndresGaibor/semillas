import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerUsuariosAdmin } from "../features/admin/admin.api";

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
import type { TipoRol } from "@/componentes/ui/badge-rol";
import type { EstadoUsuario } from "@/componentes/ui/badge-estado-usuario";
import { AdminUsersFilters } from "@/features/admin/componentes/admin-users-filters";
import { AdminUsersTable, type UserTableRow } from "@/features/admin/componentes/admin-users-table";
import { AdminUsersSummary, type UserStats } from "@/features/admin/componentes/admin-users-summary";

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsuariosPage
});

function AdminUsuariosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [selectedRol, setSelectedRol] = useState("");
  const [selectedFranja, setSelectedFranja] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => obtenerUsuariosAdmin()
  });

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

      const avatarsList = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];
      const avatarImg = u.perfil?.avatar_url || avatarsList[index % avatarsList.length]!;

      let rol: TipoRol = "Niño";
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
        rol,
        franja,
        club,
        clubIcon,
        clubIconColor,
        clubBadgeBg,
        nivelText: levelText,
        xpText,
        isVinculado,
        estado: (isActivo ? "activo" : "bloqueado") as EstadoUsuario,
        ultimoAcceso: dateStr
      };
    });
    return dbMapped;
  }, [usersQuery.data]);

  const filteredUsers = useMemo(() => {
    return mappedUsers.filter((usr) => {
      if (searchValue && !usr.nombre.toLowerCase().includes(searchValue.toLowerCase()) && !usr.correo.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      if (selectedRol && (usr.rol as string) !== selectedRol) return false;
      if (selectedFranja && usr.franja !== selectedFranja) return false;
      if (selectedEstado && (usr.estado as string) !== selectedEstado) return false;
      if (selectedClub && usr.club !== selectedClub) return false;
      return true;
    });
  }, [mappedUsers, searchValue, selectedRol, selectedFranja, selectedEstado, selectedClub]);

  const userStats: UserStats = useMemo(() => {
    let activos = 0;
    let bloqueados = 0;
    let pendientes = 0;
    let ninos = 0;
    let adolescentes = 0;
    let padres = 0;
    let moderadores = 0;
    let administradores = 0;

    for (const u of mappedUsers) {
      if (u.estado === "activo") activos++;
      else if (u.estado === "bloqueado") bloqueados++;
      else pendientes++;
      const rol = u.rol as string;
      if (rol === "Niño") ninos++;
      else if (rol === "Adolescente") adolescentes++;
      else if (rol === "Padre/Madre") padres++;
      else if (rol === "Moderador") moderadores++;
      else if (rol === "Administrador") administradores++;
    }

    const total = mappedUsers.length || 1;
    return {
      total: mappedUsers.length,
      activos, bloqueados, pendientes,
      ninos, adolescentes, padres, moderadores, administradores,
      actPct: Math.round((activos / total) * 100),
      pendPct: Math.round((pendientes / total) * 100),
      blockPct: Math.round((bloqueados / total) * 100),
      ninosPct: Math.round((ninos / total) * 100),
      adolPct: Math.round((adolescentes / total) * 100),
      padresPct: Math.round((padres / total) * 100),
      modPct: Math.round((moderadores / total) * 100),
      adminPct: Math.round((administradores / total) * 100),
    };
  }, [mappedUsers]);

  const clearFilters = () => {
    setSearchValue("");
    setSelectedRol("");
    setSelectedFranja("");
    setSelectedEstado("");
    setSelectedClub("");
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
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
                <div className="w-[1px] bg-white/20 h-full" />
                <button className="!bg-verde-brote hover:opacity-90 !text-white px-3 flex items-center justify-center transition-colors h-full outline-none cursor-pointer">
                  <i className="fa-solid fa-chevron-down text-[10px]" />
                </button>
              </div>
            </div>
          </div>

          <AdminUsersFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedRol={selectedRol}
            onRolChange={setSelectedRol}
            selectedFranja={selectedFranja}
            onFranjaChange={setSelectedFranja}
            selectedEstado={selectedEstado}
            onEstadoChange={setSelectedEstado}
            selectedClub={selectedClub}
            onClubChange={setSelectedClub}
            onClear={clearFilters}
          />

          <AdminUsersTable
            usuarios={filteredUsers}
            isLoading={usersQuery.isLoading}
            isError={usersQuery.isError}
            errorMensaje={(usersQuery.error as Error)?.message}
            onReintentar={() => usersQuery.refetch()}
            totalResultados={filteredUsers.length}
            paginaActual={paginaActual}
            onCambiarPagina={setPaginaActual}
          />
        </div>

        <div className="flex flex-col gap-6">
          <AdminUsersSummary stats={userStats} />
        </div>
      </div>
    </div>
  );
}

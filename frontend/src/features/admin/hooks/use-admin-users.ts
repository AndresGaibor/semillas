import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerUsuariosAdmin } from "../admin.api";

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
import type { UserTableRow } from "../componentes/admin-users-table";
import type { UserStats } from "../componentes/admin-users-summary";

const avatarsList = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];

export function useAdminUsers() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRol, setSelectedRol] = useState("");
  const [selectedFranja, setSelectedFranja] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const usersQuery = useQuery({ queryKey: ["admin", "users"], queryFn: () => obtenerUsuariosAdmin() });

  const mappedUsers = useMemo(() => {
    const dbUsers = usersQuery.data?.usuarios ?? [];

    return dbUsers.map((u, index) => {
      const isActivo = u.activo ?? true;
      const apodo = u.perfil?.apodo || u.nombre_visible || u.correo?.split("@")[0] || "Usuario Semilla";
      const email = u.correo || "usuario@semillas.org";
      const lvl = u.perfil?.nivel_actual || 1;
      const xp = u.perfil?.xp_acumulada || 0;
      const dateObj = u.ultimo_login_en ? new Date(u.ultimo_login_en) : new Date();
      const dateStr = dateObj.toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" }) + " / " + dateObj.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });

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
        rol = "Administrador"; franja = "Todas"; club = "Todos los clubes"; clubIcon = "fa-people-group"; clubIconColor = "text-[#6c3aed]"; clubBadgeBg = "bg-[#6c3aed]/10";
      } else if (u.rol === "moderador") {
        rol = "Moderador"; franja = "Todas"; club = "Todos los clubes"; clubIcon = "fa-people-group"; clubIconColor = "text-[#6c3aed]"; clubBadgeBg = "bg-[#6c3aed]/10";
      } else if (!u.perfil?.grupo_edad_id) {
        rol = "Padre/Madre"; franja = "-"; club = "Semillitas de Luz"; isVinculado = true; levelText = "Vinculado"; xpText = "";
      }

      return {
        id: u.id, nombre: apodo, correo: email, avatarImg, rol, franja, club,
        clubIcon, clubIconColor, clubBadgeBg, nivelText: levelText, xpText,
        isVinculado, estado: (isActivo ? "activo" : "bloqueado") as EstadoUsuario,
        ultimoAcceso: dateStr,
      };
    });
  }, [usersQuery.data]);

  const filteredUsers = useMemo(() => {
    return mappedUsers.filter((usr) => {
      if (searchValue && !usr.nombre.toLowerCase().includes(searchValue.toLowerCase()) && !usr.correo.toLowerCase().includes(searchValue.toLowerCase())) return false;
      if (selectedRol && (usr.rol as string) !== selectedRol) return false;
      if (selectedFranja && usr.franja !== selectedFranja) return false;
      if (selectedEstado && (usr.estado as string) !== selectedEstado) return false;
      if (selectedClub && usr.club !== selectedClub) return false;
      return true;
    });
  }, [mappedUsers, searchValue, selectedRol, selectedFranja, selectedEstado, selectedClub]);

  const userStats: UserStats = useMemo(() => {
    let activos = 0, bloqueados = 0, pendientes = 0, ninos = 0, adolescentes = 0, padres = 0, moderadores = 0, administradores = 0;
    for (const u of mappedUsers) {
      if (u.estado === "activo") activos++; else if (u.estado === "bloqueado") bloqueados++; else pendientes++;
      const rol = u.rol as string;
      if (rol === "Niño") ninos++; else if (rol === "Adolescente") adolescentes++; else if (rol === "Padre/Madre") padres++;
      else if (rol === "Moderador") moderadores++; else if (rol === "Administrador") administradores++;
    }
    const total = mappedUsers.length || 1;
    return {
      total: mappedUsers.length, activos, bloqueados, pendientes,
      ninos, adolescentes, padres, moderadores, administradores,
      actPct: Math.round((activos / total) * 100), pendPct: Math.round((pendientes / total) * 100),
      blockPct: Math.round((bloqueados / total) * 100), ninosPct: Math.round((ninos / total) * 100),
      adolPct: Math.round((adolescentes / total) * 100), padresPct: Math.round((padres / total) * 100),
      modPct: Math.round((moderadores / total) * 100), adminPct: Math.round((administradores / total) * 100),
    };
  }, [mappedUsers]);

  const clearFilters = () => {
    setSearchValue(""); setSelectedRol(""); setSelectedFranja(""); setSelectedEstado(""); setSelectedClub("");
  };

  return {
    searchValue, setSearchValue,
    selectedRol, setSelectedRol,
    selectedFranja, setSelectedFranja,
    selectedEstado, setSelectedEstado,
    selectedClub, setSelectedClub,
    paginaActual, setPaginaActual,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: () => usersQuery.refetch(),
    filteredUsers, userStats, clearFilters,
  };
}

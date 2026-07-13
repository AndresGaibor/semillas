import { useState } from "react";
import { RefreshCw, Search, ShieldAlert, WifiOff } from "lucide-react";
import { toast } from "sonner";

import type { ClubAdminResumen, CrearRetoClubAdminSolicitud, DetalleClubAdmin } from "../../admin-clubes.api";
import { useAdminClubes } from "../../hooks/use-admin-clubes";

import { TarjetaClub } from "./TarjetaClub";
import { BotonEstadoClub } from "./BotonEstadoClub";
import { DetalleClub } from "./DetalleClub";
import { DialogoConfirmacion, type Confirmacion } from "./DialogoConfirmacion";
export { enviarRetoDesdeFormulario } from "./FormularioCrearReto";

type EstadoFiltro = "activo" | "archivado" | "todos";

export type EstadoAdminClubesPanel = {
  clubes: ClubAdminResumen[];
  total: number;
  isLoading: boolean;
  online?: boolean;
  error?: string;
  detalle?: DetalleClubAdmin;
  confirmacion?: Confirmacion;
  seleccionId?: string;
  busqueda?: string;
  estadoFiltro?: EstadoFiltro;
  mutando?: boolean;
};

type AdminClubesPanelVistaProps = {
  estado: EstadoAdminClubesPanel;
  onBuscar?: (busqueda: string) => void;
  onCambiarEstado?: (estado: EstadoFiltro) => void;
  onSeleccionar?: (id: string) => void;
  onConfirmar?: () => void;
  onCancelarConfirmacion?: () => void;
  onReintentar?: () => void;
  onAccion?: (confirmacion: Confirmacion) => void;
  onCrearReto?: (clubId: string, datos: CrearRetoClubAdminSolicitud) => void;
};

function textoError(error: unknown) {
  return error instanceof Error ? error.message : "No fue posible completar la acción.";
}

export function AdminClubesPanelVista({
  estado,
  onBuscar,
  onCambiarEstado,
  onSeleccionar,
  onConfirmar,
  onCancelarConfirmacion,
  onReintentar,
  onAccion,
  onCrearReto,
}: AdminClubesPanelVistaProps) {
  const online = estado.online ?? true;
  const seleccionado = estado.clubes.find((club) => club.id === estado.seleccionId);

  return (
    <section aria-labelledby="admin-clubes-title" className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Moderación</span>
          <h2 id="admin-clubes-title" className="mt-1 text-3xl font-black tracking-tight text-slate-900">Clubes</h2>
          <p className="mt-1 text-sm text-slate-500">Administra miembros, liderazgo y retos cooperativos.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600">
          {estado.total} clubes
        </span>
      </header>

      {!online && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <WifiOff className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">La administración de clubes requiere conexión a internet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar clubes</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            aria-label="Buscar clubes"
            type="search"
            value={estado.busqueda ?? ""}
            onChange={(evento) => onBuscar?.(evento.target.value)}
            disabled={!online}
            placeholder="Buscar por nombre o líder"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </label>
        <label className="text-sm font-bold text-slate-600">
          <span className="sr-only">Filtrar por estado</span>
          <select
            aria-label="Filtrar por estado"
            value={estado.estadoFiltro ?? "activo"}
            onChange={(evento) => onCambiarEstado?.(evento.target.value as EstadoFiltro)}
            disabled={!online}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-auto"
          >
            <option value="activo">Activos</option>
            <option value="archivado">Archivados</option>
            <option value="todos">Todos</option>
          </select>
        </label>
      </div>

      {estado.isLoading ? (
        <div aria-label="Cargando clubes" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["uno", "dos", "tres"].map((clave) => (
            <div key={clave} className="h-36 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : estado.error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <ShieldAlert className="mx-auto size-8 text-red-600" aria-hidden="true" />
          <p className="mt-3 font-bold text-red-900">{estado.error}</p>
          <button
            type="button"
            onClick={onReintentar}
            disabled={!online}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            <RefreshCw className="size-4" aria-hidden="true" /> Reintentar
          </button>
        </div>
      ) : estado.clubes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="mt-3 font-bold text-slate-700">No hay clubes para estos filtros.</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <div className="grid gap-3 md:hidden">
              {estado.clubes.map((club) => (
                <TarjetaClub
                  key={club.id}
                  club={club}
                  seleccionado={club.id === estado.seleccionId}
                  deshabilitado={!online}
                  onSeleccionar={onSeleccionar}
                  onAccion={onAccion}
                />
              ))}
            </div>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Club</th>
                    <th className="px-4 py-3">Líder</th>
                    <th className="px-4 py-3 text-center">Miembros</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estado.clubes.map((club) => (
                    <tr key={club.id} className={club.id === estado.seleccionId ? "bg-emerald-50/60" : ""}>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onSeleccionar?.(club.id)}
                          className="font-bold text-slate-800 hover:text-emerald-700"
                        >
                          {club.nombre}
                        </button>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {club.activo ? "Activo" : "Archivado"} · {club.retos_abiertos} retos
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{club.lider?.apodo ?? "Sin líder"}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{club.miembros}</td>
                      <td className="px-4 py-3 text-right">
                        <BotonEstadoClub
                          club={club}
                          deshabilitado={!online || (estado.mutando ?? false)}
                          onAccion={onAccion}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DetalleClub
            club={seleccionado}
            detalle={estado.detalle}
            deshabilitado={!online || (estado.mutando ?? false)}
            onAccion={onAccion}
            onCrearReto={onCrearReto}
          />
        </div>
      )}

      {estado.confirmacion && (
        <DialogoConfirmacion
          confirmacion={estado.confirmacion}
          mutando={estado.mutando ?? false}
          onConfirmar={onConfirmar}
          onCancelar={onCancelarConfirmacion}
        />
      )}
    </section>
  );
}

export function AdminClubesPanel() {
  const [busqueda, establecerBusqueda] = useState("");
  const [estadoFiltro, establecerEstadoFiltro] = useState<EstadoFiltro>("activo");
  const [seleccionId, establecerSeleccionId] = useState<string>();
  const [confirmacion, establecerConfirmacion] = useState<Confirmacion>();

  const clubes = useAdminClubes({ q: busqueda || undefined, estado: estadoFiltro, limit: 20, offset: 0 }, seleccionId);
  const listado = clubes.listado.data;
  const mutando =
    clubes.archivar.isPending ||
    clubes.reactivar.isPending ||
    clubes.expulsarMiembro.isPending ||
    clubes.transferirLiderazgo.isPending ||
    clubes.crearReto.isPending ||
    clubes.cerrarReto.isPending;

  const confirmar = async () => {
    if (!confirmacion) return;
    try {
      if (confirmacion.tipo === "archivar") await clubes.archivar.mutateAsync(confirmacion.club.id);
      if (confirmacion.tipo === "reactivar") await clubes.reactivar.mutateAsync(confirmacion.club.id);
      if (confirmacion.tipo === "expulsar" && confirmacion.usuarioId) {
        await clubes.expulsarMiembro.mutateAsync({ clubId: confirmacion.club.id, usuarioId: confirmacion.usuarioId });
      }
      if (confirmacion.tipo === "transferir" && confirmacion.usuarioId) {
        await clubes.transferirLiderazgo.mutateAsync({ clubId: confirmacion.club.id, usuarioId: confirmacion.usuarioId });
      }
      if (confirmacion.tipo === "cerrar-reto" && confirmacion.retoId) {
        await clubes.cerrarReto.mutateAsync({
          clubId: confirmacion.club.id,
          retoId: confirmacion.retoId,
          motivo: "Cierre administrativo desde el CMS.",
        });
      }
      toast.success("Acción administrativa completada.");
      establecerConfirmacion(undefined);
    } catch (error) {
      toast.error(textoError(error));
    }
  };

  const crearReto = async (clubId: string, datos: CrearRetoClubAdminSolicitud) => {
    try {
      await clubes.crearReto.mutateAsync({ clubId, datos });
      toast.success("Reto creado correctamente.");
    } catch (error) {
      toast.error(textoError(error));
    }
  };

  return (
    <AdminClubesPanelVista
      estado={{
        clubes: listado?.clubes ?? [],
        total: listado?.meta.total ?? 0,
        isLoading: clubes.listado.isLoading,
        online: clubes.estaConectado,
        error: clubes.listado.error ? textoError(clubes.listado.error) : undefined,
        detalle: clubes.detalle.data,
        seleccionId,
        busqueda,
        estadoFiltro,
        confirmacion,
        mutando,
      }}
      onBuscar={establecerBusqueda}
      onCambiarEstado={establecerEstadoFiltro}
      onSeleccionar={establecerSeleccionId}
      onAccion={establecerConfirmacion}
      onCancelarConfirmacion={() => establecerConfirmacion(undefined)}
      onConfirmar={confirmar}
      onCrearReto={crearReto}
      onReintentar={() => void clubes.listado.refetch()}
    />
  );
}

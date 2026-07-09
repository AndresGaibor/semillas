import { useState } from "react";

import { AvatarTexto } from "@/componentes/ui/avatar-texto";
import { BadgeEstado } from "@/componentes/ui/badge-estado";
import { FilaTabla, TablaBase } from "@/componentes/ui/tabla-base";
import { BotonAccion, getSendaIcon, MenuAcciones, normalizarEstado, type MenuAccionItem } from "./admin.helpers";

export type TemaTableRow = {
  id: string;
  titulo: string;
  resumen: string;
  portadaUrl?: string;
  sendaNombre: string;
  sendaColorHex?: string;
  sendaIcono?: string; // FontAwesome class
  franjaEdad: string;
  estado: "borrador" | "revision" | "publicado" | "archivado" | string;
  fechaEdicion: string;
  horaEdicion?: string;
  autorNombre: string;
  autorAvatar: string;
};

type AdminThemesTableProps = {
  temas: TemaTableRow[];
  onEditar: (id: string) => void;
  onCRECER: (id: string) => void;
  onActivities: (id: string) => void;
  onPreview: (id: string) => void;
  onDetalle?: (id: string) => void;
  onPublicar?: (id: string) => void;
  onDespublicar?: (id: string) => void;
};

export function AdminThemesTable({
  temas,
  onEditar,
  onCRECER,
  onActivities,
  onPreview,
  onDetalle,
  onPublicar,
  onDespublicar,
}: AdminThemesTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const encabezados = [
    { contenido: <input type="checkbox" aria-label="Seleccionar todos los temas" className="rounded border-slate-300 text-primario focus:ring-primario" />, className: "w-10 pl-6" },
    { contenido: "Tema", className: "font-extrabold" },
    { contenido: "Senda", className: "font-semibold" },
    { contenido: "Franja", className: "font-semibold" },
    { contenido: "Estado", className: "font-semibold" },
    {
      contenido: (
        <span className="flex items-center gap-1">
          Última edición <i className="fa-solid fa-sort text-slate-300 text-[10px]" />
        </span>
      ),
      className: "font-semibold",
    },
    { contenido: "Autor", className: "font-semibold" },
    { contenido: "Acciones", className: "pr-6 text-right font-semibold" },
  ];

  return (
    <TablaBase encabezados={encabezados} contenedorClassName="max-h-[560px] select-none" tablaClassName="text-sm">
      {temas.map((tema) => {
        const sendaIconConfig = getSendaIcon(tema.sendaNombre, tema.sendaIcono);
        const estadoNormalizado = tema.estado.trim().toLowerCase();

        return (
          <FilaTabla key={tema.id} onActivate={() => onDetalle?.(tema.id)} className="hover:bg-slate-50/30">
            <td className="py-4 pl-6">
              <input type="checkbox" aria-label={`Seleccionar ${tema.titulo}`} className="rounded border-slate-300 text-primario focus:ring-primario" />
            </td>

            <td className="py-4 px-4">
              <button
                type="button"
                onClick={() => onDetalle?.(tema.id)}
                className="text-left w-full"
              >
                <AvatarTexto
                  src={tema.portadaUrl || "https://api.dicebear.com/7.x/identicon/svg?seed=Tema"}
                  alt={tema.titulo}
                  titulo={tema.titulo}
                  subtitulo={tema.resumen || "Sin descripción..."}
                  className="max-w-[220px]"
                  avatarClassName="h-12 w-12 rounded-xl border border-slate-100 shadow-xs"
                  contenidoClassName="max-w-[160px]"
                  tituloClassName="font-extrabold leading-tight text-neutro-oscuro-max hover:text-primario transition-colors"
                  subtituloClassName="mt-1 text-[11px] leading-snug text-neutro"
                />
              </button>
            </td>

            <td className="py-4 px-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${sendaIconConfig.color}`}>
                  <i className={`fa-solid ${sendaIconConfig.icon} text-xs`} />
                </span>
                <span className="font-semibold text-neutro-oscuro">{tema.sendaNombre}</span>
              </div>
            </td>

            <td className="py-4 px-4 font-semibold whitespace-nowrap text-neutro">{tema.franjaEdad}</td>

            <td className="py-4 px-4 whitespace-nowrap">
              <BadgeEstado estado={tema.estado} />
            </td>

            <td className="py-4 px-4 text-xs font-semibold whitespace-nowrap text-neutro">
              <div className="flex flex-col">
                <span>{tema.fechaEdicion}</span>
                {tema.horaEdicion ? <span className="text-[10px] font-normal text-slate-400">{tema.horaEdicion}</span> : null}
              </div>
            </td>

            <td className="py-4 px-4 whitespace-nowrap">
              <AvatarTexto
                src={tema.autorAvatar}
                alt={tema.autorNombre}
                titulo={tema.autorNombre}
                className="gap-2"
                avatarClassName="h-6 w-6 rounded-full border border-slate-200"
                tituloClassName="text-xs font-extrabold text-neutro-oscuro"
              />
            </td>

            <td className="relative py-4 pr-6 whitespace-nowrap text-right">
              <div className="flex items-center justify-end gap-1.5">
                <BotonAccion title="Vista previa" icon="fa-eye" onClick={() => onPreview(tema.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" />

                <BotonAccion title="Ver detalle" icon="fa-file-lines" onClick={() => onDetalle?.(tema.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primario" />

                <BotonAccion title="Editar tema" icon="fa-pencil" onClick={() => onEditar(tema.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" />

                <div className="relative">
                  <BotonAccion title="Más opciones" icon="fa-ellipsis-vertical" onClick={() => setActiveMenuId(activeMenuId === tema.id ? null : tema.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" />

                  {activeMenuId === tema.id ? (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                      <div className="absolute right-0 z-20 mt-1.5 w-40 rounded-xl border border-slate-100 bg-white py-1.5 text-left shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              onCRECER(tema.id);
                              setActiveMenuId(null);
                            }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-neutro-oscuro-max transition-colors hover:bg-slate-50"
                        >
                          <i className="fa-solid fa-bookmark w-4 text-center text-slate-400" />
                          Editor CRECER
                        </button>
                          <button
                            type="button"
                            onClick={() => {
                              onActivities(tema.id);
                              setActiveMenuId(null);
                            }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-neutro-oscuro-max transition-colors hover:bg-slate-50"
                        >
                          <i className="fa-solid fa-gamepad w-4 text-center text-slate-400" />
                          Actividades
                        </button>
                        {estadoNormalizado !== "publicado" ? (
                          <button
                            type="button"
                            onClick={() => {
                              onPublicar?.(tema.id);
                              setActiveMenuId(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-primario transition-colors hover:bg-slate-50"
                          >
                            <i className="fa-solid fa-cloud-arrow-up w-4 text-center text-primario" />
                            Publicar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onDespublicar?.(tema.id);
                              setActiveMenuId(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-[#EE6C4D] transition-colors hover:bg-slate-50"
                          >
                            <i className="fa-solid fa-cloud-arrow-down w-4 text-center text-[#EE6C4D]" />
                            Despublicar
                          </button>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </td>
          </FilaTabla>
        );
      })}
    </TablaBase>
  );
}

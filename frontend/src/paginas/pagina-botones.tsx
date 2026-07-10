import {
  Ban,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  CloudDownload,
  CloudUpload,
  Download,
  ExternalLink,
  Flag,
  Headphones,
  HelpCircle,
  Lightbulb,
  MoreVertical,
  PlayCircle,
  Plus,
  Settings,
  Share2,
  Star,
  Trash2,
} from "lucide-react";

import { Boton } from "@/componentes/ui/boton";
import { BotonesPageHeader } from "./botones-page-header";

export function PaginaBotones() {
  return (
    <div className="min-h-screen bg-[#fbfdfc] p-6 text-slate-950">
      <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-7">
          <BotonesPageHeader />
        </aside>

        <main className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <section className="space-y-8">
            <TituloSeccion>Tipos de botones</TituloSeccion>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-6">
              <ColumnaTipo titulo="Primario (Morado)">
                <Boton variante="primario" iconoIzquierdo={<Star className="size-4" />}>
                  Continuar
                </Boton>
                <Boton variante="primario" forma="pildora" iconoIzquierdo={<BookOpen className="size-5" />}>
                  Ver lección
                </Boton>
                <Boton variante="primario" tamano="icono" aria-label="Descargar">
                  <Download className="size-5" />
                </Boton>
              </ColumnaTipo>

              <ColumnaTipo titulo="Primario (Verde)">
                <Boton variante="exito" iconoIzquierdo={<CheckCircle2 className="size-4" />}>
                  Guardar
                </Boton>
                <Boton variante="exito" forma="pildora" iconoIzquierdo={<PlayCircle className="size-5" />}>
                  Iniciar actividad
                </Boton>
                <Boton variante="exito" tamano="icono" aria-label="Subir">
                  <CloudUpload className="size-5" />
                </Boton>
              </ColumnaTipo>

              <ColumnaTipo titulo="Secundario">
                <Boton variante="secundario">Cancelar</Boton>
                <Boton variante="secundario" iconoDerecho={<MoreVertical className="size-4" />}>
                  Más opciones
                </Boton>
                <Boton variante="secundario" tamano="icono" aria-label="Configuración">
                  <Settings className="size-5" />
                </Boton>
              </ColumnaTipo>

              <ColumnaTipo titulo="Contorno">
                <Boton variante="contorno" iconoIzquierdo={<Plus className="size-4" />}>
                  Nuevo
                </Boton>
                <Boton variante="contorno" iconoIzquierdo={<Bookmark className="size-4" />}>
                  Guardar para después
                </Boton>
                <Boton variante="contorno" tamano="icono" aria-label="Compartir">
                  <Share2 className="size-5" />
                </Boton>
              </ColumnaTipo>

              <ColumnaTipo titulo="Texto">
                <Boton variante="texto" iconoDerecho={<ChevronRight className="size-4" />}>
                  Ver más
                </Boton>
                <Boton variante="texto" iconoDerecho={<ExternalLink className="size-4" />}>
                  Aprender más
                </Boton>
                <Boton variante="texto" iconoIzquierdo={<HelpCircle className="size-4" />}>
                  Ayuda
                </Boton>
              </ColumnaTipo>

              <ColumnaTipo titulo="Peligro">
                <Boton variante="peligro" iconoIzquierdo={<Trash2 className="size-4" />}>
                  Eliminar
                </Boton>
                <Boton variante="peligroContorno" iconoIzquierdo={<Flag className="size-4" />}>
                  Reportar
                </Boton>
                <Boton variante="peligroContorno" tamano="icono" aria-label="Bloquear">
                  <Ban className="size-5" />
                </Boton>
              </ColumnaTipo>
            </div>
          </section>

          <Separador />

          <section className="space-y-8">
            <TituloSeccion>Estados</TituloSeccion>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-5">
              <ColumnaEstado titulo="Default">
                <Boton variante="primario" iconoIzquierdo={<Star className="size-4" />} anchoCompleto>
                  Continuar
                </Boton>
                <Boton variante="exito" iconoIzquierdo={<CheckCircle2 className="size-4" />} anchoCompleto>
                  Guardar
                </Boton>
                <Boton variante="secundario" anchoCompleto>
                  Cancelar
                </Boton>
                <Boton variante="contorno" iconoIzquierdo={<Plus className="size-4" />} anchoCompleto>
                  Nuevo
                </Boton>
                <Boton variante="peligro" iconoIzquierdo={<Trash2 className="size-4" />} anchoCompleto>
                  Eliminar
                </Boton>
              </ColumnaEstado>

              <ColumnaEstado titulo="Hover">
                <Boton variante="primario" estadoVisual="encima" iconoIzquierdo={<Star className="size-4" />} anchoCompleto>
                  Continuar
                </Boton>
                <Boton variante="exito" estadoVisual="encima" iconoIzquierdo={<CheckCircle2 className="size-4" />} anchoCompleto>
                  Guardar
                </Boton>
                <Boton variante="secundario" estadoVisual="encima" anchoCompleto>
                  Cancelar
                </Boton>
                <Boton variante="contorno" estadoVisual="encima" iconoIzquierdo={<Plus className="size-4" />} anchoCompleto>
                  Nuevo
                </Boton>
                <Boton variante="peligro" estadoVisual="encima" iconoIzquierdo={<Trash2 className="size-4" />} anchoCompleto>
                  Eliminar
                </Boton>
              </ColumnaEstado>

              <ColumnaEstado titulo="Presionado (Activo)">
                <Boton variante="primario" estadoVisual="presionado" iconoIzquierdo={<Star className="size-4" />} anchoCompleto>
                  Continuar
                </Boton>
                <Boton variante="exito" estadoVisual="presionado" iconoIzquierdo={<CheckCircle2 className="size-4" />} anchoCompleto>
                  Guardar
                </Boton>
                <Boton variante="secundario" estadoVisual="presionado" anchoCompleto>
                  Cancelar
                </Boton>
                <Boton variante="contorno" estadoVisual="presionado" iconoIzquierdo={<Plus className="size-4" />} anchoCompleto>
                  Nuevo
                </Boton>
                <Boton variante="peligro" estadoVisual="presionado" iconoIzquierdo={<Trash2 className="size-4" />} anchoCompleto>
                  Eliminar
                </Boton>
              </ColumnaEstado>

              <ColumnaEstado titulo="Deshabilitado">
                <Boton variante="primario" deshabilitado anchoCompleto>
                  Continuar
                </Boton>
                <Boton variante="exito" deshabilitado anchoCompleto>
                  Guardar
                </Boton>
                <Boton variante="secundario" deshabilitado anchoCompleto>
                  Cancelar
                </Boton>
                <Boton variante="contorno" iconoIzquierdo={<Plus className="size-4" />} deshabilitado anchoCompleto>
                  Nuevo
                </Boton>
                <Boton variante="peligro" deshabilitado anchoCompleto>
                  Eliminar
                </Boton>
              </ColumnaEstado>

              <ColumnaEstado titulo="Cargando">
                <Boton variante="primario" cargando textoCargando="Cargando..." anchoCompleto>
                  Continuar
                </Boton>
                <Boton variante="exito" cargando textoCargando="Guardando..." anchoCompleto>
                  Guardar
                </Boton>
                <Boton variante="secundario" cargando textoCargando="Procesando..." anchoCompleto>
                  Cancelar
                </Boton>
                <Boton variante="contorno" cargando textoCargando="Cargando..." anchoCompleto>
                  Nuevo
                </Boton>
                <Boton variante="peligro" cargando textoCargando="Eliminando..." anchoCompleto>
                  Eliminar
                </Boton>
              </ColumnaEstado>
            </div>
          </section>

          <Separador />

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-slate-200 p-6">
              <TituloSeccion>Tamaños</TituloSeccion>

              <div className="mt-7 flex flex-wrap items-end gap-7">
                <GrupoTamano etiqueta="Grande" descripcion="Altura: 56px">
                  <Boton variante="primario" tamano="grande" iconoIzquierdo={<Star className="size-5" />}>
                    Continuar
                  </Boton>
                </GrupoTamano>
                <GrupoTamano etiqueta="Mediano" descripcion="Altura: 44px">
                  <Boton variante="primario" tamano="mediano" iconoIzquierdo={<Star className="size-4" />}>
                    Continuar
                  </Boton>
                </GrupoTamano>
                <GrupoTamano etiqueta="Pequeño" descripcion="Altura: 36px">
                  <Boton variante="primario" tamano="pequeno" iconoIzquierdo={<Star className="size-3.5" />}>
                    Continuar
                  </Boton>
                </GrupoTamano>
                <GrupoTamano etiqueta="Icono" descripcion="44x44px">
                  <Boton variante="primario" tamano="icono" aria-label="Favorito">
                    <Star className="size-5 fill-current" />
                  </Boton>
                </GrupoTamano>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <TituloSeccion>Botones con íconos</TituloSeccion>

              <div className="mt-7 flex flex-wrap gap-4">
                <Boton variante="exito" iconoIzquierdo={<CloudDownload className="size-5" />}>
                  Descargar
                </Boton>
                <Boton variante="primario" iconoIzquierdo={<PlayCircle className="size-5" />}>
                  Ver video
                </Boton>
                <Boton variante="primario" iconoIzquierdo={<Headphones className="size-5" />}>
                  Escuchar
                </Boton>
                <Boton variante="contorno" iconoIzquierdo={<Bookmark className="size-5" />}>
                  Guardar
                </Boton>
              </div>
            </div>
          </section>

          <div className="mt-7 flex items-center gap-3 rounded-xl bg-green-50 px-5 py-4 text-green-800">
            <Lightbulb className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              <strong>Tip:</strong> Usa los botones primarios para guiar la acción del usuario y mantener un flujo claro en la experiencia.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-extrabold tracking-tight text-violet-700">{children}</h2>;
}

function Separador() {
  return <div className="my-8 h-px w-full bg-slate-200" />;
}

function ColumnaTipo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-extrabold text-slate-900">{titulo}</h3>
      <div className="flex min-h-[220px] flex-col items-start gap-5">{children}</div>
    </div>
  );
}

function ColumnaEstado({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-center text-sm font-extrabold text-slate-900">{titulo}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function GrupoTamano({ etiqueta, descripcion, children }: { etiqueta: string; descripcion: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 text-center">
      <p className="text-sm font-extrabold text-slate-900">{etiqueta}</p>
      {children}
      <p className="text-xs font-bold text-slate-700">{descripcion}</p>
    </div>
  );
}

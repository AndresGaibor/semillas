import { Image as ImageIcon } from "lucide-react";

import {
  type ActivityTypeConfigBuilderProps,
  type ConfiguracionActividad,
  campoActualizar,
  campoActualizarVarias,
  obtenerAfirmaciones,
  obtenerListaTexto,
  obtenerPares,
  obtenerTarjetas,
} from "./activity-config-utils";
import { CampoConfiguracion } from "./activity-config-primitives";
import { ListaTextoEditor } from "./activity-config-list-editors";
import { SelectorMedioBiblioteca } from "./activity-config-media-selector";
import { AudioBuilder } from "./builders/audio.builder";
import { VideoBuilder } from "./builders/video.builder";
import { CompletarVersiculoBuilder } from "./builders/completar-versiculo.builder";
import { AventuraBuilder } from "./builders/aventura.builder";
import { CancionBuilder } from "./builders/cancion.builder";
import { VerdaderoFalsoBuilder } from "./builders/verdadero-falso.builder";
import { ParesBuilder } from "./builders/pares.builder";
import { TarjetasBuilder } from "./builders/tarjetas.builder";

export function ActivityTypeConfigBuilder({
  codigo,
  configuracion,
  onChange,
  onUpload,
  resources,
  uploading,
}: ActivityTypeConfigBuilderProps) {
  const actualizar = campoActualizar(configuracion, onChange);
  const actualizarVarias = campoActualizarVarias(configuracion, onChange);

  if (!codigo) {
    return (
      <p className="text-xs text-slate-500">
        Selecciona un tipo para ver sus campos especializados.
      </p>
    );
  }

  if (codigo.includes("video")) {
    return (
      <VideoBuilder
        configuracion={configuracion}
        onChange={onChange}
        recursos={resources}
        onUpload={onUpload}
        uploading={uploading}
      />
    );
  }

  if (codigo === "cancion") {
    return (
      <CancionBuilder
        configuracion={configuracion}
        onChange={onChange}
        recursos={resources}
        onUpload={onUpload}
        uploading={uploading}
      />
    );
  }

  if (codigo.includes("audio")) {
    return (
      <AudioBuilder
        configuracion={configuracion}
        onChange={onChange}
        recursos={resources}
        onUpload={onUpload}
        uploading={uploading}
      />
    );
  }

  if (codigo.includes("completar")) {
    return (
      <CompletarVersiculoBuilder
        configuracion={configuracion}
        onChange={onChange}
      />
    );
  }

  if (codigo === "verdadero_falso") {
    return (
      <VerdaderoFalsoBuilder
        afirmaciones={obtenerAfirmaciones(configuracion.afirmaciones)}
        onChange={(afirmaciones) => actualizar("afirmaciones", afirmaciones)}
      />
    );
  }

  if (codigo === "relacionar_pares") {
    return (
      <ParesBuilder
        pares={obtenerPares(configuracion.pares)}
        onChange={(pares) => actualizar("pares", pares)}
      />
    );
  }

  if (codigo === "tarjetas_memoria") {
    return (
      <TarjetasBuilder
        tarjetas={obtenerTarjetas(configuracion.pares)}
        onChange={(pares) => actualizar("pares", pares)}
      />
    );
  }

  if (codigo === "arrastrar_soltar" || codigo.includes("secuencia")) {
    return (
      <ListaTextoEditor
        titulo="Secuencia correcta"
        valores={obtenerListaTexto(configuracion.items)}
        etiquetaAgregar="Agregar paso"
        onChange={(items) =>
          actualizarVarias({ items, orden_correcto: items.map((_, indice) => indice) })
        }
      />
    );
  }

  if (codigo === "manualidad") {
    return (
      <div className="admin-config-builder__columns">
        <ListaTextoEditor
          titulo="Materiales"
          valores={obtenerListaTexto(configuracion.materiales)}
          etiquetaAgregar="Agregar material"
          onChange={(materiales) => actualizar("materiales", materiales)}
        />
        <ListaTextoEditor
          titulo="Pasos"
          valores={obtenerListaTexto(configuracion.pasos)}
          etiquetaAgregar="Agregar paso"
          onChange={(pasos) => actualizar("pasos", pasos)}
        />
      </div>
    );
  }

  if (codigo === "sopa_letras") {
    return (
      <div className="admin-config-builder__columns">
        <ListaTextoEditor
          titulo="Palabras"
          valores={obtenerListaTexto(configuracion.palabras)}
          etiquetaAgregar="Agregar palabra"
          onChange={(palabras) => actualizar("palabras", palabras)}
        />
        <CampoConfiguracion
          label="Filas"
          value={String(configuracion.filas ?? 12)}
          type="number"
          onChange={(valor) => actualizar("filas", Number(valor))}
        />
        <CampoConfiguracion
          label="Columnas"
          value={String(configuracion.columnas ?? 12)}
          type="number"
          onChange={(valor) => actualizar("columnas", Number(valor))}
        />
      </div>
    );
  }

  if (codigo === "rompecabezas") {
    return (
      <div className="admin-config-builder__columns">
        <SelectorMedioBiblioteca
          configuracion={configuracion}
          claveBase="imagen"
          valorUrl={String(configuracion.imagen ?? "")}
          tipo="imagen"
          titulo="Imagen para rompecabezas"
          descripcion="Selecciona una imagen existente o súbela desde la biblioteca de recursos."
          vacio="Elegir imagen"
          icono={<ImageIcon size={18} />}
          recursos={resources}
          uploading={uploading}
          onUpload={onUpload}
          onChange={onChange}
        />
        <CampoConfiguracion
          label="Filas"
          value={String(configuracion.filas ?? 3)}
          type="number"
          onChange={(valor) => actualizar("filas", Number(valor))}
        />
        <CampoConfiguracion
          label="Columnas"
          value={String(configuracion.columnas ?? 3)}
          type="number"
          onChange={(valor) => actualizar("columnas", Number(valor))}
        />
      </div>
    );
  }

  if (codigo === "aventura_decisiones") {
    return <AventuraBuilder configuracion={configuracion} onChange={onChange} />;
  }

  return (
    <p className="text-xs leading-6 text-slate-500">
      Este tipo no requiere campos adicionales. Configura sus opciones de respuesta, si
      aplica.
    </p>
  );
}

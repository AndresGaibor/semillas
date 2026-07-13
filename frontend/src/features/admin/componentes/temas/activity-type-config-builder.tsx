import { FileAudio, Image as ImageIcon, Plus, Trash2, Upload, Video } from "lucide-react";
import type { ReactNode } from "react";

type ConfiguracionActividad = Record<string, unknown>;

type Afirmacion = { id: string; texto: string; es_verdadero: boolean };
type Par = { id: string; izquierda: string; derecha: string };
type Tarjeta = { id: string; texto: string };

let siguienteIdFila = 0;

function crearIdFila(prefijo: string): string {
  siguienteIdFila += 1;
  return `${prefijo}-${siguienteIdFila}`;
}

type ActivityTypeConfigBuilderProps = {
  codigo: string;
  configuracion: ConfiguracionActividad;
  onChange: (configuracion: ConfiguracionActividad) => void;
  onUpload: (file: File, key: string, tipo: "imagen" | "audio" | "video") => void;
  uploading: boolean;
};

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

export function obtenerListaTexto(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.filter((elemento): elemento is string => typeof elemento === "string") : [];
}

export function obtenerAfirmaciones(valor: unknown): Afirmacion[] {
  if (!Array.isArray(valor)) return [];

  return valor.filter(esRegistro).map((afirmacion) => ({
    id: typeof afirmacion.id === "string" && afirmacion.id.trim() ? afirmacion.id : crearIdFila("afirmacion"),
    texto: typeof afirmacion.texto === "string" ? afirmacion.texto : "",
    es_verdadero: typeof afirmacion.es_verdadero === "boolean" ? afirmacion.es_verdadero : afirmacion.correcta === true,
  }));
}

export function obtenerPares(valor: unknown): Par[] {
  if (!Array.isArray(valor)) return [];

  return valor.filter(esRegistro).map((par) => ({
    id: typeof par.id === "string" && par.id.trim() ? par.id : crearIdFila("par"),
    izquierda: typeof par.izquierda === "string" ? par.izquierda : "",
    derecha: typeof par.derecha === "string" ? par.derecha : "",
  }));
}

function obtenerTarjetas(valor: unknown): Tarjeta[] {
  if (!Array.isArray(valor)) return [];

  return valor.filter(esRegistro).map((tarjeta, indice) => ({
    id: typeof tarjeta.id === "string" && tarjeta.id.trim() ? tarjeta.id : `tarjeta-${indice + 1}`,
    texto: typeof tarjeta.texto === "string" ? tarjeta.texto : "",
  }));
}

function actualizarFilaTexto(valores: string[], indice: number, texto: string): string[] {
  return valores.map((valor, posicion) => posicion === indice ? texto : valor);
}

function CampoConfiguracion({ label, value, onChange, type = "text", help }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "number"; help?: string }) {
  return <label className="admin-field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} />{help ? <small>{help}</small> : null}</label>;
}

function AreaConfiguracion({ label, value, onChange, help }: { label: string; value: string; onChange: (value: string) => void; help?: string }) {
  return <label className="admin-field admin-field--wide"><span>{label}</span><textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />{help ? <small>{help}</small> : null}</label>;
}

function SubirMedio({ label, icon, accept, disabled, onFile }: { label: string; icon: ReactNode; accept: string; disabled: boolean; onFile: (file: File) => void }) {
  return <label className="admin-media-slot cursor-pointer"><div className="admin-media-slot__preview">{icon}</div><div><strong>{label}</strong><small>El archivo se registra en Medios y su URL queda en la configuración.</small><span className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-violet-600"><Upload size={14} /> {disabled ? "Subiendo..." : "Seleccionar archivo"}</span></div><input className="hidden" type="file" accept={accept} disabled={disabled} onChange={(event) => { const archivo = event.target.files?.[0]; if (archivo) onFile(archivo); }} /></label>;
}

function ListaTextoEditor({ titulo, valores, etiquetaAgregar, onChange }: { titulo: string; valores: string[]; etiquetaAgregar: string; onChange: (valores: string[]) => void }) {
  const filas = valores.length ? valores : [""];

  return <fieldset className="admin-config-builder__group"><legend>{titulo}</legend>{filas.map((valor, indice) => <div className="admin-config-row" key={`${titulo}-${indice}`}><span aria-hidden="true">{indice + 1}</span><input aria-label={`${titulo} ${indice + 1}`} value={valor} onChange={(event) => onChange(actualizarFilaTexto(filas, indice, event.target.value))} /><button type="button" className="admin-icon-button !h-8 !w-8 !text-red-500" aria-label={`Eliminar ${titulo.toLowerCase()} ${indice + 1}`} onClick={() => onChange(filas.filter((_, posicion) => posicion !== indice))}><Trash2 size={14} /></button></div>)}<button type="button" className="admin-secondary-button w-fit" onClick={() => onChange([...filas, ""])}><Plus size={14} /> {etiquetaAgregar}</button></fieldset>;
}

export function ActivityTypeConfigBuilder({ codigo, configuracion, onChange, onUpload, uploading }: ActivityTypeConfigBuilderProps) {
  const actualizar = (clave: string, valor: unknown) => onChange({ ...configuracion, [clave]: valor });
  const actualizarVarias = (valores: ConfiguracionActividad) => onChange({ ...configuracion, ...valores });

  if (!codigo) return <p className="text-xs text-slate-500">Selecciona un tipo para ver sus campos especializados.</p>;
  if (codigo.includes("video")) return <><CampoConfiguracion label="URL del video" value={String(configuracion.video_url ?? "")} onChange={(valor) => actualizar("video_url", valor)} /><SubirMedio label="Subir video" icon={<Video size={18} />} accept="video/*" disabled={uploading} onFile={(archivo) => onUpload(archivo, "video_url", "video")} /></>;
  if (codigo === "cancion") return <CancionBuilder configuracion={configuracion} actualizar={actualizar} onUpload={onUpload} uploading={uploading} />;
  if (codigo.includes("audio")) return <><CampoConfiguracion label="URL del audio" value={String(configuracion.audio_url ?? "")} onChange={(valor) => actualizar("audio_url", valor)} /><SubirMedio label="Subir audio" icon={<FileAudio size={18} />} accept="audio/*" disabled={uploading} onFile={(archivo) => onUpload(archivo, "audio_url", "audio")} /><AreaConfiguracion label="Transcripción" value={String(configuracion.transcripcion ?? "")} onChange={(valor) => actualizar("transcripcion", valor)} /></>;
  if (codigo.includes("completar")) return <><AreaConfiguracion label="Versículo con espacio" value={String(configuracion.frase ?? "")} onChange={(valor) => actualizar("frase", valor)} help="Marca la palabra que falta con dos guiones bajos: __." /><CampoConfiguracion label="Respuesta correcta" value={String(configuracion.respuesta ?? "")} onChange={(valor) => actualizar("respuesta", valor)} /></>;
  if (codigo === "verdadero_falso") return <VerdaderoFalsoBuilder afirmaciones={obtenerAfirmaciones(configuracion.afirmaciones)} onChange={(afirmaciones) => actualizar("afirmaciones", afirmaciones)} />;
  if (codigo === "relacionar_pares") return <ParesBuilder pares={obtenerPares(configuracion.pares)} onChange={(pares) => actualizar("pares", pares)} />;
  if (codigo === "tarjetas_memoria") return <TarjetasBuilder tarjetas={obtenerTarjetas(configuracion.pares)} onChange={(pares) => actualizar("pares", pares)} />;
  if (codigo === "arrastrar_soltar" || codigo.includes("secuencia")) return <ListaTextoEditor titulo="Secuencia correcta" valores={obtenerListaTexto(configuracion.items)} etiquetaAgregar="Agregar paso" onChange={(items) => actualizarVarias({ items, orden_correcto: items.map((_, indice) => indice) })} />;
  if (codigo === "manualidad") return <div className="admin-config-builder__columns"><ListaTextoEditor titulo="Materiales" valores={obtenerListaTexto(configuracion.materiales)} etiquetaAgregar="Agregar material" onChange={(materiales) => actualizar("materiales", materiales)} /><ListaTextoEditor titulo="Pasos" valores={obtenerListaTexto(configuracion.pasos)} etiquetaAgregar="Agregar paso" onChange={(pasos) => actualizar("pasos", pasos)} /></div>;
  if (codigo === "sopa_letras") return <><CampoConfiguracion label="Palabras separadas por coma" value={obtenerListaTexto(configuracion.palabras).join(", ")} onChange={(valor) => actualizar("palabras", valor.split(",").map((palabra) => palabra.trim()).filter(Boolean))} /><CampoConfiguracion label="Filas" value={String(configuracion.filas ?? 12)} type="number" onChange={(valor) => actualizar("filas", Number(valor))} /><CampoConfiguracion label="Columnas" value={String(configuracion.columnas ?? 12)} type="number" onChange={(valor) => actualizar("columnas", Number(valor))} /></>;
  if (codigo === "rompecabezas") return <><CampoConfiguracion label="URL de imagen" value={String(configuracion.imagen ?? "")} onChange={(valor) => actualizar("imagen", valor)} /><SubirMedio label="Subir imagen" icon={<ImageIcon size={18} />} accept="image/*" disabled={uploading} onFile={(archivo) => onUpload(archivo, "imagen", "imagen")} /><CampoConfiguracion label="Filas" value={String(configuracion.filas ?? 3)} type="number" onChange={(valor) => actualizar("filas", Number(valor))} /><CampoConfiguracion label="Columnas" value={String(configuracion.columnas ?? 3)} type="number" onChange={(valor) => actualizar("columnas", Number(valor))} /></>;
  if (codigo === "aventura_decisiones") return <AreaConfiguracion label="Escenas JSON" value={JSON.stringify(configuracion.escenas ?? [], null, 2)} onChange={(valor) => { try { actualizar("escenas", JSON.parse(valor) as unknown); } catch { /* El JSON avanzado conserva el valor previo hasta que sea válido. */ } }} help="Cada escena debe incluir al menos un texto." />;

  return <p className="text-xs leading-6 text-slate-500">Este tipo no requiere campos adicionales. Configura sus opciones de respuesta, si aplica.</p>;
}

function VerdaderoFalsoBuilder({ afirmaciones, onChange }: { afirmaciones: Afirmacion[]; onChange: (afirmaciones: Afirmacion[]) => void }) {
  const filas = afirmaciones.length ? afirmaciones : [{ id: crearIdFila("afirmacion"), texto: "", es_verdadero: true }];
  return <fieldset className="admin-config-builder__group"><legend>Afirmaciones</legend><p>Escribe cada afirmación y marca si es verdadera o falsa.</p>{filas.map((afirmacion, indice) => <div className="admin-config-row admin-config-row--statement" key={afirmacion.id}><input aria-label={`Afirmación ${indice + 1}`} value={afirmacion.texto} onChange={(event) => onChange(filas.map((fila, posicion) => posicion === indice ? { ...fila, texto: event.target.value } : fila))} /><select aria-label={`Valor de la afirmación ${indice + 1}`} value={afirmacion.es_verdadero ? "verdadera" : "falsa"} onChange={(event) => onChange(filas.map((fila, posicion) => posicion === indice ? { ...fila, es_verdadero: event.target.value === "verdadera" } : fila))}><option value="verdadera">Verdadera</option><option value="falsa">Falsa</option></select><button type="button" className="admin-icon-button !h-8 !w-8 !text-red-500" aria-label={`Eliminar afirmación ${indice + 1}`} onClick={() => onChange(filas.filter((_, posicion) => posicion !== indice))}><Trash2 size={14} /></button></div>)}<button type="button" className="admin-secondary-button w-fit" onClick={() => onChange([...filas, { id: crearIdFila("afirmacion"), texto: "", es_verdadero: true }])}><Plus size={14} /> Agregar afirmación</button></fieldset>;
}

function ParesBuilder({ pares, onChange }: { pares: Par[]; onChange: (pares: Par[]) => void }) {
  const filas = pares.length ? pares : [{ id: crearIdFila("par"), izquierda: "", derecha: "" }];
  return <fieldset className="admin-config-builder__group"><legend>Pares para relacionar</legend><p>Conecta cada concepto con su respuesta correspondiente.</p>{filas.map((par, indice) => <div className="admin-config-row admin-config-row--pair" key={par.id}><input aria-label={`Concepto ${indice + 1}`} placeholder="Concepto" value={par.izquierda} onChange={(event) => onChange(filas.map((fila, posicion) => posicion === indice ? { ...fila, izquierda: event.target.value } : fila))} /><input aria-label={`Respuesta ${indice + 1}`} placeholder="Respuesta" value={par.derecha} onChange={(event) => onChange(filas.map((fila, posicion) => posicion === indice ? { ...fila, derecha: event.target.value } : fila))} /><button type="button" className="admin-icon-button !h-8 !w-8 !text-red-500" aria-label={`Eliminar par ${indice + 1}`} onClick={() => onChange(filas.filter((_, posicion) => posicion !== indice))}><Trash2 size={14} /></button></div>)}<button type="button" className="admin-secondary-button w-fit" onClick={() => onChange([...filas, { id: crearIdFila("par"), izquierda: "", derecha: "" }])}><Plus size={14} /> Agregar par</button></fieldset>;
}

function TarjetasBuilder({ tarjetas, onChange }: { tarjetas: Tarjeta[]; onChange: (tarjetas: Tarjeta[]) => void }) {
  const filas = tarjetas.length ? tarjetas : [{ id: "tarjeta-1", texto: "" }];
  return <fieldset className="admin-config-builder__group"><legend>Tarjetas de memoria</legend><p>Cada tarjeta debe tener un identificador y el texto que verá el estudiante.</p>{filas.map((tarjeta, indice) => <div className="admin-config-row admin-config-row--pair" key={tarjeta.id}><input aria-label={`Identificador de tarjeta ${indice + 1}`} value={tarjeta.id} onChange={(event) => onChange(filas.map((fila, posicion) => posicion === indice ? { ...fila, id: event.target.value } : fila))} /><input aria-label={`Texto de tarjeta ${indice + 1}`} value={tarjeta.texto} onChange={(event) => onChange(filas.map((fila, posicion) => posicion === indice ? { ...fila, texto: event.target.value } : fila))} /><button type="button" className="admin-icon-button !h-8 !w-8 !text-red-500" aria-label={`Eliminar tarjeta ${indice + 1}`} onClick={() => onChange(filas.filter((_, posicion) => posicion !== indice))}><Trash2 size={14} /></button></div>)}<button type="button" className="admin-secondary-button w-fit" onClick={() => onChange([...filas, { id: `tarjeta-${filas.length + 1}`, texto: "" }])}><Plus size={14} /> Agregar tarjeta</button></fieldset>;
}

function CancionBuilder({ configuracion, actualizar, onUpload, uploading }: { configuracion: ConfiguracionActividad; actualizar: (clave: string, valor: unknown) => void; onUpload: ActivityTypeConfigBuilderProps["onUpload"]; uploading: boolean }) {
  return <div className="admin-config-builder__columns"><CampoConfiguracion label="URL del audio" value={String(configuracion.cancion_url ?? configuracion.audio_url ?? "")} onChange={(valor) => actualizar("cancion_url", valor)} /><SubirMedio label="Subir audio" icon={<FileAudio size={18} />} accept="audio/*" disabled={uploading} onFile={(archivo) => onUpload(archivo, "cancion_url", "audio")} /><ListaTextoEditor titulo="Letra" valores={obtenerListaTexto(configuracion.letra)} etiquetaAgregar="Agregar línea" onChange={(letra) => actualizar("letra", letra)} /><ListaTextoEditor titulo="Acciones" valores={obtenerListaTexto(configuracion.acciones)} etiquetaAgregar="Agregar acción" onChange={(acciones) => actualizar("acciones", acciones)} /></div>;
}

import { useRef, type ReactNode } from "react";
import {
  Check,
  FileAudio,
  Image,
  Loader,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import type { RecursoMultimedia } from "../../media/media.api";
import type { ReflectionQuestion } from "../hooks/use-theme-crecer-page";
import { EditorMarkdown } from "./editor-markdown";

interface CrecerStepInfo { id: string; codigo: string; nombre: string; }
interface AgeGroupInfo { id: string; nombre?: string | null; }

interface CrecerContentEditorProps {
  activeStep: CrecerStepInfo | undefined;
  selectedAgeGroup: AgeGroupInfo | null;
  title: string;
  body: string;
  shortInstruction: string;
  resourceId: string | null;
  audioResourceId: string | null;
  resources: RecursoMultimedia[];
  questions: ReflectionQuestion[];
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onShortInstructionChange: (value: string) => void;
  onResourceChange: (value: string | null) => void;
  onAudioResourceChange: (value: string | null) => void;
  onQuestionsChange: (questions: ReflectionQuestion[]) => void;
  onUpload: (file: File, type: "imagen" | "audio" | "video") => void;
  onSave: () => void;
  isPending: boolean;
  isUploading: boolean;
  isSuccess: boolean;
}

export function CrecerContentEditor(props: CrecerContentEditorProps) {
  const imageInput = useRef<HTMLInputElement | null>(null);
  const audioInput = useRef<HTMLInputElement | null>(null);
  const visualResources = props.resources.filter((resource) => resource.tipo === "imagen" || resource.tipo === "video");
  const audioResources = props.resources.filter((resource) => resource.tipo === "audio");
  const selectedVisual = props.resources.find((resource) => resource.id === props.resourceId) ?? null;
  const selectedAudio = props.resources.find((resource) => resource.id === props.audioResourceId) ?? null;

  return (
    <section className="admin-editor-section">
      <div className="admin-editor-section__header">
        <div><h2>{props.activeStep?.nombre ?? "Paso CRECER"}</h2><p>Versión para {props.selectedAgeGroup?.nombre ?? "la franja seleccionada"}. El contenido, medios y preguntas se guardan juntos.</p></div>
        {props.isSuccess ? <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><Check size={15} /> Guardado</span> : null}
      </div>

      <div className="admin-form-grid">
        <Field label="Título del bloque" help="Idea central del paso."><input value={props.title} maxLength={120} onChange={(event) => props.onTitleChange(event.target.value)} placeholder={props.activeStep?.nombre ?? "Título"} /></Field>
        <Field label="Instrucción corta" help="Una frase para comenzar."><input value={props.shortInstruction} maxLength={240} onChange={(event) => props.onShortInstructionChange(event.target.value)} placeholder="Ejemplo: Escucha y piensa..." /></Field>

        <Field label="Contenido principal" wide help="Admite texto con formato simple. Mantén párrafos cortos para lectura en web y móvil.">
          <EditorMarkdown markdown={props.body} onChange={props.onBodyChange} />
        </Field>

        <Field label="Recurso visual" help="Imagen o video que acompaña este paso.">
          <MediaSlot icon={<Image size={20} />} resource={selectedVisual} emptyText="Sin imagen o video" onUpload={() => imageInput.current?.click()} onRemove={() => props.onResourceChange(null)} />
          <input ref={imageInput} type="file" className="hidden" accept="image/*,video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) props.onUpload(file, file.type.startsWith("video/") ? "video" : "imagen"); }} />
          <select value={props.resourceId ?? ""} onChange={(event) => props.onResourceChange(event.target.value || null)}><option value="">Seleccionar desde Medios</option>{visualResources.map((resource) => <option key={resource.id} value={resource.id}>{resource.titulo}</option>)}</select>
        </Field>

        <Field label="Narración o audio" help="Audio opcional para accesibilidad y niños que todavía no leen.">
          <MediaSlot icon={<FileAudio size={20} />} resource={selectedAudio} emptyText="Sin audio" onUpload={() => audioInput.current?.click()} onRemove={() => props.onAudioResourceChange(null)} />
          <input ref={audioInput} type="file" className="hidden" accept="audio/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) props.onUpload(file, "audio"); }} />
          <select value={props.audioResourceId ?? ""} onChange={(event) => props.onAudioResourceChange(event.target.value || null)}><option value="">Seleccionar desde Medios</option>{audioResources.map((resource) => <option key={resource.id} value={resource.id}>{resource.titulo}</option>)}</select>
        </Field>

        <Field label="Preguntas de reflexión" wide help="Se muestran al finalizar el bloque y se adaptan a la franja actual.">
          <div className="admin-question-list">
            {props.questions.map((question, index) => (
              <div key={`${question.orden}-${index}`} className="admin-question-row">
                <span>{index + 1}</span>
                <input value={question.pregunta} onChange={(event) => props.onQuestionsChange(props.questions.map((item, itemIndex) => itemIndex === index ? { ...item, pregunta: event.target.value } : item))} placeholder="Escribe una pregunta abierta..." />
                <button type="button" aria-label="Eliminar pregunta" onClick={() => props.onQuestionsChange(props.questions.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, orden: itemIndex + 1 })))}><Trash2 size={15} /></button>
              </div>
            ))}
            <button type="button" className="admin-secondary-button w-fit" onClick={() => props.onQuestionsChange([...props.questions, { pregunta: "", orden: props.questions.length + 1 }])}><Plus size={15} /> Agregar pregunta</button>
          </div>
        </Field>
      </div>

      <div className="admin-save-bar mt-5">
        <p>{props.isUploading ? "Subiendo recurso multimedia..." : "Los cambios no se publican automáticamente; primero se guardan en este paso."}</p>
        <button type="button" onClick={props.onSave} disabled={props.isPending || props.isUploading} className="admin-primary-button">
          {props.isPending ? <Loader className="animate-spin" size={17} /> : <Save size={17} />}
          {props.isPending ? "Guardando..." : "Guardar paso"}
        </button>
      </div>
    </section>
  );
}

function Field({ label, help, wide, children }: { label: string; help: string; wide?: boolean; children: ReactNode }) { return <div className={`admin-field ${wide ? "admin-field--wide" : ""}`}><span>{label}</span>{children}<small>{help}</small></div>; }
function MediaSlot({ icon, resource, emptyText, onUpload, onRemove }: { icon: ReactNode; resource: RecursoMultimedia | null; emptyText: string; onUpload: () => void; onRemove: () => void }) {
  return <div className="admin-media-slot"><div className="admin-media-slot__preview">{resource?.tipo === "imagen" ? <img src={resource.url_publica} alt="" /> : icon}</div><div className="min-w-0 flex-1"><strong className="truncate">{resource?.titulo ?? emptyText}</strong><small>{resource ? `${resource.tipo} · ${formatBytes(resource.tamano_bytes)}` : "Sube un archivo o selecciónalo desde el módulo de medios."}</small><div className="flex gap-3"><button type="button" onClick={onUpload}><Upload size={13} className="inline" /> Subir</button>{resource ? <button type="button" onClick={onRemove} className="!text-red-600">Quitar</button> : null}</div></div></div>;
}
function formatBytes(bytes: number) { if (!bytes) return "0 KB"; const units = ["B", "KB", "MB", "GB"]; const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1); return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`; }

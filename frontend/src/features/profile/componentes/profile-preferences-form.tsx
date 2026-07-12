import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Headphones, LoaderCircle, Save, Type } from "lucide-react";
import type { Perfil } from "@/shared/api/api";
import type { ActualizarPerfilDatos } from "../profile.api";

interface ProfilePreferencesFormProps {
  perfil: Perfil;
  isSaving: boolean;
  onSave: (data: ActualizarPerfilDatos) => void;
  onCancel: () => void;
}

const textSizes = [
  { value: "pequeno", label: "Pequeño", example: "Aa" },
  { value: "mediano", label: "Mediano", example: "Aa" },
  { value: "grande", label: "Grande", example: "Aa" },
] as const;

function normalizarTamano(value?: string | null) {
  if (value === "pequeno" || value === "pequeño") return "pequeno";
  if (value === "grande") return "grande";
  return "mediano";
}

export function ProfilePreferencesForm({
  perfil,
  isSaving,
  onSave,
  onCancel,
}: ProfilePreferencesFormProps) {
  const [audio, setAudio] = useState(Boolean(perfil.prefiere_audio));
  const [textSize, setTextSize] = useState(normalizarTamano(perfil.tamano_texto_preferido));

  useEffect(() => {
    setAudio(Boolean(perfil.prefiere_audio));
    setTextSize(normalizarTamano(perfil.tamano_texto_preferido));
  }, [perfil.prefiere_audio, perfil.tamano_texto_preferido]);

  const hasChanges = useMemo(
    () =>
      audio !== Boolean(perfil.prefiere_audio) ||
      textSize !== normalizarTamano(perfil.tamano_texto_preferido),
    [audio, perfil.prefiere_audio, perfil.tamano_texto_preferido, textSize],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasChanges) return;
    onSave({ prefiere_audio: audio, tamano_texto_preferido: textSize });
  }

  return (
    <form className="profile-form-card" onSubmit={handleSubmit}>
      <div className="profile-form-card__heading">
        <div>
          <p className="profile-eyebrow">Aprendizaje</p>
          <h1>Preferencias</h1>
          <p>Ajusta la experiencia para que sea más cómoda al leer, escuchar y aprender.</p>
        </div>
        <span className="profile-form-card__heading-icon" aria-hidden="true">
          <Type size={25} />
        </span>
      </div>

      <section className="profile-setting-row">
        <span className="profile-setting-row__icon is-green" aria-hidden="true">
          <Headphones size={22} />
        </span>
        <div className="profile-setting-row__copy">
          <h2>Audio de apoyo</h2>
          <p>Permite narraciones, sonidos y ayudas auditivas dentro de las actividades.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={audio}
          className={`profile-switch ${audio ? "is-on" : ""}`}
          onClick={() => setAudio((current) => !current)}
        >
          <span aria-hidden="true" />
          <span className="sr-only">{audio ? "Desactivar audio" : "Activar audio"}</span>
        </button>
      </section>

      <section className="profile-text-setting">
        <div className="profile-text-setting__heading">
          <span className="profile-setting-row__icon is-purple" aria-hidden="true">
            <Type size={22} />
          </span>
          <div>
            <h2>Tamaño del texto</h2>
            <p>La preferencia se aplica a las pantallas de la aplicación.</p>
          </div>
        </div>

        <div className="profile-text-size-options" role="radiogroup" aria-label="Tamaño del texto">
          {textSizes.map((option) => {
            const selected = textSize === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`profile-text-size-option is-${option.value} ${selected ? "is-selected" : ""}`}
                onClick={() => setTextSize(option.value)}
              >
                <span aria-hidden="true">{option.example}</span>
                <strong>{option.label}</strong>
              </button>
            );
          })}
        </div>

        <div className={`profile-text-preview is-${textSize}`} aria-live="polite">
          <strong>Vista previa</strong>
          <p>Aprender la Palabra de Dios puede ser una aventura clara, alegre y fácil de seguir.</p>
        </div>
      </section>

      <div className="profile-form-actions">
        <button type="button" className="profile-secondary-button" onClick={onCancel} disabled={isSaving}>
          <ArrowLeft size={18} aria-hidden="true" />
          Volver
        </button>
        <button type="submit" className="profile-primary-button" disabled={!hasChanges || isSaving}>
          {isSaving ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? "Guardando..." : hasChanges ? "Guardar preferencias" : "Sin cambios"}
        </button>
      </div>
    </form>
  );
}

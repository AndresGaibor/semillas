import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Circle,
  Eye,
  Image as ImageIcon,
  Layers3,
  Loader2,
  Volume2,
} from "lucide-react";

import { useThemeCrecerPage } from "../features/admin/hooks/use-theme-crecer-page";
import { AgeGroupSelector } from "../features/admin/componentes/age-group-selector";
import { CrecerStepSelector } from "../features/admin/componentes/crecer-step-selector";
import { CrecerContentEditor } from "../features/admin/componentes/crecer-content-editor";

export const Route = createFileRoute("/admin/temas/$themeId/crecer")({ component: AdminThemeCrecerPage });

function AdminThemeCrecerPage() {
  const { themeId } = Route.useParams();
  const editor = useThemeCrecerPage({ themeId });

  if (editor.themeQuery.isLoading) return <div className="admin-dashboard-state"><span><Loader2 className="animate-spin" /></span><h2>Cargando Editor CRECER</h2><p>Preparando franjas, pasos y recursos multimedia.</p></div>;
  if (!editor.theme) return <div className="admin-dashboard-state"><span><Layers3 /></span><h2>Tema no encontrado</h2><p>No fue posible abrir el editor.</p></div>;

  return (
    <div className="admin-theme-studio">
      <header className="admin-theme-library__hero">
        <div className="flex items-center gap-4">
          <button type="button" className="admin-icon-button" onClick={editor.handleBack}><ArrowLeft size={19} /></button>
          <div><span className="admin-eyebrow">Editor pedagógico</span><h2 className="!text-2xl">Recorrido CRECER</h2><p>{editor.theme.titulo} · contenido específico por cada franja etaria.</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-[#0d1f17] px-5 py-3"><div><span className="text-[10px] font-black uppercase tracking-[.12em] text-emerald-400/50">Progreso de la franja</span><strong className="mt-1 block text-xl font-black text-emerald-50">{editor.pasosCompletos}/{editor.totalPasos} pasos</strong></div><span className="text-2xl font-black text-emerald-600">{editor.progreso}%</span></div>
      </header>

      <section className="admin-editor-section">
        <div className="admin-editor-section__header"><div><h2>1. Selecciona el público</h2><p>Cada franja tiene una versión independiente de los seis momentos.</p></div></div>
        {editor.ageGroupsQuery.data ? <AgeGroupSelector ageGroups={editor.ageGroupsQuery.data.filter((group) => !editor.theme?.grupos_edad?.length || editor.theme.grupos_edad.some((available) => available.id === group.id))} selectedAgeGroupId={editor.selectedAgeGroupId} onSelect={editor.setSelectedAgeGroupId} /> : null}
      </section>

      <section className="admin-editor-section">
        <div className="admin-editor-section__header"><div><h2>2. Elige el momento CRECER</h2><p>Los indicadores muestran cuáles ya tienen contenido para la franja seleccionada.</p></div></div>
        <CrecerStepSelector pasos={editor.pasos} activeStepCode={editor.activeStepCode} selectedAgeGroupId={editor.selectedAgeGroupId} stepsData={editor.stepsQuery.data} onSelect={editor.setActiveStepCode} />
      </section>

      <div className="admin-editor-shell">
        <main className="admin-editor-main">
          <CrecerContentEditor
            activeStep={editor.activeStep}
            selectedAgeGroup={editor.selectedAgeGroup}
            title={editor.title}
            body={editor.body}
            shortInstruction={editor.shortInstruction}
            resourceId={editor.resourceId}
            audioResourceId={editor.audioResourceId}
            resources={editor.media}
            questions={editor.questions}
            onTitleChange={editor.setTitle}
            onBodyChange={editor.setBody}
            onShortInstructionChange={editor.setShortInstruction}
            onResourceChange={editor.setResourceId}
            onAudioResourceChange={editor.setAudioResourceId}
            onQuestionsChange={editor.setQuestions}
            onUpload={(file, type) => editor.uploadMutation.mutate({ file, type })}
            onSave={() => editor.saveMutation.mutate()}
            isPending={editor.saveMutation.isPending}
            isUploading={editor.uploadMutation.isPending}
            isSuccess={editor.saveMutation.isSuccess}
          />
        </main>

        <aside className="admin-editor-aside">
          <section className="admin-editor-section">
            <div className="admin-editor-section__header"><div><h2>Vista rápida</h2><p>Resumen de lo que verá el estudiante.</p></div><Eye size={18} className="text-violet-600" /></div>
            <div className="rounded-3xl bg-[#0d1f17] p-4">
              {editor.selectedResource?.tipo === "imagen" ? <img src={editor.selectedResource.url_publica} alt="" className="mb-4 aspect-video w-full rounded-2xl object-cover" /> : <div className="mb-4 grid aspect-video place-items-center rounded-2xl bg-[#1a3a2a] text-emerald-400/50"><ImageIcon /></div>}
              <span className="admin-eyebrow">{editor.activeStep?.nombre ?? "Paso"}</span>
              <h3 className="mt-2 text-xl font-black text-emerald-50">{editor.title || "Título pendiente"}</h3>
              <p className="mt-3 line-clamp-6 whitespace-pre-line text-sm leading-7 text-emerald-200/70">{editor.body || "Escribe el contenido para ver una previsualización."}</p>
              {editor.selectedAudio ? <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs font-bold text-blue-700"><Volume2 size={16} /> Incluye narración de audio</div> : null}
            </div>
          </section>

          <section className="admin-editor-section">
            <h2 className="font-black text-emerald-50">Cobertura de la franja</h2>
            <div className="admin-completeness-list mt-4">{editor.pasos.map((step) => { const ready = editor.stepsQuery.data?.some((record) => record.tipo_paso?.codigo === step.codigo && record.contenidos.some((content) => content.grupo_edad_id === editor.selectedAgeGroupId && content.titulo.trim() && content.cuerpo.trim())); return <div key={step.codigo} className={`admin-completeness-item ${ready ? "admin-completeness-item--complete" : ""}`}><span>{step.nombre}</span>{ready ? <Check size={15} /> : <Circle size={14} />}</div>; })}</div>
          </section>
        </aside>
      </div>
    </div>
  );
}

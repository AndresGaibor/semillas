import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { obtenerPasosAdmin, guardarParlante } from "../features/admin/admin.api";
import { obtenerGruposEdad, obtenerPasosCrecer } from "../features/catalog/catalog.api";
import { ArrowLeft, Loader, Save, Check, Circle } from "lucide-react";

export const Route = createFileRoute("/admin/temas/$themeId/crecer")({
  component: AdminThemeCrecerPage
});

function AdminThemeCrecerPage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeStepCode, setActiveStepCode] = useState("conectar");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [shortInstruction, setShortInstruction] = useState("");

  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => obtenerPasosAdmin(themeId)
  });

  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });
  const crecerStepsQuery = useQuery({ queryKey: ["catalog", "crecer-steps"], queryFn: obtenerPasosCrecer });

  const existingContent = stepsQuery.data
    ?.find((s) => s.tipo_paso?.codigo === activeStepCode)
    ?.contenidos?.find((c) => c.grupo_edad_id === selectedAgeGroupId);

  useEffect(() => {
    if (existingContent) {
      setTitle(existingContent.titulo ?? "");
      setBody(existingContent.cuerpo);
      setShortInstruction(existingContent.instruccion_corta ?? "");
    } else {
      setTitle("");
      setBody("");
      setShortInstruction("");
    }
  }, [existingContent, activeStepCode, selectedAgeGroupId]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const stepType = crecerStepsQuery.data?.find((s) => s.codigo === activeStepCode);
      if (!stepType || !selectedAgeGroupId) throw new Error("Faltan datos");
      return guardarParlante(themeId, {
        tipo_paso_id: stepType.id,
        grupo_edad_id: selectedAgeGroupId,
        titulo: title || stepType.nombre,
        cuerpo: body || "Contenido pendiente...",
        instruccion_corta: shortInstruction || undefined
      });
    },
    onSuccess: () => stepsQuery.refetch()
  });

  const activeStep = crecerStepsQuery.data?.find((s) => s.codigo === activeStepCode);
  const hasContentForStep = (codigo: string) =>
    selectedAgeGroupId
      ? stepsQuery.data?.some((s) =>
          s.tipo_paso?.codigo === codigo &&
          s.contenidos?.some((c) => c.grupo_edad_id === selectedAgeGroupId && c.cuerpo && c.cuerpo !== "Contenido pendiente...")
        )
      : false;

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-6">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="mb-4">
        <label className="text-sm font-medium text-[#123b2c] mb-1 block">Franja de edad</label>
        <select
          value={selectedAgeGroupId}
          onChange={(e) => setSelectedAgeGroupId(e.target.value)}
          className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm"
        >
          <option value="">Seleccionar franja</option>
          {ageGroupsQuery.data?.map((ag) => (
            <option key={ag.id} value={ag.id}>{ag.nombre}</option>
          ))}
        </select>
      </div>

      {selectedAgeGroupId && (
        <>
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {crecerStepsQuery.data?.map((step) => (
              <button
                key={step.codigo}
                onClick={() => setActiveStepCode(step.codigo)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: activeStepCode === step.codigo ? (step.color_hex ?? "#2e9e5b") : "#e5e7eb",
                  color: activeStepCode === step.codigo ? "white" : "#666"
                }}
              >
                <span className="flex items-center gap-1.5">
                  {hasContentForStep(step.codigo)
                    ? <Check size={14} className="shrink-0" />
                    : <Circle size={14} className="shrink-0 opacity-40" />
                  }
                  {step.nombre}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm grid gap-4 max-w-2xl">
            <div>
              <label className="text-sm font-medium text-[#123b2c] mb-1 block">Título</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm" placeholder={activeStep?.nombre ?? ""} />
            </div>

            <div>
              <label className="text-sm font-medium text-[#123b2c] mb-1 block">Contenido (Markdown)</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm font-mono" placeholder="Escribe el contenido aquí..." />
            </div>

            <div>
              <label className="text-sm font-medium text-[#123b2c] mb-1 block">Instrucción corta</label>
              <input value={shortInstruction} onChange={(e) => setShortInstruction(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm" placeholder="Breve instrucción para el niño" />
            </div>

              <button
              onClick={() => saveMutation.mutate()}
              className="bg-[#2e9e5b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saveMutation.isPending ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {saveMutation.isPending ? "Guardando..." : `Guardar ${activeStep?.nombre ?? ""}`}
            </button>

            {saveMutation.isSuccess && (
              <p className="text-[#2e9e5b] text-sm flex items-center gap-1"><Check size={16} /> Guardado</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

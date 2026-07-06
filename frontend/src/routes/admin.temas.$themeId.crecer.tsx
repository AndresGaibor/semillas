import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getAdminThemeSteps, upsertThemeStep } from "../features/admin/admin.api";
import { getAgeGroups, getCrecerSteps } from "../features/catalog/catalog.api";
import { ArrowLeft, Loader, Save, Check } from "lucide-react";

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
    queryFn: () => getAdminThemeSteps(themeId)
  });

  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: getAgeGroups });
  const crecerStepsQuery = useQuery({ queryKey: ["catalog", "crecer-steps"], queryFn: getCrecerSteps });

  const existingContent = stepsQuery.data
    ?.find((s) => s.step_type.code === activeStepCode)
    ?.contents?.find((c) => c.age_group_id === selectedAgeGroupId);

  useEffect(() => {
    if (existingContent) {
      setTitle(existingContent.title ?? "");
      setBody(existingContent.body);
      setShortInstruction(existingContent.short_instruction ?? "");
    } else {
      setTitle("");
      setBody("");
      setShortInstruction("");
    }
  }, [existingContent, activeStepCode, selectedAgeGroupId]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const stepType = crecerStepsQuery.data?.find((s) => s.code === activeStepCode);
      if (!stepType || !selectedAgeGroupId) throw new Error("Faltan datos");
      return upsertThemeStep(themeId, {
        stepTypeId: stepType.id,
        ageGroupId: selectedAgeGroupId,
        title: title || stepType.name,
        body: body || "Contenido pendiente...",
        shortInstruction: shortInstruction || undefined
      });
    },
    onSuccess: () => stepsQuery.refetch()
  });

  const activeStep = crecerStepsQuery.data?.find((s) => s.code === activeStepCode);
  const hasContent = stepsQuery.data?.some((s) => s.step_type.code === activeStepCode);

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <h1 className="text-2xl font-bold text-[#123b2c] mb-4">Editor CRECER</h1>

      <div className="mb-4">
        <label className="text-sm font-medium text-[#123b2c] mb-1 block">Franja de edad</label>
        <select
          value={selectedAgeGroupId}
          onChange={(e) => setSelectedAgeGroupId(e.target.value)}
          className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm"
        >
          <option value="">Seleccionar franja</option>
          {ageGroupsQuery.data?.map((ag) => (
            <option key={ag.id} value={ag.id}>{ag.name}</option>
          ))}
        </select>
      </div>

      {selectedAgeGroupId && (
        <>
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {crecerStepsQuery.data?.map((step) => (
              <button
                key={step.code}
                onClick={() => setActiveStepCode(step.code)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: activeStepCode === step.code ? (step.color_hex ?? "#2e9e5b") : "#e5e7eb",
                  color: activeStepCode === step.code ? "white" : "#666"
                }}
              >
                {step.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm grid gap-4 max-w-2xl">
            <div>
              <label className="text-sm font-medium text-[#123b2c] mb-1 block">Título</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm" placeholder={activeStep?.name ?? ""} />
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
              {saveMutation.isPending ? "Guardando..." : `Guardar ${activeStep?.name ?? ""}`}
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

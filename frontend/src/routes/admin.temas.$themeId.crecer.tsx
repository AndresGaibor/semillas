import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminThemeSteps, upsertThemeStep } from "../features/admin/admin.api";
import { getAgeGroups, getCrecerSteps } from "../features/catalog/catalog.api";

export const Route = createFileRoute("/admin/temas/$themeId/crecer")({
  component: AdminThemeCrecerPage
});

function AdminThemeCrecerPage() {
  const { themeId } = Route.useParams();
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState<string>("");
  const [activeStepCode, setActiveStepCode] = useState<string>("conectar");

  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => getAdminThemeSteps(themeId)
  });

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: getAgeGroups
  });

  const crecerStepsQuery = useQuery({
    queryKey: ["catalog", "crecer-steps"],
    queryFn: getCrecerSteps
  });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [shortInstruction, setShortInstruction] = useState("");

  const saveMutation = useMutation({
    mutationFn: () => {
      const stepType = crecerStepsQuery.data?.find((s) => s.code === activeStepCode);
      if (!stepType || !selectedAgeGroupId) throw new Error("Faltan datos");
      return upsertThemeStep(themeId, {
        stepTypeId: stepType.id,
        ageGroupId: selectedAgeGroupId,
        title,
        body,
        shortInstruction
      });
    },
    onSuccess: () => {
      stepsQuery.refetch();
    }
  });

  const activeStep = crecerStepsQuery.data?.find((s) => s.code === activeStepCode);
  const existingContent = stepsQuery.data
    ?.find((s) => s.step_type.code === activeStepCode)
    ?.contents?.find((c) => c.age_group_id === selectedAgeGroupId);

  function loadContent() {
    if (existingContent) {
      setTitle(existingContent.title ?? "");
      setBody(existingContent.body);
      setShortInstruction(existingContent.short_instruction ?? "");
    } else {
      setTitle("");
      setBody("");
      setShortInstruction("");
    }
  }

  return (
    <main>
      <h1>Editor CRECER</h1>

      <div style={{ marginBottom: 16 }}>
        <select
          value={selectedAgeGroupId}
          onChange={(e) => {
            setSelectedAgeGroupId(e.target.value);
            setTimeout(loadContent, 0);
          }}
          style={{ padding: 8, borderRadius: 8 }}
        >
          <option value="">Selecciona franja</option>
          {ageGroupsQuery.data?.map((ag) => (
            <option key={ag.id} value={ag.id}>{ag.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {crecerStepsQuery.data?.map((step) => (
          <button
            key={step.code}
            onClick={() => {
              setActiveStepCode(step.code);
              setTimeout(loadContent, 0);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: activeStepCode === step.code ? `2px solid ${step.color_hex ?? "#666"}` : "1px solid #ccc",
              background: activeStepCode === step.code ? (step.color_hex ?? "#eee") : "white",
              color: activeStepCode === step.code ? "white" : "#333",
              cursor: "pointer",
              fontWeight: activeStepCode === step.code ? "bold" : "normal"
            }}
          >
            {step.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <label>
          <strong>Título</strong>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          <strong>Cuerpo (Markdown)</strong>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", fontFamily: "monospace" }}
          />
        </label>

        <label>
          <strong>Instrucción corta</strong>
          <input
            value={shortInstruction}
            onChange={(e) => setShortInstruction(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>

        <button
          onClick={() => saveMutation.mutate()}
          disabled={!selectedAgeGroupId || !activeStep}
          style={{
            padding: "10px 20px",
            background: selectedAgeGroupId && activeStep ? "#2E9E5B" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: selectedAgeGroupId && activeStep ? "pointer" : "not-allowed"
          }}
        >
          {saveMutation.isPending ? "Guardando..." : `Guardar ${activeStep?.name ?? ""}`}
        </button>

        {saveMutation.isSuccess && <p style={{ color: "#2E9E5B" }}>¡Guardado!</p>}
        {saveMutation.isError && <p style={{ color: "#EE6C4D" }}>Error al guardar.</p>}
      </div>
    </main>
  );
}

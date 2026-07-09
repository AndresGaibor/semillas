import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { crearTema, type CrearTemaSolicitud } from "../features/admin/admin.api";
import { obtenerGruposEdad, obtenerVersionesBiblicas } from "../features/catalog/catalog.api";
import { obtenerSendas } from "../features/sendas/sendas.api";
import { useState, useMemo } from "react";
import { Loader } from "lucide-react";

import { AdminTemasNewHeader } from "../features/admin/componentes/admin-temas-new-header";
import { PasoInformacionGeneral } from "../features/admin/componentes/paso-informacion-general";
import { PasoPreview } from "../features/admin/componentes/paso-preview";
import { FormNavigation } from "../features/admin/componentes/form-navigation";

export const Route = createFileRoute("/admin/temas/new")({
  component: NewThemePage
});

function NewThemePage() {
  const navigate = useNavigate();

  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: obtenerSendas });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });
  const bibleVersionsQuery = useQuery({ queryKey: ["catalog", "bible-versions"], queryFn: obtenerVersionesBiblicas });

  if (sendasQuery.isLoading || ageGroupsQuery.isLoading || bibleVersionsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-primario" size={24} />
        <span className="text-sm text-neutro ml-2">Cargando datos del catálogo...</span>
      </div>
    );
  }

  const { register, handleSubmit, control } = useForm<CrearTemaSolicitud>({
    defaultValues: {
      titulo: "",
      slug: "",
      senda_id: "",
      grupo_edad_ids: [],
      version_biblica_id: "",
      objetivo: "",
      resumen: "",
      minutos_estimados: 40,
      xp_recompensa: 100
    }
  });

  const liveTitle = useWatch({ control, name: "titulo" }) || "Título del tema";
  const liveResumen = useWatch({ control, name: "resumen" }) || "Resumen breve del tema que ayudará a los niños a crecer en su fe.";
  const liveDuration = useWatch({ control, name: "minutos_estimados" }) || 40;
  const liveXp = useWatch({ control, name: "xp_recompensa" }) || 100;
  const liveVersionId = useWatch({ control, name: "version_biblica_id" });

  const activeVersion = useMemo(() => {
    if (!liveVersionId) return "RVR1960";
    const found = bibleVersionsQuery.data?.find(v => v.id === liveVersionId);
    return found?.codigo ?? "RVR1960";
  }, [liveVersionId, bibleVersionsQuery.data]);

  const [tagsInput, setTagsInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagsInput.trim()) {
      e.preventDefault();
      if (!tagsList.includes(tagsInput.trim())) {
        setTagsList([...tagsList, tagsInput.trim()]);
      }
      setTagsInput("");
    }
  };

  const removeTag = (idx: number) => {
    setTagsList(tagsList.filter((_, i) => i !== idx));
  };

  const [clubVisibilities, setClubVisibilities] = useState({
    todos: false,
    semillitas: true,
    guardianes: true,
    corazones: true,
    jovenes: false
  });

  const checkedClubsCount = useMemo(() => {
    let count = 0;
    if (clubVisibilities.todos) return 4;
    if (clubVisibilities.semillitas) count++;
    if (clubVisibilities.guardianes) count++;
    if (clubVisibilities.corazones) count++;
    if (clubVisibilities.jovenes) count++;
    return count;
  }, [clubVisibilities]);

  const createMutation = useMutation({
    mutationFn: crearTema,
    onSuccess: () => navigate({ to: "/admin/temas" })
  });

  const onSubmitForm = (values: CrearTemaSolicitud) => {
    createMutation.mutate({
      ...values,
      minutos_estimados: Number(values.minutos_estimados),
      xp_recompensa: Number(values.xp_recompensa)
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <AdminTemasNewHeader onBack={() => navigate({ to: "/admin/temas" })} />

      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 gap-6 lg:grid-cols-4 select-none">

        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <PasoInformacionGeneral
            register={register}
            sendas={sendasQuery.data}
            gruposEdad={ageGroupsQuery.data}
            bibleVersions={bibleVersionsQuery.data}
            liveTitle={liveTitle}
            tagsInput={tagsInput}
            onTagsInputChange={setTagsInput}
            tagsList={tagsList}
            onAddTag={handleAddTag}
            onRemoveTag={removeTag}
            clubVisibilities={clubVisibilities}
            onClubVisibilitiesChange={setClubVisibilities}
          />
        </div>

        <div className="flex flex-col gap-6">
          <PasoPreview
            liveTitle={liveTitle}
            liveResumen={liveResumen}
            liveDuration={liveDuration}
            liveXp={liveXp}
            activeVersion={activeVersion}
            clubVisibilities={clubVisibilities}
            checkedClubsCount={checkedClubsCount}
          />
          <FormNavigation
            isPending={createMutation.isPending}
            onSaveDraft={() => console.log("Guardar borrador clicked")}
          />
        </div>

      </form>
    </div>
  );
}

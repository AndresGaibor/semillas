export const getSendaColorClasses = (sendaName: string) => {
  const name = sendaName.toLowerCase();
  if (name.includes("padre") || name.includes("amor") || name.includes("confío")) {
    return { bg: "bg-[#3d8bd4]/10", text: "text-[#3d8bd4]", icon: "fa-heart" };
  }
  if (name.includes("hijo") || name.includes("jesús") || name.includes("salvador")) {
    return { bg: "bg-[#e9a23b]/10", text: "text-[#e9a23b]", icon: "fa-cross" };
  }
  if (name.includes("espíritu") || name.includes("sanas") || name.includes("prójimo")) {
    return { bg: "bg-[#17a398]/10", text: "text-[#17a398]", icon: "fa-leaf" };
  }
  return { bg: "bg-slate-100", text: "text-slate-500", icon: "fa-star" };
};

export const getActivityTypeInfo = (codigo: string) => {
  switch (codigo.toLowerCase()) {
    case "quiz":
    case "cuestionario":
      return { icon: "fa-circle-question", color: "text-purple-600", bg: "bg-purple-100" };
    case "flashcard":
    case "tarjetas":
      return { icon: "fa-book-open", color: "text-amber-500", bg: "bg-amber-100" };
    case "completar":
    case "completar-versiculo":
      return { icon: "fa-pen-clip", color: "text-blue-500", bg: "bg-blue-100" };
    case "verdadero-falso":
      return { icon: "fa-circle-check", color: "text-emerald-500", bg: "bg-emerald-100" };
    case "sopa":
    case "sopa-letras":
      return { icon: "fa-border-all", color: "text-violet-600", bg: "bg-violet-100" };
    case "ordenar":
    case "ordenar-versiculo":
      return { icon: "fa-puzzle-piece", color: "text-orange-500", bg: "bg-orange-100" };
    case "memoria":
      return { icon: "fa-image", color: "text-sky-500", bg: "bg-sky-100" };
    default:
      return { icon: "fa-star", color: "text-pink-500", bg: "bg-pink-100" };
  }
};

export const getAgeGroupLabel = (ageGroupUuid: string, ageGroupsBase: any[]) => {
  const ageGroup = ageGroupsBase.find(g => g.id === ageGroupUuid);
  if (!ageGroup) return "Pequeños (6-8)";
  const name = ageGroup.nombre.toLowerCase();
  if (name.includes("semilla")) return "Pequeños (6-8)";
  if (name.includes("explora")) return "Medianos (9-11)";
  if (name.includes("embaja")) return "Grandes (12-14)";
  return "Pequeños (6-8)";
};

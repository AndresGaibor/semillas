import type { Database } from "./database.types";

export type Tables = Database["public"]["Tables"];
export type Views = Database["public"]["Views"];
export type Enums = Database["public"]["Enums"];

export const table = {
  appUser: "usuario_app",
  profile: "perfil",
  ageGroup: "grupo_edad",
  path: "senda",
  theme: "tema",
  themeAgeGroup: "tema_grupo_edad",
  themeStep: "paso_tema",
  themeStepContent: "contenido_paso_tema",
  activity: "actividad",
  activityOption: "opcion_actividad",
  progressEvent: "evento_progreso",
  userThemeProgress: "progreso_tema_usuario",
  userActivityProgress: "progreso_actividad_usuario",
  achievement: "logro",
  userAchievement: "logro_usuario",
  offlinePackage: "paquete_sin_conexion",
  club: "club",
  clubMember: "miembro_club",
  clubChallenge: "reto_club",
  mediaAsset: "recurso_multimedia",
  auditLog: "registro_auditoria"
} as const;

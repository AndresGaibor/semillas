import type { Database } from "./database.types";

export type Tables = Database["public"]["Tables"];
export type Views = Database["public"]["Views"];
export type Enums = Database["public"]["Enums"];

export const table = {
  appUser: "app_user",
  profile: "profile",
  ageGroup: "age_group",
  path: "path",
  theme: "theme",
  themeAgeGroup: "theme_age_group",
  themeStep: "theme_step",
  themeStepContent: "theme_step_content",
  activity: "activity",
  activityOption: "activity_option",
  progressEvent: "progress_event",
  userThemeProgress: "user_theme_progress",
  userActivityProgress: "user_activity_progress",
  achievement: "achievement",
  userAchievement: "user_achievement",
  offlinePackage: "offline_package",
  club: "club",
  clubMember: "club_member",
  clubChallenge: "club_challenge",
  mediaAsset: "media_asset",
  auditLog: "audit_log"
} as const;

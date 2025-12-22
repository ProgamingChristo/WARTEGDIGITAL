// src/utils/types/admin.ts
export type AdminRole = "admin" | "superadmin";

export interface AdminUser {
  _id: string;
  username: string;
  role: AdminRole;
  createdAt: string;
}

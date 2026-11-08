import { apiClient } from "../../../lib/api";

export type AdminUserRole = "cliente" | "profesional" | "admin";

export type AdminUser = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: AdminUserRole;
  activo: boolean;
  estadoRegistro: "pendiente" | "activo" | "suspendido";
};

export type DeactivatedUser = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: AdminUserRole;
  activo: false;
  estadoRegistro: "suspendido";
};

export type AdminUserFilters = {
  search?: string;
  rol?: AdminUserRole;
};

export type UpdateAdminUserInput = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: AdminUserRole;
};

export function listUsers(filters: AdminUserFilters = {}): Promise<AdminUser[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.rol) params.set("rol", filters.rol);

  const query = params.toString();
  return apiClient.get<AdminUser[]>(`/admin/usuarios${query ? `?${query}` : ""}`);
}

export function updateUser(userId: number, input: UpdateAdminUserInput): Promise<AdminUser> {
  return apiClient.patch<AdminUser>(`/admin/usuarios/${userId}`, input);
}

export function deactivateUser(userId: number): Promise<DeactivatedUser> {
  return apiClient.delete<DeactivatedUser>(`/admin/usuarios/${userId}`);
}

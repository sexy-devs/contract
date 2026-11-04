import { apiClient } from "../../../lib/api";

export type DeactivatedUser = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: "cliente" | "profesional" | "admin";
  activo: false;
  estadoRegistro: "suspendido";
};

export function deactivateUser(userId: number): Promise<DeactivatedUser> {
  return apiClient.delete<DeactivatedUser>(`/admin/usuarios/${userId}`);
}

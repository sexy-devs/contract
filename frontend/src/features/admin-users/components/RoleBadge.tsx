import type { AdminUserRole } from "../api/adminUsersApi";

const roleStyles: Record<AdminUserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  cliente: "bg-blue-100 text-sky-800",
  profesional: "bg-green-100 text-green-700",
};

const roleLabels: Record<AdminUserRole, string> = {
  admin: "Administrador",
  cliente: "Cliente",
  profesional: "Prestador",
};

function RoleBadge({ rol }: { rol: AdminUserRole }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[rol]}`}>{roleLabels[rol]}</span>
  );
}

export default RoleBadge;

import { useEffect, useState } from "react";

import { apiClient, ApiError } from "../../../lib/api";
import Toast from "../../../components/ui/Toast";
import EditUserModal from "../components/EditUserModal";
import UsersTable from "../components/UsersTable";
import { listUsers, type AdminUser, type AdminUserRole } from "../api/adminUsersApi";

const roleFilterOptions: { value: AdminUserRole | ""; label: string }[] = [
  { value: "", label: "Todos los roles" },
  { value: "cliente", label: "Cliente" },
  { value: "profesional", label: "Prestador" },
  { value: "admin", label: "Administrador" },
];

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rol, setRol] = useState<AdminUserRole | "">("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<{ id: number }>("/usuarios/me")
      .then((me) => setCurrentUserId(me.id))
      .catch(() => setCurrentUserId(null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    const t = setTimeout(() => {
      listUsers({ search: search.trim() || undefined, rol: rol || undefined })
        .then((data) => {
          if (!cancelled) setUsers(data);
        })
        .catch((err) => {
          if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar el listado de usuarios.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, rol]);

  function handleUpdated(updated: AdminUser) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
    setToastMessage("Usuario actualizado correctamente.");
  }

  function handleDeactivated(userId: number) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, activo: false, estadoRegistro: "suspendido" } : u)),
    );
    setToastMessage("Usuario dado de baja correctamente.");
  }

  return (
    <div id="users-page" className="min-h-screen w-full bg-blue-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="mt-1 text-gray-600">Gestioná los usuarios, sus roles y datos.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, apellido o email"
            className="w-full rounded-lg border border-gray-200 bg-white p-2.5 sm:flex-1"
          />
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value as AdminUserRole | "")}
            className="w-full rounded-lg border border-gray-200 bg-white p-2.5 sm:w-56"
          >
            {roleFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="shrink-0 text-sm text-gray-500">
            {users.length} usuario{users.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-gray-600">Cargando usuarios...</p>
          ) : loadError ? (
            <p className="text-red-600">{loadError}</p>
          ) : (
            <UsersTable
              users={users}
              currentUserId={currentUserId}
              onEdit={setEditingUser}
              onDeactivated={handleDeactivated}
            />
          )}
        </div>
      </div>

      {editingUser && (
        <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdated={handleUpdated} />
      )}

      <Toast show={!!toastMessage} message={toastMessage ?? ""} onDismiss={() => setToastMessage(null)} />
    </div>
  );
}

export default UsersPage;

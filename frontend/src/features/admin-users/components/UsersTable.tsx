import DeactivateUserButton from "./DeactivateUserButton";
import RoleBadge from "./RoleBadge";
import type { AdminUser } from "../api/adminUsersApi";

type Props = {
  users: AdminUser[];
  currentUserId: number | null;
  onEdit: (user: AdminUser) => void;
  onDeactivated: (userId: number) => void;
};

function UsersTable({ users, currentUserId, onEdit, onDeactivated }: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-md">
        <p className="text-gray-600">No se encontraron usuarios.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-sm text-gray-500">
            <th className="px-5 py-3 font-medium">Usuario</th>
            <th className="px-5 py-3 font-medium">Teléfono</th>
            <th className="px-5 py-3 font-medium">Rol</th>
            <th className="px-5 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const inactive = !user.activo || user.estadoRegistro === "suspendido";
            const initials = `${user.nombre[0] ?? ""}${user.apellido[0] ?? ""}`.toUpperCase();
            const isSelf = user.id === currentUserId;

            return (
              <tr key={user.id} className={`border-b border-gray-100 last:border-0 ${inactive ? "opacity-50" : ""}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold text-sky-800">
                      {initials}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 font-semibold text-gray-900">
                        {user.nombre} {user.apellido}
                        {isSelf && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                            Vos
                          </span>
                        )}
                        {inactive && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                            Inactivo
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-700">{user.telefono}</td>
                <td className="px-5 py-4">
                  <RoleBadge rol={user.rol} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      disabled={inactive}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Editar
                    </button>
                    <DeactivateUserButton
                      userId={user.id}
                      userName={`${user.nombre} ${user.apellido}`}
                      disabled={inactive || isSelf}
                      onDeactivated={onDeactivated}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;

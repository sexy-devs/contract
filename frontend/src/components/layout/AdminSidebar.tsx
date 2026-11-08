import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoContract from "./LogoContract";

interface User {
  nombre: string;
  apellido: string;
  fotoUrl?: string | null;
  rol: string;
}

const roleLabels: Record<string, string> = {
  cliente: "Cliente",
  profesional: "Prestador",
  admin: "Administrador",
};

function AdminSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const getInitials = (nombre = "", apellido = "") =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  function closeSession() {
    localStorage.removeItem("token");
    navigate("/iniciar-sesion");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      })
      .catch((err) => console.error("Error fetching current user:", err));
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-blue-200 text-sky-800" : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <aside
      id="admin-sidebar"
      className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white px-4 py-6"
    >
      <div className="px-2">
        <LogoContract />
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        <NavLink to="/inicio" className={navClass}>
          Inicio
        </NavLink>
        <NavLink to="/catalogo" className={navClass}>
          Servicios
        </NavLink>
        <NavLink to="/perfil" className={navClass}>
          Mi perfil
        </NavLink>
      </nav>

      <p className="mt-8 px-3 text-xs font-semibold tracking-wide text-gray-400">PANEL DE CONTROL</p>
      <nav className="mt-2 flex flex-col gap-1">
        <NavLink to="/panel" className={navClass}>
          Usuarios
        </NavLink>
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3 px-2">
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-200 text-sm font-semibold text-sky-800">
            {user?.fotoUrl ? (
              <img src={user.fotoUrl} alt={`${user.nombre} ${user.apellido}`} className="h-full w-full object-cover" />
            ) : (
              getInitials(user?.nombre, user?.apellido)
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-sm text-gray-500">{user ? roleLabels[user.rol] ?? user.rol : ""}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={closeSession}
          className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-100"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

import { useEffect, useRef, useState } from "react";
import LogoContract from "./LogoContract";
import { NavLink, useNavigate } from "react-router-dom";

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fotoUrl?: string | null;
  rol: string;
}

function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getInitials = (nombre = "", apellido = "") =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  function closeSession(){
    localStorage.removeItem("token");
    goTo("/iniciar-sesion")
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

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function goTo(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `w-[80px] min-[740px]:w-[100px] text-center px-3 py-1.5 rounded-lg transition-colors ${
      isActive ? "bg-blue-200 text-sky-800" : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <div
      id="header"
      className="bg-white border-b border-gray-200 px-6 py-4 sm:px-10 flex 
      items-center justify-between w-full"
    >
      <LogoContract />

      {/* navegadores para pc */}
      <div id="navigators-pc" className="flex gap-2 max-[740px]:hidden">
        <NavLink to="/inicio" className={navClass}>
          Inicio
        </NavLink>
        <NavLink to="/catalogo" className={navClass}>
          Servicios
        </NavLink>
        <NavLink to="/perfil" className={navClass}>
          Mi perfil
        </NavLink>
        {user?.rol === "admin" && (
          <NavLink to="/panel" className={navClass}>
            Panel
          </NavLink>
        )}
      </div>

      {/* navegadores para celu */}
      <div
        id="navigators-mobile"
        className="min-[740px]:hidden fixed bottom-0 left-0 
        flex gap-2 items-center justify-center w-full bg-white pt-2.5 pb-2.5 
        z-9 border-t border-gray-200 text-[14px]"
      >
        <NavLink to="/inicio" className={navClass}>
          Inicio
        </NavLink>
        <NavLink to="/catalogo" className={navClass}>
          Servicios
        </NavLink>
        <NavLink to="/perfil" className={navClass}>
          Mi perfil
        </NavLink>
        {user?.rol === "admin" && (
          <NavLink to="/panel" className={navClass}>
            Panel
          </NavLink>
        )}
      </div>

      <div ref={menuRef} className="relative">
        <button
          className="
            bg-blue-200
            text-sky-800
            rounded-full
            w-10
            h-10
            flex
            items-center
            justify-center
            overflow-hidden
            font-semibold
            text-sm
          "
          onClick={() => setMenuOpen((open) => !open)}
        >
          {user?.fotoUrl ? (
            <img
              src={user.fotoUrl}
              alt={`${user.nombre} ${user.apellido}`}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(user?.nombre, user?.apellido)
          )}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1.5 shadow-md z-10">
            <button
              onClick={() => goTo("/perfil")}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-sky-800"
            >
              Mi perfil
            </button>
            <button
              onClick={() => goTo("/catalogo")}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-sky-800"
            >
              Servicios
            </button>
            <button
              onClick={()=> closeSession()}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-sky-800"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;

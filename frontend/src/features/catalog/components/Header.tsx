import { useEffect, useRef, useState } from "react";
import LogoContract from "../../../components/layout/LogoContract";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fotoUrl?: string | null;
}

function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getInitials = (nombre?: string, apellido?: string) => {
    const first = nombre && nombre.charAt(0).toUpperCase();
    const last = apellido && apellido.charAt(0).toUpperCase();
    return `${first}${last}`;
  };

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

  return (
    <div
      id="header"
      className="bg-white pt-5 pb-5 px-2.5 flex items-center justify-between w-full"
    >
      <LogoContract />
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;

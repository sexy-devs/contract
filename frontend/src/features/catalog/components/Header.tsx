import { useEffect, useState } from "react";
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
  const [profileButton, setProfileButton] = useState(false);
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

  return (
    <div
      id="header"
      className="bg-white pt-5 pb-5 px-2.5 flex items-center justify-between w-full"
    >
      <LogoContract />
      <div className="flex items-center justify-center gap-2.5">
        {profileButton && (
          <button
            className="mt-2.5 bg-blue-200 p-2 rounded-[14px] flex items-center justify-center text-sky-800"
            onClick={() => navigate("/perfil")}
          >
            Ir a mi perfil
          </button>
        )}
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
          onClick={() => setProfileButton(profileButton ? false : true)}
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
      </div>
    </div>
  );
}

export default Header;

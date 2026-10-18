import { useEffect, useState } from "react";
import ClienteProfile from "../components/ClienteProfile";
import PrestadorProfile from "../components/PrestadorProfile";
import { getMe, type UserProfile } from "../api/usersApi";

function Profile() {
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setUsuario)
      .catch(() => setError("No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-indigo-50 px-4 py-8 sm:px-8">
      {loading && <p className="text-gray-600">Cargando...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && usuario?.rol === "cliente" && <ClienteProfile />}
      {!loading && usuario?.rol === "profesional" && <PrestadorProfile />}
    </main>
  );
}

export default Profile;

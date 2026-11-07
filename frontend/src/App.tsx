import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api";
import Unauthorized from "./components/ui/Unauthorized";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Catalog from "./features/catalog/pages/Catalog";
import Profile from "./features/profile/pages/Profile";
import Chat from "./features/messages/pages/Chat";
import Home from "./features/home/pages/Home";
import Panel from "./features/admin/pages/panel";
import Header from "./components/layout/Header";

type User = { rol: "cliente" | "profesional" | "admin" };

function PrivateRoute() {
  // protección de ruta basada en token de sesión válido
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiClient
      .get<User>("/usuarios/me")
      .then((data) => {
        setUser(data);
        setStatus("ok");
      })
      .catch(() => {
        localStorage.removeItem("token");
        setStatus("fail");
      });
  }, []);

  if (status === "loading") return null;
  if (status === "fail") return <Unauthorized toPage={"/iniciar-sesion"}/>;
  return (
    <>
      {/*el header se monta al cargar el front, para evitar la recarga / flashes 
      del header en cada sección*/}
      <Header />
      <Outlet context={user} />
    </>
  );
}

function ProtectedRoleRoute({ roles }: { roles: User["rol"][] }) {
  // protección de ruta según rol
  const user = useOutletContext<User>();

  if (!roles.includes(user.rol)) {
    return <Unauthorized toPage={"/inicio"}/>;
  };

  return <Outlet context={user} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/inicio" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/perfil" element={<Profile />} />
          <Route element={<ProtectedRoleRoute roles={["admin"]} />}>
            <Route path="/panel" element={<Panel />} />
          </Route>
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

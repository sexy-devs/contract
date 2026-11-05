import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
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

function PrivateRoute() {
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    apiClient
      .get("/usuarios/me")
      .then(() => setStatus("ok"))
      .catch(() => {
        localStorage.removeItem("token");
        setStatus("fail");
      });
  }, []);

  if (status === "loading") return null;
  if (status === "fail") return <Unauthorized />;
  return (
    <>
      {/* ahora el header se monta al cargar el front, para evitar la recarga / flashes 
      del header en cada sección*/}
      <Header />
      <Outlet />
    </>
  );
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
          <Route path="/panel" element={<Panel />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

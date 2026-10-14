import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { apiClient } from "./lib/api";
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Catalog from './features/catalog/pages/Catalog';
import Profile from './features/profile/pages/Profile';
import Chat from './features/messages/pages/Chat';

function PrivateRoute({ children }: { children: ReactNode }) {
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
  if (status === "fail") return <Navigate to="/iniciar-sesion" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/catalogo" element={
          <PrivateRoute>
            <Catalog />
          </PrivateRoute>
        } />
        <Route path="/perfil" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

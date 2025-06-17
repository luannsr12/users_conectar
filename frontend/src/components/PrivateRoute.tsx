import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>; // ou null
    }

    if (!user) {
        return <Navigate to="/login" replace />;
      }

    return <Outlet />;
}

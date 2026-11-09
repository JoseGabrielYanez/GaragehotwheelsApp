import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BootSkeleton from "../components/ui/BootSkeleton";

/** Solo deja pasar a usuarios con sesión; el resto va a /login y vuelve a la página que pidió. */
export default function ProtectedRoute() {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();

  if (checking) return <BootSkeleton />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

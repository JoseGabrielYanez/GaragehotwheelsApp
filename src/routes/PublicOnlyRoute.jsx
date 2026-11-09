import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BootSkeleton from "../components/ui/BootSkeleton";

/** Login y registro: si ya hay sesión se redirige a la página original (o al stock). */
export default function PublicOnlyRoute() {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();

  if (checking) return <BootSkeleton />;
  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname || "/stock"} replace />;

  return <Outlet />;
}

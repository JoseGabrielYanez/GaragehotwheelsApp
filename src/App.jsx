import { Navigate, Route, Routes } from "react-router-dom";
import OfflineBanner from "./components/pwa/OfflineBanner";
import PwaUpdatePrompt from "./components/pwa/PwaUpdatePrompt";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AppLayout from "./layouts/AppLayout";
import AuthShell from "./components/auth/AuthShell";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StockPage from "./pages/StockPage";
import CarouselPage from "./pages/CarouselPage";

export default function App() {
  return (
    <>
      <OfflineBanner />
      <PwaUpdatePrompt />

      <Routes>
        {/* Públicas */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthShell />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* El enlace del correo funciona aunque haya una sesión abierta en este navegador */}
        <Route element={<AuthShell />}>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Protegidas (requieren sesión) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/stock" element={<StockPage />} />
            <Route path="/carousel" element={<CarouselPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/stock" replace />} />
      </Routes>
    </>
  );
}

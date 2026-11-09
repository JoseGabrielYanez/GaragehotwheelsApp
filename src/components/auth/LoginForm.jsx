import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useShake } from "../../hooks/useShake";
import AuthAlert from "./AuthAlert";
import AuthField from "./AuthField";
import AuthHeader from "./AuthHeader";
import AuthNotice from "./AuthNotice";
import AuthSubmit from "./AuthSubmit";
import PasswordField from "./PasswordField";
import { getErrorMessage } from "../../utils/errors";

// En pantallas táctiles no se enfoca solo el campo (evita abrir el teclado de golpe)
const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

/** Formulario público de inicio de sesión. Al autenticarse, PublicOnlyRoute redirige al stock. */
export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { controls, shake } = useShake();
  const location = useLocation();
  const notice = location.state?.notice; // p. ej. "Contraseña actualizada" tras restablecerla

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo iniciar sesión. Intenta de nuevo."));
      setLoading(false);
      shake();
    }
  }

  return (
    <>
      <AuthHeader
        eyebrow="Bienvenido de vuelta"
        title="Inicia sesión"
        text="Entra a tu garage para ver y ordenar tu colección."
      />

      <AuthNotice>{notice}</AuthNotice>

      <motion.form animate={controls} onSubmit={submit} className="grid gap-5">
        <AuthField
          id="login-email"
          label="Correo electrónico"
          icon={Mail}
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          autoFocus={canHover}
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />

        <PasswordField
          id="login-password"
          label="Contraseña"
          labelAside={
            <Link to="/forgot-password" state={{ email: form.email }} className="text-[0.8rem] font-semibold text-cyan hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          }
          placeholder="Tu contraseña"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />

        <AuthAlert>{error}</AuthAlert>

        <AuthSubmit loading={loading} disabled={!form.email || !form.password} loadingText="Entrando...">
          Entrar
        </AuthSubmit>
      </motion.form>

      <p className="mt-6 text-[0.95rem] text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link to="/register" className="font-bold text-cyan hover:underline">
          Crear cuenta
        </Link>
      </p>
    </>
  );
}

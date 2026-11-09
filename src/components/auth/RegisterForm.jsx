import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useShake } from "../../hooks/useShake";
import { MIN_PASSWORD_LENGTH } from "../../utils/password";
import AuthAlert from "./AuthAlert";
import AuthField from "./AuthField";
import AuthHeader from "./AuthHeader";
import AuthSubmit from "./AuthSubmit";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import { getErrorMessage } from "../../utils/errors";

const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

/** Formulario público de registro. Al crear la cuenta se inicia sesión y se redirige al stock. */
export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { controls, shake } = useShake();

  const valid = form.name.trim() && form.email && form.password.length >= MIN_PASSWORD_LENGTH;

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ ...form, name: form.name.trim() });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear la cuenta. Intenta de nuevo."));
      setLoading(false);
      shake();
    }
  }

  return (
    <>
      <AuthHeader
        eyebrow="Empieza tu garage"
        title="Crea tu cuenta"
        text="Registra tus autos con fotos y encuéntralos al instante. Cada colección es privada."
      />

      <motion.form animate={controls} onSubmit={submit} className="grid gap-5">
        <AuthField
          id="register-name"
          label="Nombre"
          icon={User}
          placeholder="Ej: Carlos Rojas"
          autoComplete="name"
          autoFocus={canHover}
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />

        <AuthField
          id="register-email"
          label="Correo electrónico"
          icon={Mail}
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          required
          hint={<p className="text-[0.8rem] text-muted">Lo usarás para iniciar sesión.</p>}
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />

        <PasswordField
          id="register-password"
          label="Contraseña"
          placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          hint={<PasswordStrength password={form.password} />}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />

        <AuthAlert>{error}</AuthAlert>

        <AuthSubmit loading={loading} disabled={!valid} loadingText="Creando cuenta...">
          Crear cuenta
        </AuthSubmit>
      </motion.form>

      <p className="mt-6 text-[0.95rem] text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-bold text-cyan hover:underline">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}

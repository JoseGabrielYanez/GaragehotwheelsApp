import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../api";
import { useShake } from "../../hooks/useShake";
import AuthAlert from "./AuthAlert";
import AuthField from "./AuthField";
import AuthHeader from "./AuthHeader";
import AuthSubmit from "./AuthSubmit";
import { getErrorMessage } from "../../utils/errors";

const RESEND_SECONDS = 60; // mismo tiempo de espera que aplica el servidor

const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

const backLink = (
  <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-[0.95rem] font-bold text-cyan hover:underline">
    <ArrowLeft size={16} /> Volver a iniciar sesión
  </Link>
);

/** Paso 1 de la recuperación: el usuario escribe su correo y recibe un enlace. */
export default function ForgotPasswordForm() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || ""); // viene del login si ya lo había escrito
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const { controls, shake } = useShake();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function requestLink(event) {
    event?.preventDefault();
    setError("");
    setSending(true);

    try {
      const { data } = await api.post("/auth/forgot-password", { email: email.trim() });
      if (data.expiresInMinutes) setMinutes(data.expiresInMinutes);
      setSent(true);
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo enviar el enlace. Intenta de nuevo."));
      shake();
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div>
        <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-accent/15 text-accent">
          <MailCheck size={28} />
        </div>

        <AuthHeader
          eyebrow="Correo enviado"
          title="Revisa tu bandeja"
          text={
            <>
              Si <strong className="text-fg">{email.trim()}</strong> está registrado, te enviamos un enlace para crear una contraseña nueva. Vence en{" "}
              {minutes} minutos.
            </>
          }
        />

        <ul className="mb-6 grid gap-2 text-[0.9rem] text-muted">
          <li>• Revisa también la carpeta de spam o promociones.</li>
          <li>• ¿Escribiste mal el correo? Puedes usar otro.</li>
        </ul>

        <div className="grid gap-3">
          <AuthAlert>{error}</AuthAlert>

          <button
            type="button"
            onClick={requestLink}
            disabled={sending || cooldown > 0}
            className="btn-primary h-[3.1rem]"
          >
            {sending ? "Enviando..." : cooldown > 0 ? `Reenviar enlace en ${cooldown} s` : "Reenviar enlace"}
          </button>

          <button
            type="button"
            onClick={() => {
              setSent(false);
              setError("");
            }}
            className="py-2 text-[0.95rem] font-semibold text-muted transition hover:text-fg"
          >
            Usar otro correo
          </button>
        </div>

        {backLink}
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        eyebrow="¿Problemas para entrar?"
        title="Recupera tu acceso"
        text="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva."
      />

      <motion.form animate={controls} onSubmit={requestLink} className="grid gap-5">
        <AuthField
          id="forgot-email"
          label="Correo electrónico"
          icon={Mail}
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          autoFocus={canHover}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <AuthAlert>{error}</AuthAlert>

        <AuthSubmit loading={sending} disabled={!email.trim()} loadingText="Enviando...">
          Enviar enlace
        </AuthSubmit>
      </motion.form>

      {backLink}
    </>
  );
}

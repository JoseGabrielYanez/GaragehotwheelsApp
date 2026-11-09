import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, CircleCheck, Unlink, X } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../api";
import { useShake } from "../../hooks/useShake";
import { MIN_PASSWORD_LENGTH } from "../../utils/password";
import Skeleton from "../ui/Skeleton";
import AuthAlert from "./AuthAlert";
import AuthHeader from "./AuthHeader";
import AuthSubmit from "./AuthSubmit";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import { getErrorMessage } from "../../utils/errors";

const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;
const DONE_NOTICE = "Contraseña actualizada. Ya puedes iniciar sesión.";

/** Paso 2 de la recuperación: se abre desde el enlace del correo (/reset-password/:token). */
export default function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("checking"); // checking | invalid | form | done
  const [linkError, setLinkError] = useState("");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { controls, shake } = useShake();

  const matches = form.confirm !== "" && form.password === form.confirm;
  const valid = form.password.length >= MIN_PASSWORD_LENGTH && matches;

  // Antes de mostrar el formulario se comprueba que el enlace siga vigente
  useEffect(() => {
    let cancelled = false;

    api
      .get(`/auth/reset-password/${token}`)
      .then(() => !cancelled && setPhase("form"))
      .catch((err) => {
        if (cancelled) return;
        setLinkError(getErrorMessage(err, "No se pudo comprobar el enlace. Intenta de nuevo."));
        setPhase("invalid");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Tras actualizar la contraseña se vuelve al login con un aviso
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => navigate("/login", { replace: true, state: { notice: DONE_NOTICE } }), 3000);
    return () => clearTimeout(timer);
  }, [phase, navigate]);

  async function submit(event) {
    event.preventDefault();
    if (!valid) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, password: form.password });
      setPhase("done");
    } catch (err) {
      const data = err.response?.data;
      if (data?.code === "INVALID_TOKEN") {
        setLinkError(data.message);
        setPhase("invalid");
      } else {
        setError(getErrorMessage(err, "No se pudo actualizar la contraseña. Intenta de nuevo."));
        shake();
      }
      setLoading(false);
    }
  }

  if (phase === "checking") {
    return (
      <div className="grid gap-5" aria-busy="true" aria-label="Comprobando enlace">
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-[3.1rem] rounded-xl" />
      </div>
    );
  }

  if (phase === "invalid") {
    return (
      <div>
        <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-danger/15 text-danger">
          <Unlink size={28} />
        </div>
        <AuthHeader eyebrow="Enlace no disponible" title="Este enlace ya no sirve" text={linkError} />

        <Link to="/forgot-password" className="btn-primary h-[3.1rem] w-full">
          Solicitar un enlace nuevo
        </Link>
        <Link to="/login" className="mt-5 inline-block text-[0.95rem] font-bold text-cyan hover:underline">
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div>
        <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#3ecf8e]/15 text-[#3ecf8e]">
          <CircleCheck size={28} />
        </div>
        <AuthHeader
          eyebrow="Todo listo"
          title="¡Contraseña actualizada!"
          text="Ya puedes iniciar sesión con tu contraseña nueva. Te llevamos al inicio de sesión en unos segundos."
        />

        <Link to="/login" replace state={{ notice: DONE_NOTICE }} className="btn-primary h-[3.1rem] w-full">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        eyebrow="Último paso"
        title="Crea tu contraseña nueva"
        text="Elige una contraseña que no uses en otros sitios. Al guardarla cerraremos tus sesiones abiertas."
      />

      <motion.form animate={controls} onSubmit={submit} className="grid gap-5">
        <PasswordField
          id="reset-password"
          label="Nueva contraseña"
          placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          autoComplete="new-password"
          autoFocus={canHover}
          required
          minLength={MIN_PASSWORD_LENGTH}
          hint={<PasswordStrength password={form.password} />}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />

        <PasswordField
          id="reset-confirm"
          label="Repite la contraseña"
          placeholder="Vuelve a escribirla"
          autoComplete="new-password"
          required
          hint={
            form.confirm && (
              <p className={`flex items-center gap-[0.4rem] text-[0.8rem] ${matches ? "text-[#3ecf8e]" : "text-danger"}`} role="status">
                {matches ? <Check size={14} /> : <X size={14} />}
                {matches ? "Las contraseñas coinciden" : "Todavía no coinciden"}
              </p>
            )
          }
          value={form.confirm}
          onChange={(event) => setForm({ ...form, confirm: event.target.value })}
        />

        <AuthAlert>{error}</AuthAlert>

        <AuthSubmit loading={loading} disabled={!valid} loadingText="Guardando...">
          Guardar contraseña
        </AuthSubmit>
      </motion.form>
    </>
  );
}

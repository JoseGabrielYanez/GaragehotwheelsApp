import { useState } from "react";
import { Eye, EyeOff, Lock, TriangleAlert } from "lucide-react";
import AuthField from "./AuthField";

/** Contraseña con ojo para mostrar/ocultar y aviso de Bloq Mayús. */
export default function PasswordField({ hint, ...props }) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  return (
    <AuthField
      icon={Lock}
      type={visible ? "text" : "password"}
      onKeyUp={(event) => setCapsLock(Boolean(event.getModifierState?.("CapsLock")))}
      onBlur={() => setCapsLock(false)}
      right={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="absolute top-1/2 right-[0.45rem] grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-glass-hi hover:text-fg"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
      hint={
        <>
          {capsLock && (
            <p className="flex items-center gap-[0.4rem] text-[0.8rem] font-semibold text-accent-2" role="status">
              <TriangleAlert size={14} /> Bloq Mayús está activado
            </p>
          )}
          {hint}
        </>
      }
      {...props}
    />
  );
}

import { Check } from "lucide-react";
import { MIN_PASSWORD_LENGTH, passwordStrength } from "../../utils/password";

/** Medidor de fortaleza con barras inclinadas (estilo "velocidad") y la regla mínima. */
export default function PasswordStrength({ password }) {
  const { level, label, color } = passwordStrength(password);
  const longEnough = password.length >= MIN_PASSWORD_LENGTH;

  return (
    <div className="grid gap-[0.45rem]" aria-live="polite">
      {level > 0 && (
        <div className="flex items-center gap-[0.35rem]">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="h-[0.35rem] flex-1 -skew-x-[20deg] rounded-[2px] transition-colors duration-300"
              style={{ background: n <= level ? color : "var(--line)" }}
            />
          ))}
          <span className="ml-2 min-w-[4.5rem] text-right text-[0.78rem] font-bold" style={{ color }}>
            {label}
          </span>
        </div>
      )}

      <p className={`flex items-center gap-[0.4rem] text-[0.8rem] ${longEnough ? "text-[#3ecf8e]" : "text-muted"}`}>
        <Check size={14} className={longEnough ? "opacity-100" : "opacity-30"} />
        Mínimo {MIN_PASSWORD_LENGTH} caracteres. Mezcla mayúsculas, números y símbolos para reforzarla.
      </p>
    </div>
  );
}

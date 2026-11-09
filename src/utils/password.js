const LEVELS = [
  { label: "Débil", color: "#ff6b81" },
  { label: "Media", color: "#ff9f43" },
  { label: "Buena", color: "#ffd166" },
  { label: "Fuerte", color: "#3ecf8e" }
];

export const MIN_PASSWORD_LENGTH = 6; // el servidor exige al menos 6 caracteres

/** Fortaleza de 1 a 4 (0 si está vacía). Solo orienta al usuario; la regla real es el largo mínimo. */
export function passwordStrength(password = "") {
  if (!password) return { level: 0, label: "", color: "" };
  if (password.length < MIN_PASSWORD_LENGTH) return { level: 1, label: "Muy corta", color: "#ff6b81" };

  const points =
    1 +
    Number(password.length >= 10) +
    Number(/[a-z]/.test(password) && /[A-Z]/.test(password)) +
    Number(/\d/.test(password)) +
    Number(/[^A-Za-z0-9]/.test(password));

  const level = Math.min(points, 4);
  return { level, ...LEVELS[level - 1] };
}

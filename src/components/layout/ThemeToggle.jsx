import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button type="button" className={`icon-btn ${className}`} onClick={toggleTheme} title="Cambiar tema" aria-label="Cambiar tema">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

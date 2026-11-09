import { Download } from "lucide-react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

/** Botón "Instalar" que solo aparece cuando el navegador permite instalar la app. */
export default function InstallButton({ className = "", children = "Instalar" }) {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <button type="button" onClick={install} className={className} title="Instalar la app en este dispositivo">
      <Download size={16} /> {children}
    </button>
  );
}

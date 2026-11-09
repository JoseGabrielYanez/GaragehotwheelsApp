import { useSyncExternalStore } from "react";
import { isIOS, isStandalone } from "../utils/pwa";

// El navegador lanza "beforeinstallprompt" una sola vez y a veces antes de que React termine de montar:
// por eso se escucha aquí, a nivel de módulo (main.jsx importa este archivo al inicio), y se comparte con todos los componentes.
let deferredPrompt = null;
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // evita el mini-aviso automático; la instalación se ofrece desde nuestros botones
    deferredPrompt = event;
    emit();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    emit();
  });
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useInstallPrompt() {
  const event = useSyncExternalStore(subscribe, () => deferredPrompt, () => null);
  const standalone = isStandalone();

  async function install() {
    if (!deferredPrompt) return false;

    const prompt = deferredPrompt;
    deferredPrompt = null;
    emit();

    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    return outcome === "accepted";
  }

  return {
    canInstall: Boolean(event) && !standalone, // Chrome / Edge / Android
    showIOSHint: isIOS() && !standalone && !event, // iPhone / iPad
    install
  };
}

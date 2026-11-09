import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, RefreshCw } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";

const HOUR = 60 * 60 * 1000;

/**
 * Registra el service worker y avisa de dos cosas:
 *  - "Lista para usar sin conexión" (la primera vez que se guarda todo),
 *  - "Nueva versión disponible" con el botón Actualizar (no se actualiza sola para no interrumpir una subida).
 */
export default function PwaUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Busca versiones nuevas cada hora mientras la app queda abierta
      if (registration) setInterval(() => registration.update(), HOUR);
    }
  });

  // El aviso de "sin conexión" se oculta solo
  useEffect(() => {
    if (!offlineReady) return;
    const timer = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(timer);
  }, [offlineReady, setOfflineReady]);

  // Aplica la versión nueva y recarga la página cuando el service worker nuevo toma el control.
  // Se hace aquí (y no solo con la recarga automática del plugin) porque el plugin no recarga si la actualización
  // la detectó una comprobación externa, como la de cada hora de arriba o la que hace el propio navegador.
  function applyUpdate() {
    navigator.serviceWorker?.addEventListener("controllerchange", () => window.location.reload(), { once: true });
    updateServiceWorker(true);
  }

  const visible = needRefresh || offlineReady;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 compact:bottom-[calc(6.75rem+env(safe-area-inset-bottom))]">
      <AnimatePresence>
        {visible && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-glass-line bg-panel-solid/95 p-3 pl-4 shadow-[0_1rem_2.5rem_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            {needRefresh ? (
              <>
                <RefreshCw size={20} className="flex-none text-accent" />
                <p className="flex-1 text-[0.9rem] font-semibold text-fg">Versión nueva disponible</p>
                <button type="button" onClick={() => setNeedRefresh(false)} className="rounded-lg px-3 py-2 text-[0.85rem] font-semibold text-muted transition hover:text-fg">
                  Después
                </button>
                <button type="button" onClick={applyUpdate} className="btn-primary h-10 rounded-xl px-4 text-[0.85rem]">
                  Actualizar
                </button>
              </>
            ) : (
              <>
                <CircleCheck size={20} className="flex-none text-[#3ecf8e]" />
                <p className="flex-1 text-[0.9rem] font-semibold text-fg">Lista para usar sin conexión</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

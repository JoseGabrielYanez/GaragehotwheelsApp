import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

/** Aviso flotante cuando se pierde la conexión (y un "Conexión restaurada" breve al volver). */
export default function OfflineBanner() {
  const online = useOnlineStatus();
  const [restored, setRestored] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      setRestored(false);
      return;
    }

    if (wasOffline.current) {
      wasOffline.current = false;
      setRestored(true);
      const timer = setTimeout(() => setRestored(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [online]);

  const visible = !online || restored;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(0.75rem+env(safe-area-inset-top))] z-50 flex justify-center px-4 roomy:top-[4.75rem]">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={online ? "online" : "offline"}
            role="status"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-[0.85rem] font-semibold shadow-[0_0.8rem_2rem_rgba(0,0,0,0.3)] backdrop-blur-xl ${
              online
                ? "border-[#3ecf8e]/40 bg-[#0f2a20]/90 text-[#3ecf8e] light:bg-[#e6f8ef]/95"
                : "border-accent-2/40 bg-[#2a2010]/90 text-accent-2 light:bg-[#fff4de]/95 light:text-[#8a5a00]"
            }`}
          >
            {online ? <Wifi size={16} /> : <WifiOff size={16} />}
            {online ? "Conexión restaurada" : "Sin conexión: verás los últimos datos guardados"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import AuthShowcase from "./AuthShowcase";

/**
 * Marco de las pantallas públicas: imagen a la izquierda (arriba en móvil) y formulario a la derecha.
 * El panel visual se mantiene al pasar de login a registro; solo el formulario se anima.
 */
export default function AuthShell() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <AuthShowcase />

      <section className="relative z-10 grid place-items-center px-[clamp(1.25rem,4vw,3rem)] py-10 max-lg:-mt-6 max-lg:rounded-t-3xl max-lg:bg-[var(--bg)]">
        <div className="w-[min(100%,28rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.25 }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

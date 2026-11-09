import { useEffect, useState } from "react";
import { Camera, Download, Images, LogOut, Share, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import CarIcon from "../ui/CarIcon";
import ThemeToggle from "./ThemeToggle";

const itemClass = ({ isActive }) =>
  `grid size-12 place-items-center rounded-2xl transition ${
    isActive ? "bg-accent/15 text-accent" : "text-muted hover:text-fg"
  }`;

/**
 * Barra de navegación inferior flotante (solo móvil / táctil).
 * Stock · Carrusel · [Cámara] · Tema · Perfil
 */
export default function BottomNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { canInstall, showIOSHint, install } = useInstallPrompt();

  // Cierra el menú del perfil al cambiar de página o con Escape
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Botón central: abre la cámara del formulario "Foto rápida" (en /stock)
  function openCamera() {
    if (location.pathname === "/stock") window.dispatchEvent(new Event("open-camera"));
    else navigate("/stock", { state: { openCamera: Date.now() } });
  }

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 mx-auto hidden max-w-[24rem] compact:block"
    >
      {/* Capa para cerrar el menú tocando fuera */}
      {menuOpen && <button type="button" aria-label="Cerrar menú" className="fixed inset-0 -z-10 cursor-default" onClick={() => setMenuOpen(false)} />}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 bottom-[calc(100%+0.6rem)] grid min-w-[12rem] gap-1 rounded-2xl border border-glass-line bg-panel-solid/95 p-2 shadow-[0_1rem_2.5rem_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <p className="px-3 pt-1 text-[0.72rem] font-bold tracking-[0.12em] text-muted uppercase">Sesión</p>
            <p className="truncate px-3 pb-1 font-semibold text-fg">{user?.name}</p>
            {canInstall && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  install();
                }}
                className="flex items-center gap-2 rounded-xl px-3 py-[0.6rem] text-left font-semibold text-fg transition hover:bg-glass-hi"
              >
                <Download size={18} className="text-accent" /> Instalar app
              </button>
            )}
            {showIOSHint && (
              <p className="flex items-start gap-2 rounded-xl bg-glass-hi px-3 py-[0.6rem] text-[0.8rem] leading-snug text-muted">
                <Share size={16} className="mt-[0.1rem] flex-none text-accent" />
                <span>
                  Para instalarla: toca <strong className="text-fg">Compartir</strong> y luego <strong className="text-fg">Añadir a pantalla de inicio</strong>.
                </span>
              </p>
            )}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl px-3 py-[0.6rem] text-left font-semibold text-danger transition hover:bg-danger/10"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="grid grid-cols-5 items-center justify-items-center rounded-[1.6rem] border border-glass-line bg-panel-solid/95 px-2 py-[0.6rem] shadow-[0_1rem_2.5rem_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150"
      >
        <NavLink to="/stock" className={itemClass} aria-label="Stock" title="Stock">
          <CarIcon />
        </NavLink>

        <NavLink to="/carousel" className={itemClass} aria-label="Carrusel" title="Carrusel">
          <Images size={22} />
        </NavLink>

        <button
          type="button"
          onClick={openCamera}
          aria-label="Foto rápida con la cámara"
          title="Foto rápida"
          className="grid size-[3.4rem] place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-[#160c08] shadow-[0_0.5rem_1.5rem_rgba(255,90,31,0.45)] transition active:scale-95"
        >
          <Camera size={24} strokeWidth={2} />
        </button>

        <ThemeToggle className="!size-12 !rounded-2xl !border-transparent !bg-transparent text-muted hover:text-fg" />

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Perfil y sesión"
          aria-expanded={menuOpen}
          title="Perfil"
          className={`grid size-12 place-items-center rounded-2xl transition ${menuOpen ? "bg-accent/15 text-accent" : "text-muted hover:text-fg"}`}
        >
          <User size={22} />
        </button>
      </motion.div>
    </nav>
  );
}

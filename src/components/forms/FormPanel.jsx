import { motion } from "framer-motion";
import loopTrack from "../../assets/loop-track.png";

/** Tarjeta de formulario (cabecera + decoración de pista). Oscura en tema oscuro, clara en tema claro. */
export default function FormPanel({ id, icon, kicker, title, onSubmit, className = "", children }) {
  return (
    <motion.form
      id={id}
      layout
      onSubmit={onSubmit}
      className={`form-scope relative overflow-hidden rounded-3xl border border-white/[0.14] bg-[linear-gradient(180deg,#1b1a1d,#14151a)] p-[1.4rem] shadow-[var(--shadow)] light:border-black/[0.12] light:bg-[linear-gradient(180deg,#ffffff,#f3f0e9)] max-sm:p-[0.9rem] ${className}`}
    >
      <img
        src={loopTrack}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute -top-2 -right-6 w-[88%] opacity-30 [mask-image:linear-gradient(180deg,#000_55%,transparent)]"
      />

      <div className="relative grid gap-[1.1rem]">
        <header>
          <span className="inline-flex items-center gap-[0.6rem] text-[0.95rem] font-extrabold tracking-[0.06em] text-[#4db6c6] uppercase light:text-[#0b8aa3]">
            {icon} {kicker}
          </span>
          <h2 className="mt-[0.3rem] font-sport text-[1.9rem] leading-[1.05] font-extrabold tracking-[-0.01em] text-white italic light:text-[#15161c]">
            {title}
          </h2>
        </header>

        {children}
      </div>
    </motion.form>
  );
}

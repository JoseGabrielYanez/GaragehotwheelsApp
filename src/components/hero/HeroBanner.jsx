import { Camera } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import hwLogo from "../../assets/hw-logo.png";

/** Banner superior: texto a la izquierda, logo al centro y contador a la derecha. */
export default function HeroBanner({ total }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 420], [0, -80]);
  const totalLabel = `${total} ${total === 1 ? "auto" : "autos"}`;

  return (
    <motion.section
      style={{ y }}
      className="mt-4 mb-5 flex items-center justify-between gap-[clamp(1rem,3vw,2.5rem)] rounded-xl border border-[#222226] bg-[linear-gradient(180deg,#16161a_0%,#121214_100%)] px-[clamp(1.4rem,3vw,2.5rem)] py-[clamp(1.5rem,2.6vw,2.25rem)] text-[#f4f4f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_32px_rgba(0,0,0,0.28)] light:border-black/10 light:bg-[linear-gradient(180deg,#ffffff_0%,#f7f6f2_100%)] light:text-[#15161c] light:shadow-[0_8px_24px_rgba(30,38,55,0.08)] max-md:flex-col max-md:items-stretch max-md:gap-[1.1rem]"
    >
      {/* Izquierda y derecha ocupan el mismo ancho (flex-1) para que el logo quede en el centro exacto */}
      <div className="grid min-w-0 flex-1 gap-[0.65rem]">
        {/*<span className="text-xs font-bold tracking-[0.18em] text-[#4db6c6] uppercase light:text-[#0b8aa3]">
          Garage 
        </span>*/}
        <h1 className="font-sans text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.15] font-extrabold tracking-[-0.025em] text-balance">
          Tu vitrina <em className="text-gradient not-italic">Hot Wheels</em>, siempre a mano.
        </h1>
      </div>

      <img
        src={hwLogo}
        alt="Hot Wheels"
        draggable={false}
        className="opacity-45 block h-[clamp(2.6rem,4.2vw,3.8rem)] w-auto flex-none light:invert max-lg:h-[2.4rem] max-md:hidden"
      />

      <div className="flex flex-1 justify-end max-md:justify-start">
        <div className="inline-flex items-center gap-[0.9rem] rounded-[10px] border border-[#2a2a2f] bg-white/[0.04] px-[1.2rem] py-[0.85rem] light:border-black/10 light:bg-black/[0.03] max-md:w-full">
          <Camera className="size-[3.2rem] flex-none text-accent" size={28} strokeWidth={1.8} aria-hidden="true" />
          <div className="flex flex-col gap-[0.2rem] leading-[1.1]">
            <strong className="text-[1.2rem] font-bold tracking-[-0.01em]">{totalLabel}</strong>
            <span className="text-[0.8rem] text-[#9a9aa5] light:text-muted">registrados</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

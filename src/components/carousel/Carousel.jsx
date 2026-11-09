import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CarImage from "../ui/CarImage";
import EmptyState from "../ui/EmptyState";
import { carMeta } from "../../utils/cars";

// Posición, escala y opacidad según la distancia a la tarjeta activa (0, 1, 2+)
const X_POS = [0, 64, 112];
const SCALE = [1, 0.84, 0.68];
const ALPHA = [1, 0.7, 0.32];

// En móvil / táctil (compact:) el carrusel ocupa toda la altura libre, centrado, con la tarjeta principal grande
export const carouselShellClass =
  "mt-4 overflow-hidden px-[clamp(1rem,3vw,2rem)] pt-[clamp(1.4rem,3vw,2.4rem)] pb-[clamp(1.1rem,2.5vw,1.8rem)] [--cw:min(clamp(13rem,21vw,24rem),max(9rem,calc((100vh_-_15.5rem)/1.25)))] compact:flex compact:min-h-[calc(100dvh_-_8.75rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] compact:items-center compact:justify-center compact:[--cw:min(74vw,26rem,max(9rem,calc((100dvh_-_17rem)/1.25)))]";

export const carouselStageClass =
  "relative grid h-[calc(var(--cw)*1.25+6.2rem)] touch-pan-y place-items-center [perspective:90rem] compact:h-[calc(var(--cw)*1.25+5rem)] compact:w-full";

export const glassCardClass =
  "absolute w-[var(--cw)] rounded-[1.6rem] border border-white/20 bg-[linear-gradient(160deg,rgba(255,255,255,0.17),rgba(255,255,255,0.05))] p-3 text-white shadow-[0_1.6rem_4rem_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.28)] will-change-[transform,opacity] light:border-black/10 light:bg-[linear-gradient(160deg,rgba(255,255,255,0.85),rgba(255,255,255,0.55))] light:text-[#15161c] light:shadow-[0_1.6rem_3rem_rgba(30,38,55,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]";

export const posterClass =
  "relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[radial-gradient(70%_60%_at_50%_45%,rgba(255,255,255,0.1),transparent_75%)] light:bg-[radial-gradient(70%_60%_at_50%_45%,rgba(20,24,34,0.06),transparent_75%)] [--car-pad:0.4rem]";

/** Carrusel 3D: arrastrar, flechas del teclado o clic en una tarjeta lateral. */
export default function Carousel({ cars }) {
  const [active, setActive] = useState(0);
  const dragged = useRef(false);
  const total = cars.length;
  const current = total ? Math.min(active, total - 1) : 0;

  // Solo se montan las tarjetas cercanas a la activa (con muchos autos el resto no se dibuja)
  const slots = [];
  if (total) {
    const before = Math.min(3, Math.ceil(total / 2) - 1);
    const after = Math.min(3, Math.floor(total / 2));
    for (let off = -before; off <= after; off++) slots.push({ idx: (current + off + total) % total, d: off });
  }

  const go = useCallback(
    (dir) => {
      if (!total) return;
      setActive((c) => (Math.min(c, total - 1) + dir + total) % total);
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (/input|textarea/i.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!total) {
    return (
     <section className={carouselShellClass}>
        <EmptyState title="Tu carrusel está vacío" text="Registra tu primer auto en la pestaña Stock." />
      </section>
    );
  }

  return (
    <section className={carouselShellClass}>
      <motion.div
        className={`${carouselStageClass} cursor-grab active:cursor-grabbing`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={(_e, info) => {
          if (info.offset.x < -50) go(1);
          if (info.offset.x > 50) go(-1);
          setTimeout(() => (dragged.current = false), 0);
        }}
      >
        {slots.map(({ idx, d }) => {
          const item = cars[idx];
          const abs = Math.abs(d);
          const k = Math.min(abs, 2);
          const sign = Math.sign(d);
          const meta = carMeta(item);

          return (
            <motion.article
              key={item._id}
              className={`${glassCardClass} ${d === 0 ? "cursor-default" : "cursor-pointer"}`}
              initial={false}
              animate={{
                x: `${sign * X_POS[k]}%`,
                scale: SCALE[k],
                rotateY: -sign * 24,
                opacity: abs <= 2 ? ALPHA[k] : 0,
                zIndex: 10 - k
              }}
              style={{ pointerEvents: abs <= 2 ? "auto" : "none" }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              onClick={() => !dragged.current && setActive(idx)}
            >
              <div className={posterClass}>
                <CarImage car={item} />
              </div>
              <div className="px-1 pt-[0.8rem] pb-[0.15rem]">
                <h3 className="text-[1.05rem] leading-[1.15] font-bold [overflow-wrap:anywhere] compact:text-[1.2rem]">{item.name}</h3>
                {meta && <p className="mt-1 text-[0.8rem] text-white/70 light:text-black/60 compact:text-[0.9rem]">{meta}</p>}
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}

import emptyCar from "../../assets/empty-car.png";

/** Estado vacío (sin autos / sin coincidencias). onDark: para fondos siempre oscuros (carrusel). */
export default function EmptyState({ title, text, onDark = false, children }) {
  return (
    <div
      className={`col-span-full grid min-h-[17rem] place-content-center place-items-center text-center ${
        onDark ? "text-white/70" : "text-muted"
      }`}
    >
      <img
        src={emptyCar}
        alt=""
        draggable={false}
        className={`pointer-events-none mb-[0.4rem] w-[min(15rem,62%)] select-none opacity-50 invert ${
          onDark ? "" : "light:opacity-30 light:invert-0"
        }`}
      />
      <h3 className={`mt-4 mb-[0.35rem] text-[1.17rem] font-bold ${onDark ? "text-white" : "text-fg"}`}>{title}</h3>
      <p className="max-w-[26rem]">{text}</p>
      {children}
    </div>
  );
}

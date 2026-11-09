/** Cabecera de los formularios públicos: huella decorativa + título + texto de ayuda. */
export default function AuthHeader({ eyebrow, title, text }) {
  return (
    <header className="mb-7 grid gap-3">
      <div
        aria-hidden="true"
        className="tread-band h-9 w-44 opacity-60 [mask-image:linear-gradient(90deg,#000_40%,transparent)]"
      />
      <span className="text-xs font-extrabold tracking-[0.18em] text-cyan uppercase">{eyebrow}</span>
      <h1 className="font-sport text-[clamp(2rem,3.6vw,2.7rem)] leading-[1.05] font-extrabold tracking-[-0.01em] italic">
        {title}
      </h1>
      <p className="leading-relaxed text-muted">{text}</p>
    </header>
  );
}

/** Campo de formulario público: etiqueta arriba, ícono a la izquierda y espacio opcional a la derecha. */
export default function AuthField({ id, label, labelAside, icon: Icon, right, hint, className = "", ...inputProps }) {
  return (
    <div className="grid gap-[0.4rem]">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.85rem] font-semibold text-fg">
          {label}
        </label>
        {labelAside}
      </div>

      <div className="group relative">
        <Icon
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-[0.9rem] -translate-y-1/2 text-muted transition-colors group-focus-within:text-accent"
        />
        <input id={id} className={`field h-12 pl-[2.7rem] ${right ? "pr-[3rem]" : ""} ${className}`} {...inputProps} />
        {right}
      </div>

      {hint}
    </div>
  );
}

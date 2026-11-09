import { ArrowRight } from "lucide-react";

/** Botón principal de login/registro. Mientras procesa, una huella de neumático "acelera" dentro del botón. */
export default function AuthSubmit({ loading, disabled, children, loadingText = "Procesando..." }) {
  return (
    <button className="btn-primary group relative mt-1 h-[3.1rem] overflow-hidden" disabled={loading || disabled}>
      {loading && (
        <span
          aria-hidden="true"
          className="tread-band-white tread-drive pointer-events-none absolute inset-x-0 bottom-0 h-[60%] opacity-35 [--dur:0.7s] [--tile:6rem]"
        />
      )}
      <span className="relative inline-flex items-center gap-2">
        {loading ? (
          loadingText
        ) : (
          <>
            {children}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </span>
    </button>
  );
}

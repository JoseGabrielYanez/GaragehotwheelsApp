import carIcon from "../../assets/icon-car.png";

/**
 * Icono de auto (silueta). Usa la imagen como máscara y se pinta con el color del texto actual,
 * así cambia solo entre gris / naranja (activo) y entre tema claro y oscuro, como un icono de lucide.
 */
export default function CarIcon({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[1.6rem] w-[2.2rem] bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(${carIcon})`,
        maskImage: `url(${carIcon})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain"
      }}
    />
  );
}

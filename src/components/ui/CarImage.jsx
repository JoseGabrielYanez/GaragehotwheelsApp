import { imageSrc } from "../../api";
import { isPhotoStyle } from "../../utils/cars";

const zoom = "transition-transform duration-[400ms] group-hover/card:scale-105";

/**
 * Foto de un auto.
 * - Recorte con transparencia: flota con sombra.
 * - Foto normal (auto suelto u original): se muestra completa sobre un fondo desenfocado de sí misma.
 * El contenedor debe ser `relative`; el margen interior se controla con --car-pad.
 */
export default function CarImage({ car, lazy = false }) {
  const src = imageSrc(car.imageUrl);
  // crossOrigin: la respuesta es "legible" (no opaca) y el service worker puede guardarla para verla sin conexión
  const common = { draggable: false, decoding: "async", crossOrigin: "anonymous", loading: lazy ? "lazy" : undefined };

  if (!isPhotoStyle(car.imageUrl)) {
    return (
      <img
        src={src}
        alt={car.name}
        {...common}
        className={`absolute inset-[var(--car-pad,0.5rem)] size-[calc(100%_-_2*var(--car-pad,0.5rem))] select-none object-contain drop-shadow-[0_0.6rem_1rem_rgba(0,0,0,0.45)] ${zoom}`}
      />
    );
  }

  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        {...common}
        className={`absolute -inset-[12%] size-[124%] object-cover blur-[20px] brightness-[0.8] saturate-[1.2] ${zoom}`}
      />
      <img
        src={src}
        alt={car.name}
        {...common}
        className={`absolute inset-0 size-full select-none object-contain drop-shadow-[0_0.5rem_1rem_rgba(0,0,0,0.4)] ${zoom}`}
      />
    </>
  );
}

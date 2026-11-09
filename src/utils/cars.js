/** Separa las notas de un auto ("rojo, serie 90s") en una lista de características. */
export function parseFeatures(notes = "", max = 4) {
  return notes
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, max);
}

/** Texto corto bajo el nombre en el carrusel (las dos primeras notas). */
export function carMeta(car) {
  return parseFeatures(car.notes || "", 2).join(" • ");
}

/** Fotos sin recorte (autos sueltos u originales) se muestran sobre un fondo desenfocado. */
export const isPhotoStyle = (url = "") => /(-photo\.webp|\.jpe?g)$/i.test(url);

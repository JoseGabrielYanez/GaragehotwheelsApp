/** ¿La app está abierta como app instalada (sin barras del navegador)? */
export const isStandalone = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

/** iPhone / iPad: Safari no ofrece el botón de instalar, hay que usar "Compartir → Añadir a pantalla de inicio". */
export const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

/**
 * Borra de la caché del service worker los datos privados del usuario (inventario, sesión y fotos).
 * Se llama al cerrar sesión o cuando la sesión caduca, para que nada quede guardado en un equipo compartido.
 */
export async function clearPrivateCaches() {
  try {
    if (typeof caches !== "undefined") await Promise.all(["api-data", "car-photos"].map((name) => caches.delete(name)));
  } catch {
    // sin soporte de Cache Storage: no hay nada que borrar
  }
}

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api";

/**
 * Carga los autos del usuario.
 * reload({ silent: true }) vuelve a pedir la lista SIN mostrar el skeleton (se usa tras crear/borrar un auto).
 * - paginated: true  → inventario (búsqueda + paginación en el servidor)
 * - paginated: false → carrusel (todos los autos)
 *
 * showSkeleton es true en la primera carga y cuando una respuesta tarda más de 250 ms
 * (así no parpadea al filtrar o cambiar de página con respuestas rápidas).
 */
export function useCars({ paginated = false, search = "", page = 1, limit = 12, onPageCorrected } = {}) {
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const onPageCorrectedRef = useRef(onPageCorrected);
  onPageCorrectedRef.current = onPageCorrected;
  const silentRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let slowTimer;
    const silent = silentRef.current; // recarga silenciosa: se conserva lo que ya se ve mientras llega la respuesta
    silentRef.current = false;

    const timer = setTimeout(async () => {
      slowTimer = setTimeout(() => !cancelled && !silent && setSlow(true), 250);

      try {
        const params = paginated ? { search, page, limit } : {};
        const { data } = await api.get("/cars", { params });
        if (cancelled) return;
        // Conserva la clave (_key) de las tarjetas que ya estaban para que no se vuelvan a montar
        setCars((previous) => data.cars.map((car) => ({ ...car, _key: previous.find((old) => old._id === car._id)?._key })));
        setTotal(data.total);
        setError(false);
        // El servidor ajusta la página si ya no existe (por ejemplo, tras borrar el último auto)
        if (paginated && data.page !== page) onPageCorrectedRef.current?.(data.page);
      } catch {
        // si falla, se deja de mostrar el skeleton y queda el estado anterior (se avisa con error=true)
        if (!cancelled) setError(true);
      } finally {
        clearTimeout(slowTimer);
        if (!cancelled) {
          setReady(true);
          setSlow(false);
        }
      }
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(slowTimer);
    };
  }, [paginated, search, page, limit, reloadKey]);

  const reload = useCallback(({ silent = false } = {}) => {
    silentRef.current = silent;
    setReloadKey((n) => n + 1);
  }, []);

  return { cars, setCars, total, setTotal, ready, error, showSkeleton: !ready || slow, reload };
}

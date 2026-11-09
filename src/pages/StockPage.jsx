import { useRef, useState } from "react";
import { api } from "../api";
import { useCars } from "../hooks/useCars";
import HeroBanner from "../components/hero/HeroBanner";
import CarUploadForm from "../components/forms/CarUploadForm";
import QuickCaptureForm from "../components/forms/QuickCaptureForm";
import InventoryPanel from "../components/inventory/InventoryPanel";

/** /stock — banner + formularios de ingreso + inventario con paginación. */
export default function StockPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const { cars, setCars, total, setTotal, showSkeleton, error, reload } = useCars({
    paginated: true,
    search,
    page,
    limit,
    onPageCorrected: setPage
  });

  // Autos que se están subiendo: se ven al instante en la primera página, antes de que responda el servidor
  const [pending, setPending] = useState([]);
  const onFirstView = page === 1 && !search.trim();

  // Estado más reciente para los callbacks que terminan después (la subida puede tardar unos segundos)
  const latest = useRef({});
  latest.current = { page, limit, onFirstView, carsCount: cars.length };

  function startPending({ name, notes, previewUrl }) {
    const id = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setPending((list) => [{ _id: id, name, notes, previewUrl, pending: true }, ...list]);
    return id;
  }

  function failPending(id) {
    setPending((list) => list.filter((item) => item._id !== id));
  }

  function handleCreated(car, pendingId) {
    failPending(pendingId);

    if (latest.current.onFirstView) {
      // Aparece junto a los demás (la lista va del más nuevo al más antiguo), sin volver a pedir nada al servidor.
      // _key = id temporal: la tarjeta "Guardando..." se convierte en la definitiva sin volver a montarse.
      setCars((items) => [{ ...car, _key: pendingId }, ...items.filter((item) => item._id !== car._id)].slice(0, latest.current.limit));
      setTotal((value) => value + 1);
      return;
    }

    // Estaba en otra página o filtrando: vuelve al inicio y trae la lista sin mostrar el skeleton
    setSearch("");
    setPage(1);
    reload({ silent: true });
  }

  async function removeCar(id) {
    await api.delete(`/cars/${id}`);

    // Desaparece al instante; luego se rellena el hueco con el siguiente auto, sin skeleton
    setCars((items) => items.filter((item) => item._id !== id));
    setTotal((value) => Math.max(0, value - 1));
    if (latest.current.carsCount === 1 && latest.current.page > 1) setPage(latest.current.page - 1);
    reload({ silent: true });
  }

  function handleUpdated(updated) {
    setCars((items) => items.map((item) => (item._id === updated._id ? { ...updated, _key: item._key } : item)));
  }

  const visibleCars = onFirstView ? [...pending, ...cars] : cars;
  const formProps = { onStart: startPending, onCreated: handleCreated, onFail: failPending };

  return (
    <>
      <HeroBanner total={total} />

      <section className="grid grid-cols-[minmax(18rem,26rem)_1fr] items-start gap-[1.1rem] max-lg:grid-cols-1">
        <div className="grid content-start gap-[1.1rem] roomy:sticky roomy:top-[5.5rem]">
          <CarUploadForm {...formProps} />
          <QuickCaptureForm {...formProps} />
        </div>

        <InventoryPanel
          cars={visibleCars}
          total={total}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          page={page}
          limit={limit}
          onPage={setPage}
          onLimit={(value) => {
            setLimit(value);
            setPage(1);
          }}
          showSkeleton={showSkeleton}
          loadError={error}
          onRetry={() => reload()}
          onDelete={removeCar}
          onUpdate={handleUpdated}
        />
      </section>
    </>
  );
}

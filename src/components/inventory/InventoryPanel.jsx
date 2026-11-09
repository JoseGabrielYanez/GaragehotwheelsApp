import { useRef } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import hotwheelsBg from "../../assets/hotwheels-bg.jpg";
import EmptyState from "../ui/EmptyState";
import StockCard from "./StockCard";
import StockSkeleton from "./StockSkeleton";
import Pagination from "./Pagination";
import { stockGridClass } from "./styles";

/** Inventario (CRUD): búsqueda, grilla de autos, skeleton de carga y paginación. */
export default function InventoryPanel({
  cars,
  total,
  search,
  onSearchChange,
  page,
  limit,
  onPage,
  onLimit,
  showSkeleton,
  loadError,
  onRetry,
  onDelete,
  onUpdate
}) {
  const panelRef = useRef(null);
  const query = search.trim();

  function goToPage(next) {
    onPage(next);
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      ref={panelRef}
      className="relative min-h-[40rem] scroll-mt-[5.5rem] overflow-hidden rounded-[1.4rem] border border-line bg-panel p-[1.1rem] shadow-[var(--shadow)] backdrop-blur-[22px] max-sm:p-[0.9rem]"
    >
      <img src={hotwheelsBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-cover opacity-20" />

      <div className="relative">
        <div className="mb-[1.1rem] flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
          <div>
           {/* <span className="inline-flex items-center gap-[0.45rem] text-xs font-extrabold tracking-[0.1em] text-cyan uppercase">
              Administra tu
            </span>*/}
            <h2 className="mt-1 text-[1.6rem] font-bold">Inventario</h2>
          </div>

          <label className="relative w-[min(100%,22rem)] max-sm:w-full">
            <Search size={18} className="pointer-events-none absolute top-1/2 left-[0.9rem] -translate-y-1/2 text-muted" />
            <input
              className="field rounded-full pl-[2.6rem]"
              placeholder="Filtrar por nombre..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>
        </div>

        <motion.div className={stockGridClass} layout>
          {showSkeleton ? (
            Array.from({ length: Math.min(limit, 12) }, (_, i) => <StockSkeleton key={i} />)
          ) : (
            <>
              {cars.map((car) => (
                <StockCard key={car._key ?? car._id} car={car} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
              {!cars.length && loadError && (
                <EmptyState title="No pudimos cargar tus autos" text="Revisa tu conexión a internet e inténtalo de nuevo.">
                  <button type="button" onClick={onRetry} className="btn-primary mt-4 h-11 px-5">
                    Reintentar
                  </button>
                </EmptyState>
              )}
              {!cars.length && !loadError && (
                <EmptyState
                  title={query ? "No hay coincidencias" : "Tu inventario está vacío"}
                  text={query ? `Ningún auto coincide con “${query}”. Prueba con otro nombre.` : "Agrega tu primer auto para empezar tu colección."}
                />
              )}
            </>
          )}
        </motion.div>

        <Pagination
          page={page}
          pages={Math.max(Math.ceil(total / limit), 1)}
          total={total}
          limit={limit}
          onPage={goToPage}
          onLimit={onLimit}
        />
      </div>
    </section>
  );
}

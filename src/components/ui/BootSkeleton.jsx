import Skeleton from "./Skeleton";
import StockSkeleton from "../inventory/StockSkeleton";
import { stockGridClass } from "../inventory/styles";

/** Maqueta de la app mientras se verifica la sesión (reemplaza al "Cargando..."). */
export default function BootSkeleton() {
  return (
    <>
      <div
        className="sticky top-0 z-20 compact:hidden rounded-b-[1.1rem] border-b border-glass-line bg-glass backdrop-blur-[22px]"
        aria-hidden="true"
      >
        <div className="px-page grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-[0.6rem] max-md:grid-cols-[1fr_auto]">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-4 w-44 justify-self-center rounded-md max-md:hidden" />
          <Skeleton className="h-4 w-36 justify-self-end rounded-md" />
        </div>
      </div>

      <main className="px-page min-h-screen w-full pt-3 pb-12" aria-busy="true" aria-label="Cargando garage">
        <Skeleton className="mt-4 mb-5 h-28 rounded-xl" />
        <div className="grid grid-cols-[minmax(18rem,26rem)_1fr] items-start gap-[1.1rem] max-lg:grid-cols-1">
          <Skeleton className="h-[26rem] rounded-3xl" />
          <div className="rounded-[1.4rem] border border-line bg-panel p-[1.1rem]">
            <div className={stockGridClass}>
              {Array.from({ length: 8 }, (_, i) => (
                <StockSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

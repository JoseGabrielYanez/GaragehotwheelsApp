import { useCars } from "../hooks/useCars";
import Carousel, { carouselShellClass } from "../components/carousel/Carousel";
import CarouselSkeleton from "../components/carousel/CarouselSkeleton";
import EmptyState from "../components/ui/EmptyState";

/** /carousel — todos los autos en el carrusel 3D. */
export default function CarouselPage() {
  const { cars, showSkeleton, error, reload } = useCars({ paginated: false });

  if (showSkeleton) return <CarouselSkeleton />;

  // Sin datos y con error (p. ej. sin conexión y nunca abierto antes): no se dice "vacío" porque no es cierto
  if (error && !cars.length) {
    return (
      <section className={carouselShellClass}>
        <EmptyState title="No pudimos cargar tu colección" text="Revisa tu conexión a internet e inténtalo de nuevo.">
          <button type="button" onClick={() => reload()} className="btn-primary mt-4 h-11 px-5">
            Reintentar
          </button>
        </EmptyState>
      </section>
    );
  }

  return <Carousel cars={cars} />;
}

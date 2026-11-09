import Skeleton from "../ui/Skeleton";
import { carouselShellClass, carouselStageClass, glassCardClass, posterClass } from "./Carousel";

export default function CarouselSkeleton() {
  return (
    <section className={carouselShellClass} aria-busy="true" aria-label="Cargando carrusel">
      <div className={carouselStageClass}>
        {[-1, 1, 0].map((pos) => (
          <div
            key={pos}
            className={`${glassCardClass} pointer-events-none`}
            style={{
              transform: `translateX(${pos * 64}%) scale(${pos === 0 ? 1 : 0.84})`,
              opacity: pos === 0 ? 1 : 0.6,
              zIndex: pos === 0 ? 10 : 9
            }}
          >
            <Skeleton className={`${posterClass} bg-white/[0.07] light:bg-black/[0.07]`} />
            <div className="px-1 pt-[0.8rem] pb-[0.15rem]">
              <Skeleton className="h-4 w-[70%] rounded-md bg-white/10 light:bg-black/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

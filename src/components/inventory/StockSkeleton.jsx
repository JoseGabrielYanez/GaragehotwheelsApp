import Skeleton from "../ui/Skeleton";
import { stockCardClass } from "./styles";

export default function StockSkeleton() {
  return (
    <div className={stockCardClass} aria-hidden="true">
      <div className="grid flex-1 content-start gap-[0.55rem] px-[0.4rem] pt-[0.35rem] pb-3">
        <Skeleton className="h-4 w-[72%] rounded-md" />
        <Skeleton className="h-[0.7rem] w-[42%] rounded-md" />
      </div>
      <Skeleton className="aspect-[4/5] rounded-[0.9rem]" />
    </div>
  );
}

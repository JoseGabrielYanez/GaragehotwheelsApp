export default function BrandMark({ className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-[0.45rem] text-[1.05rem] font-extrabold tracking-[0.02em] uppercase ${className}`}
      aria-label="Collection Garage"
    >
      <span className="-skew-x-12 rounded-[0.55rem_0.2rem_0.55rem_0.2rem] bg-linear-to-br from-accent to-accent-2 px-[0.6rem] py-[0.32rem] text-[#15100b]">
        Collection
      </span>
      <span>Garage</span>
    </div>
  );
}

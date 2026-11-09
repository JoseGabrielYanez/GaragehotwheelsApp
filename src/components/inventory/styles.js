// Clases compartidas del inventario (tarjetas reales y skeletons usan la misma grilla)
export const stockGridClass =
  "grid grid-cols-[repeat(auto-fill,minmax(14.5rem,1fr))] gap-4 max-sm:grid-cols-2 max-sm:gap-[0.6rem]";

export const stockCardClass =
  "flex flex-col rounded-[1.2rem] border border-line bg-panel-solid/85 p-[0.55rem] shadow-[0_1rem_2.5rem_rgba(0,0,0,0.2)] backdrop-blur-[10px] max-sm:rounded-2xl max-sm:p-[0.4rem]";

export const stockPhotoClass =
  "relative aspect-[4/5] flex-none overflow-hidden rounded-[0.9rem] bg-[radial-gradient(70%_60%_at_50%_45%,rgba(255,255,255,0.09),transparent_75%)] light:bg-[radial-gradient(70%_60%_at_50%_45%,rgba(20,24,34,0.07),transparent_75%)]";

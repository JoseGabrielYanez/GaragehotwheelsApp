import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZES = [8, 12, 24, 48];

/** Números de página con "…" cuando hay muchas: 1 … 4 5 6 … 20 */
function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => set.add(n));
  if (page >= pages - 2) [pages - 1, pages - 2, pages - 3].forEach((n) => set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push(`gap-${n}`);
    out.push(n);
  });
  return out;
}

const navBtn = "icon-btn size-[2.3rem]";

export default function Pagination({ page, pages, total, limit, onPage, onLimit }) {
  if (!total) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-[6.8rem] flex flex-wrap items-center justify-between gap-x-[1.2rem] gap-y-[0.9rem] border-t border-line pt-[1.1rem] text-[0.9rem] text-muted max-sm:flex-col max-sm:items-stretch max-sm:text-center">
      <span>
        Mostrando <b className="text-fg">{from}–{to}</b> de <b className="text-fg">{total}</b>
      </span>

      {pages > 1 && (
        <nav className="flex items-center gap-[0.35rem] max-sm:justify-center" aria-label="Paginación">
          <button className={navBtn} type="button" disabled={page === 1} onClick={() => onPage(page - 1)} title="Página anterior">
            <ChevronLeft size={18} />
          </button>

          {pageList(page, pages).map((n) =>
            typeof n === "string" ? (
              <span className="px-[0.2rem]" key={n}>
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                aria-current={n === page ? "page" : undefined}
                onClick={() => onPage(n)}
                className={`h-[2.3rem] min-w-[2.3rem] rounded-[0.7rem] border border-transparent font-bold tabular-nums transition ${
                  n === page
                    ? "bg-linear-to-br from-accent to-accent-2 text-[#160c08]"
                    : "text-muted hover:border-line hover:text-fg"
                }`}
              >
                {n}
              </button>
            )
          )}

          <button className={navBtn} type="button" disabled={page === pages} onClick={() => onPage(page + 1)} title="Página siguiente">
            <ChevronRight size={18} />
          </button>
        </nav>
      )}

      <label className="inline-flex items-center gap-[0.6rem] max-sm:justify-center">
        Por página
        <select
          value={limit}
          onChange={(event) => onLimit(Number(event.target.value))}
          className="rounded-[0.7rem] border border-line bg-panel-solid/80 px-[0.7rem] py-[0.45rem] text-fg"
        >
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

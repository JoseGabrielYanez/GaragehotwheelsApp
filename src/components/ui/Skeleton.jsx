/** Bloque gris con brillo animado (clase .skeleton en index.css). */
export default function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}

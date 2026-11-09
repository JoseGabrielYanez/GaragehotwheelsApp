import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "./BrandMark";
import InstallButton from "../pwa/InstallButton";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/stock", label: "Stock" },
  { to: "/carousel", label: "Carrusel" }
];

const linkClass = ({ isActive }) =>
  `rounded-[0.7rem] px-[1.05rem] py-2 text-[0.9rem] font-semibold transition max-md:flex-1 max-md:text-center ${
    isActive
      ? "bg-glass-hi text-fg shadow-[inset_0_0_0_1px_var(--glass-line)]"
      : "text-muted hover:bg-glass-hi hover:text-fg"
  }`;

/** Barra superior pegada arriba, a todo el ancho, con esquinas redondeadas solo abajo. */
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-20 compact:hidden rounded-b-[1.1rem] border-b border-glass-line bg-glass shadow-[inset_0_-1px_0_var(--glass-hi),0_0.8rem_2.4rem_rgba(0,0,0,0.22)] backdrop-blur-[22px] backdrop-saturate-150">
      <div className="px-page grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-[0.6rem] max-md:grid-cols-[1fr_auto]">
        <BrandMark className="justify-self-start" />

        <div className="flex items-center gap-1 max-md:order-3 max-md:col-span-full">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-[0.6rem] justify-self-end text-[0.9rem] text-muted max-md:order-2">
          <InstallButton className="inline-flex items-center gap-[0.4rem] rounded-[0.7rem] bg-accent/15 px-[0.9rem] py-2 text-[0.85rem] font-bold text-accent transition hover:bg-accent/25" />
          <span className="max-md:hidden">{user?.name}</span>
          <ThemeToggle className="size-[2.3rem] rounded-full border-glass-line bg-transparent" />
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-[0.4rem] rounded-[0.7rem] border border-glass-line px-[0.95rem] py-2 text-[0.88rem] font-semibold text-fg transition hover:bg-glass-hi"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

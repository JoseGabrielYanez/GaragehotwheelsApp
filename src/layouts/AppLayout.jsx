import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";

/** Páginas protegidas: navbar arriba en escritorio, barra inferior flotante en móvil. */
export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="px-page min-h-screen w-full pt-3 pb-12 compact:pt-[calc(0.75rem+env(safe-area-inset-top))] compact:pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

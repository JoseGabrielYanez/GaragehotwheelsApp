import { Camera, Images, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import hotwheelsBg from "../../assets/Login-bg.jpg";
import hwLogo from "../../assets/hw-logo.png";
import BrandMark from "../layout/BrandMark";

const features = [
  { icon: Camera, text: "Foto de cada auto, directo desde el celular" },
  { icon: Sparkles, text: "El fondo de la foto se recorta solo" },
  { icon: Images, text: "Inventario con búsqueda y carrusel 3D" }
];

/** Panel visual de las pantallas públicas: imagen de Hot Wheels con parallax suave. */
export default function AuthShowcase() {
  // Parallax suave: la imagen se desplaza un poco según la posición del mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const x = useTransform(sx, [-1, 1], [-14, 14]);
  const y = useTransform(sy, [-1, 1], [-10, 10]);

  function handleMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
   <aside className="relative isolate flex min-h-[9rem] flex-col gap-12 overflow-hidden bg-black p-[clamp(1.25rem,3vw,2.5rem)] text-white lg:min-h-screen" >
      <motion.img
        src={hotwheelsBg}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ x, y }}
        className=" opacity-50 absolute -inset-[4%] -z-20 size-[108%] max-w-none object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.55),rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.88))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_15%_100%,rgba(255,90,31,0.3),transparent_70%)]" />

      <header className="flex items-center pt-5 justify-between gap-7">
        <BrandMark />
        <img src={hwLogo} alt="Hot Wheels" draggable={false} className="h-9 w-auto" />
      </header>

      <div className="grid gap-9 pt-10 max-lg:hidden">
        {/*<span className="text-xs font-extrabold tracking-[0.18em] text-[#4db6c6] uppercase">Garage de Hot Wheels</span>*/}
        <h2 className="max-w-[18ch] font-sport text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.05] font-extrabold tracking-[-0.01em] italic">
          Tu colección, lista para <em className="text-gradient">correr</em>.
        </h2>
        <p className="max-w-[34ch] leading-relaxed text-white/75">
          Fotografía cada auto, deja que el fondo se recorte solo y encuéntralo en segundos.
        </p>

        <ul className="mt-2 grid gap-3">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-[0.95rem] text-white/85">
              <span className="grid size-9 flex-none place-items-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
                <Icon size={18} className="text-accent-2" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

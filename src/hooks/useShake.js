import { useAnimationControls } from "framer-motion";
import { useCallback } from "react";

/** Sacudida horizontal para un formulario cuando hay un error (framer-motion). */
export function useShake() {
  const controls = useAnimationControls();

  const shake = useCallback(
    () => controls.start({ x: [0, -10, 10, -8, 8, -4, 0], transition: { duration: 0.45 } }),
    [controls]
  );

  return { controls, shake };
}

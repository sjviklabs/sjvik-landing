import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $motion } from "./store";

/**
 * Combined reduced-motion check.
 * Returns true if either:
 *   - the user toggled the nanostore $motion to "off" (via Tweaks panel / ⌘K), or
 *   - the OS reports prefers-reduced-motion: reduce.
 *
 * Widgets should use this to pause animations and intervals. CSS transitions
 * are handled globally in global.css via the same two signals.
 */
export function useReducedMotion(): boolean {
  const motion = useStore($motion);
  const [osReduce, setOsReduce] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setOsReduce(mq.matches);
    const onChange = (ev: MediaQueryListEvent) => setOsReduce(ev.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return motion === "off" || osReduce;
}

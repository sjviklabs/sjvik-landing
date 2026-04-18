import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $theme, $accent, $variant, $motion, resolveTheme } from "./store";

/**
 * StoreSync — invisible island that keeps <html> attributes in lock-step
 * with the 4 nanostores. Mounted once in Layout.astro with client:load.
 *
 * The pre-hydration inline script in Layout sets initial attrs before any
 * CSS paints. Once React hydrates, this component takes over live updates:
 * any store.set() call from CommandPalette / TweaksPanel / programmatic
 * code propagates immediately to the DOM, which re-resolves CSS vars.
 *
 * Also keeps 'auto' theme in sync with prefers-color-scheme changes (the
 * pre-hydration script already wires this; re-wiring post-hydration keeps
 * the behavior consistent if the user never triggered anything else).
 */
export default function StoreSync() {
  const theme = useStore($theme);
  const accent = useStore($accent);
  const variant = useStore($variant);
  const motion = useStore($motion);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolveTheme(theme));
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-variant", variant);
  }, [variant]);

  useEffect(() => {
    document.documentElement.setAttribute("data-motion", motion);
  }, [motion]);

  // Keep 'auto' theme reactive to OS preference changes.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if ($theme.get() === "auto") {
        document.documentElement.setAttribute("data-theme", resolveTheme("auto"));
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return null;
}

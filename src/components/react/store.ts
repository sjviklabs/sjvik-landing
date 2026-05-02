/**
 * Shared state store — nanostores-backed, persisted to localStorage.
 *
 * Used by every React island that needs theme/accent/variant awareness.
 * A matching inline <script is:inline> in Layout.astro reads the same
 * localStorage keys *before* hydration, writing data-theme / data-accent /
 * data-variant / data-motion to <html> — which means CSS tokens settle
 * to the right values before the first paint (no FOUC).
 *
 * Keys are deliberately unprefixed and match the inline script.
 */

import { persistentAtom } from "@nanostores/persistent";

export type Theme = "auto" | "light" | "dark";
export type Accent = "green" | "amber" | "ice" | "mono";
export type Variant = "terminal" | "editorial" | "fieldnotes";
export type Motion = "on" | "off";

/** 'auto' follows prefers-color-scheme; light/dark pin the mode. */
export const $theme = persistentAtom<Theme>("theme", "auto");

/** Default green is the forest-green terminal accent. */
export const $accent = persistentAtom<Accent>("accent", "green");

/** terminal = MOTD typewriter + widgets; editorial = paper grid + serif; fieldnotes = engineering journal. */
export const $variant = persistentAtom<Variant>("variant", "terminal");

/** 'off' disables animations; ALSO respected via prefers-reduced-motion. */
export const $motion = persistentAtom<Motion>("motion", "on");

/** Resolve a theme preference to a concrete 'light' | 'dark'. */
export function resolveTheme(t: Theme): "light" | "dark" {
  if (t === "auto") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    }
    return "dark";
  }
  return t;
}

/** Cycle through theme options: auto -> light -> dark -> auto. */
export function cycleTheme(current: Theme): Theme {
  const order: Theme[] = ["auto", "light", "dark"];
  return order[(order.indexOf(current) + 1) % order.length];
}

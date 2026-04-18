import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  $theme,
  $accent,
  $variant,
  $motion,
  type Theme,
  type Accent,
  type Variant,
  type Motion,
} from "./store";

/**
 * TweaksPanel — floating bottom-right control panel for theme/accent/variant/motion.
 *
 * Visible by default; can be dismissed via the × button and reopened with
 * ⌘K → "Show tweaks" (palette command, added in a follow-up) or by calling
 * window.dispatchEvent(new CustomEvent('open-tweaks')).
 *
 * Nanostores hold state; chip clicks update stores; StoreSync propagates
 * to the DOM. localStorage persists via @nanostores/persistent.
 */

type ChipProps = {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
};

function Chip({ on, onClick, children, label }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className="mono"
      style={{
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 4,
        border: `1px solid ${on ? "var(--green)" : "var(--line)"}`,
        color: on ? "var(--green)" : "var(--fg-mute)",
        background: on ? "color-mix(in oklab, var(--green) 12%, transparent)" : "transparent",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr",
        gap: 10,
        alignItems: "center",
        fontSize: 12,
        padding: "8px 0",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <span className="label">{label}</span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

export default function TweaksPanel() {
  const theme = useStore($theme);
  const accent = useStore($accent);
  const variant = useStore($variant);
  const motion = useStore($motion);
  const [dismissed, setDismissed] = useState(true); // hidden by default; open via event

  useEffect(() => {
    const onOpen = () => setDismissed(false);
    window.addEventListener("open-tweaks", onOpen as EventListener);
    return () => window.removeEventListener("open-tweaks", onOpen as EventListener);
  }, []);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Display tweaks"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 90,
        width: 280,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <header
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--fg-dim)",
          }}
        >
          Tweaks
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="kbd">⌘K</span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Close tweaks panel"
            style={{
              border: 0,
              background: "transparent",
              color: "var(--fg-dim)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      </header>
      <div style={{ padding: "4px 14px 12px" }}>
        <Row label="layout">
          <Chip on={variant === "terminal"} onClick={() => $variant.set("terminal" as Variant)}>
            terminal
          </Chip>
          <Chip on={variant === "editorial"} onClick={() => $variant.set("editorial" as Variant)}>
            editorial
          </Chip>
        </Row>
        <Row label="theme">
          <Chip on={theme === "auto"}  onClick={() => $theme.set("auto" as Theme)}>auto</Chip>
          <Chip on={theme === "light"} onClick={() => $theme.set("light" as Theme)}>light</Chip>
          <Chip on={theme === "dark"}  onClick={() => $theme.set("dark" as Theme)}>dark</Chip>
        </Row>
        <Row label="accent">
          <Chip on={accent === "green"} onClick={() => $accent.set("green" as Accent)}>green</Chip>
          <Chip on={accent === "amber"} onClick={() => $accent.set("amber" as Accent)}>amber</Chip>
          <Chip on={accent === "ice"}   onClick={() => $accent.set("ice" as Accent)}>ice</Chip>
          <Chip on={accent === "mono"}  onClick={() => $accent.set("mono" as Accent)}>mono</Chip>
        </Row>
        <Row label="motion">
          <Chip on={motion === "on"}  onClick={() => $motion.set("on" as Motion)}>on</Chip>
          <Chip on={motion === "off"} onClick={() => $motion.set("off" as Motion)}>off</Chip>
        </Row>
      </div>
    </aside>
  );
}

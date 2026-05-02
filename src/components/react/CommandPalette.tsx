import { useEffect, useMemo, useRef, useState } from "react";
import { $theme, $accent, $variant, $motion } from "./store";
import type { Accent, Motion, Theme, Variant } from "./store";
import { CONTACT } from "../../data/content";

/**
 * CommandPalette — ⌘K / Ctrl+K modal with fuzzy search + keyboard nav.
 *
 * Opens via:
 *   - keyboard: Meta+K or Ctrl+K anywhere on the page
 *   - programmatic: window.dispatchEvent(new CustomEvent('open-palette'))
 *
 * Closes via Escape, backdrop click, or after running a command.
 *
 * Commands mutate nanostores directly or perform navigation. Theme/accent/
 * variant/motion changes propagate through StoreSync to the DOM, and
 * localStorage is persisted automatically by @nanostores/persistent.
 *
 * Nav commands scroll to same-page anchors when present; otherwise fall
 * back to full navigation so /experience etc. still work from any page.
 */

type CommandKind = "nav" | "action" | "theme" | "accent" | "layout" | "motion";
type Command = {
  id: string;
  label: string;
  kind: CommandKind;
  hint?: string;
  run: () => void;
};

function scrollToOrNavigate(hash: string, fallback: string) {
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${hash}`);
  } else {
    window.location.href = fallback;
  }
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Open via keyboard shortcut or custom event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onCustom as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onCustom as EventListener);
    };
  }, []);

  // Focus management: save previously focused element on open, restore on close.
  // Focus trap: Tab cycles only within the dialog while open.
  useEffect(() => {
    if (open) {
      setQ("");
      lastFocusRef.current = document.activeElement as HTMLElement | null;
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    } else {
      // Restore focus to whoever triggered the palette (e.g. the ⌘K button).
      lastFocusRef.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    setSel(0);
  }, [q, open]);

  const commands = useMemo<Command[]>(
    () => [
      // ── nav ───────────────────────────────────────────
      {
        id: "go-home",
        label: "Go: Home",
        kind: "nav",
        hint: "G H",
        run: () => scrollToOrNavigate("home", "/"),
      },
      {
        id: "go-work",
        label: "Go: Work",
        kind: "nav",
        hint: "G W",
        run: () => scrollToOrNavigate("work", "/experience"),
      },
      {
        id: "go-proj",
        label: "Go: Projects",
        kind: "nav",
        hint: "G P",
        run: () => scrollToOrNavigate("projects", "/projects"),
      },
      {
        id: "go-guides",
        label: "Go: Guides",
        kind: "nav",
        hint: "G U",
        run: () => scrollToOrNavigate("guides", "/guides"),
      },
      {
        id: "go-contact",
        label: "Go: Contact",
        kind: "nav",
        hint: "G C",
        run: () => scrollToOrNavigate("contact", "/about"),
      },
      {
        id: "go-noc",
        label: "Go: NOC Architecture",
        kind: "nav",
        run: () => {
          window.location.href = "/noc/";
        },
      },

      // ── actions ──────────────────────────────────────
      {
        id: "resume",
        label: "Download résumé (PDF)",
        kind: "action",
        hint: "⇧ R",
        run: () => window.open(CONTACT.resumeUrl, "_blank"),
      },
      {
        id: "email",
        label: `Email — ${CONTACT.email}`,
        kind: "action",
        run: () => (window.location.href = `mailto:${CONTACT.email}`),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        kind: "action",
        run: () =>
          window.open(CONTACT.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "github",
        label: "Open GitHub — sjviklabs",
        kind: "action",
        run: () => window.open(CONTACT.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "gumroad",
        label: "Open Gumroad — guides",
        kind: "action",
        run: () =>
          window.open(
            "https://stevenjvik.gumroad.com",
            "_blank",
            "noopener,noreferrer",
          ),
      },

      // ── theme ─────────────────────────────────────────
      {
        id: "t-auto",
        label: "Theme: Auto (follow OS)",
        kind: "theme",
        run: () => $theme.set("auto" as Theme),
      },
      {
        id: "t-light",
        label: "Theme: Light",
        kind: "theme",
        run: () => $theme.set("light" as Theme),
      },
      {
        id: "t-dark",
        label: "Theme: Dark",
        kind: "theme",
        run: () => $theme.set("dark" as Theme),
      },

      // ── accent ────────────────────────────────────────
      {
        id: "a-green",
        label: "Accent: Green (default)",
        kind: "accent",
        run: () => $accent.set("green" as Accent),
      },
      {
        id: "a-amber",
        label: "Accent: Amber",
        kind: "accent",
        run: () => $accent.set("amber" as Accent),
      },
      {
        id: "a-ice",
        label: "Accent: Ice",
        kind: "accent",
        run: () => $accent.set("ice" as Accent),
      },
      {
        id: "a-mono",
        label: "Accent: Mono",
        kind: "accent",
        run: () => $accent.set("mono" as Accent),
      },

      // ── layout ────────────────────────────────────────
      {
        id: "v-terminal",
        label: "Layout: Terminal (MOTD + widgets)",
        kind: "layout",
        run: () => $variant.set("terminal" as Variant),
      },
      {
        id: "v-editorial",
        label: "Layout: Editorial (paper + serif)",
        kind: "layout",
        run: () => $variant.set("editorial" as Variant),
      },
      {
        id: "v-fieldnotes",
        label: "Layout: Field Notes (engineering journal)",
        kind: "layout",
        run: () => $variant.set("fieldnotes" as Variant),
      },

      // ── motion ────────────────────────────────────────
      {
        id: "m-on",
        label: "Motion: On",
        kind: "motion",
        run: () => $motion.set("on" as Motion),
      },
      {
        id: "m-off",
        label: "Motion: Off (freeze widgets)",
        kind: "motion",
        run: () => $motion.set("off" as Motion),
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(s) || c.kind.includes(s),
    );
  }, [q, commands]);

  if (!open) return null;

  const run = (cmd: Command) => {
    cmd.run();
    setOpen(false);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSel((s) => Math.min(filtered.length - 1, s + 1));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSel((s) => Math.max(0, s - 1));
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (filtered[sel]) run(filtered[sel]);
        }
        // Focus trap — Tab cycles within the dialog.
        if (e.key === "Tab" && dialogRef.current) {
          const focusables = Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(
              'input, button, [tabindex]:not([tabindex="-1"]), [role="option"]',
            ),
          ).filter((el) => !el.hasAttribute("disabled"));
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement as HTMLElement | null;
          if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "color-mix(in oklab, var(--ink) 70%, transparent)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "start center",
        paddingTop: "15vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(620px, 92vw)",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px color-mix(in oklab, var(--green) 12%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: "1px solid var(--line)",
            gap: 10,
          }}
        >
          <span className="mono" style={{ color: "var(--green)" }}>
            ❯
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search commands — type, navigate, theme…"
            aria-label="Search commands"
            style={{
              flex: 1,
              border: 0,
              padding: 0,
              background: "transparent",
              fontSize: 15,
              outline: "none",
            }}
          />
          <span className="kbd">esc</span>
        </div>
        <div
          style={{ maxHeight: 360, overflow: "auto", padding: "6px 0" }}
          role="listbox"
        >
          {filtered.length === 0 && (
            <div
              className="mono"
              style={{ padding: 20, color: "var(--fg-dim)", fontSize: 12 }}
            >
              no commands match "{q}"
            </div>
          )}
          {filtered.map((c, i) => (
            <div
              key={c.id}
              role="option"
              aria-selected={i === sel}
              onMouseEnter={() => setSel(i)}
              onClick={() => run(c)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                background: i === sel ? "var(--surface-2)" : "transparent",
                borderLeft: `2px solid ${i === sel ? "var(--green)" : "transparent"}`,
                cursor: "pointer",
                fontSize: 13.5,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--fg-dim)",
                    textTransform: "uppercase",
                    width: 52,
                  }}
                >
                  {c.kind}
                </span>
                <span>{c.label}</span>
              </div>
              {c.hint && <span className="kbd">{c.hint}</span>}
            </div>
          ))}
        </div>
        <div
          className="mono"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 14px",
            borderTop: "1px solid var(--line)",
            fontSize: 10.5,
            color: "var(--fg-dim)",
            letterSpacing: "0.06em",
          }}
        >
          <span>↑↓ navigate · ↵ select · esc close</span>
          <span>
            {filtered.length}/{commands.length}
          </span>
        </div>
      </div>
    </div>
  );
}

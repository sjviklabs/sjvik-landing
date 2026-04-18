import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * SocFeed — live-feel security ops ticker.
 *
 * Rolls pseudo-random events from a small pool flavored to match the SJVIK NOC
 * (Wazuh / Proxmox / Loki / AdGuard / Tailscale) every 2.4–4.2s. When motion
 * is reduced, shows an initial static snapshot and doesn't tick.
 */

type Severity = "INFO" | "WARN" | "CRIT" | "OK";
type Event = { id: number; t: Date; sev: Severity; src: string; msg: string };

const EVENT_POOL: Array<Pick<Event, "sev" | "src" | "msg">> = [
  { sev: "INFO", src: "edr/endpoint-07", msg: "beacon handshake ok" },
  { sev: "WARN", src: "firewall/wan", msg: "rate-limit: 412 reqs from 45.9.148.12" },
  { sev: "INFO", src: "cron/backup", msg: "pbs snapshot rotated — 1.2GB" },
  { sev: "WARN", src: "auth/ssh", msg: "3 failed logins → 91.240.118.172" },
  { sev: "INFO", src: "loki/index", msg: "hot bucket sealed — 24.8M events" },
  { sev: "CRIT", src: "wazuh/host-11", msg: "powershell → base64 encoded payload" },
  { sev: "INFO", src: "adguard/dns", msg: "blocklist refreshed — 1.4M domains" },
  { sev: "OK", src: "incident/ir-044", msg: "contained. closing ticket" },
  { sev: "WARN", src: "traefik/lan", msg: "slow upstream — api.internal 812ms" },
  { sev: "INFO", src: "vuln/scan", msg: "scan complete — 0 critical" },
  { sev: "OK", src: "ansible/play", msg: "site.yml converged — 16 hosts" },
  { sev: "WARN", src: "mail/filter", msg: "quarantined: phish(cred-theft) ×7" },
  { sev: "INFO", src: "tailscale/mesh", msg: "peer re-advertised — lab-02" },
  { sev: "OK", src: "grafana/alert", msg: "disk warning cleared — pbs-01" },
];

const SEV_COLOR: Record<Severity, string> = {
  INFO: "var(--fg-dim)",
  OK: "var(--green)",
  WARN: "var(--amber)",
  CRIT: "var(--red)",
};

const fmtTime = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

function makeEvent(now = Date.now()): Event {
  const pick = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
  return { ...pick, id: now, t: new Date(now) };
}

export default function SocFeed() {
  const reduced = useReducedMotion();
  const [events, setEvents] = useState<Event[]>(() => {
    const now = Date.now();
    return Array.from({ length: 7 }, (_, i) => makeEvent(now - i * 3200));
  });

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const schedule = () => {
      if (cancelled) return;
      const delay = 2400 + Math.random() * 1800;
      setTimeout(() => {
        if (cancelled) return;
        setEvents((prev) => [makeEvent(), ...prev].slice(0, 8));
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      cancelled = true;
    };
  }, [reduced]);

  return (
    <div className="frame" style={{ height: "100%" }}>
      <div className="frame-head">
        <div className="left">
          <span className="pill" style={{ padding: "2px 8px", border: 0 }}>
            <span className="led" />
            {reduced ? "static" : "live"}
          </span>
          <span>/ops/feed</span>
        </div>
        <span>tail -f</span>
      </div>
      <div
        className="frame-body"
        style={{
          padding: "10px 0",
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          lineHeight: 1.9,
        }}
      >
        {events.map((e, i) => (
          <div
            key={e.id}
            style={{
              display: "grid",
              gridTemplateColumns: "74px 56px 1fr",
              gap: 10,
              padding: "2px 16px",
              opacity: 1 - i * 0.08,
              color: "var(--fg-mute)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ color: "var(--fg-dim)" }}>{fmtTime(e.t)}</span>
            <span style={{ color: SEV_COLOR[e.sev], fontWeight: 600 }}>{e.sev}</span>
            <span>
              <span style={{ color: "var(--fg-dim)" }}>{e.src}</span>
              &nbsp;{e.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

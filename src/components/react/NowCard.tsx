import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * NowCard — live Pacific Time clock + status rows for the terminal hero.
 *
 * Status rows are Steve's real current state (location, availability, focus,
 * stack, degree). The clock ticks every second; when motion is reduced it
 * shows the initial render time without updating.
 */

function StatusRow({ label, value, hi }: { label: string; value: string; hi?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: 16,
        fontSize: 13.5,
        alignItems: "baseline",
      }}
    >
      <span className="label">{label}</span>
      <span style={{ color: hi ? "var(--green)" : "var(--fg)" }}>{value}</span>
    </div>
  );
}

export default function NowCard() {
  const reduced = useReducedMotion();
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, [reduced]);

  const pt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(time);

  return (
    <div className="frame marks" style={{ height: "100%" }}>
      <span className="tr"></span>
      <span className="bl"></span>
      <div className="frame-head">
        <div className="left">
          <span>/status</span>
        </div>
        <span className="mono">{pt} PT</span>
      </div>
      <div className="frame-body" style={{ padding: 18, display: "grid", gap: 12 }}>
        <StatusRow label="location" value="Seattle, WA" />
        <StatusRow
          label="availability"
          value="open to cybersecurity, DevOps, infra roles"
          hi
        />
        <StatusRow label="focus" value="incident response · infra hardening · SJVIK NOC" />
        <StatusRow
          label="stack"
          value="Splunk · Wazuh · Proxmox · Ansible · Loki · Claude Code"
        />
        <StatusRow label="degree" value="B.S. Cybersecurity — WGU, in progress" />
      </div>
    </div>
  );
}

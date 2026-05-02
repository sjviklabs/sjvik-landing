import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * UptimeGrid — rolling 40-tick sparkline + 5 service rows with state + latency.
 *
 * Service list is decorative (no real probe happens in the browser); values
 * approximate steady state from the lab's Uptime Kuma dashboard. When motion
 * is reduced, the sparkline freezes on its initial values.
 */

type ServiceState = "ok" | "deg";
type Service = { name: string; state: ServiceState; lat: number };

const SERVICES: Service[] = [
  { name: "stevenjvik.tech", state: "ok", lat: 42 },
  { name: "preview.stevenjvik.tech", state: "ok", lat: 58 },
  { name: "sjvik-labs/github", state: "ok", lat: 118 },
  { name: "gumroad/stevenjvik", state: "ok", lat: 210 },
  { name: "tailscale/mesh", state: "ok", lat: 22 },
];

function Spark({
  data,
  color = "var(--green)",
  height = 28,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block" }}
      aria-hidden="true"
    >
      <polyline fill="none" stroke={color} strokeWidth="1" points={pts} />
    </svg>
  );
}

export default function UptimeGrid() {
  const reduced = useReducedMotion();
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 40 + Math.random() * 40),
  );

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setData((d) => [...d.slice(1), 40 + Math.random() * 40]);
    }, 1800);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="frame" style={{ height: "100%" }}>
      <div className="frame-head">
        <div className="left">
          <span>uptime · 90d</span>
        </div>
        <span className="accent">99.982%</span>
      </div>
      <div className="frame-body" style={{ padding: 14 }}>
        <div style={{ marginBottom: 10 }}>
          <Spark data={data} height={36} />
          <div
            className="mono"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "var(--fg-dim)",
              marginTop: 4,
            }}
          >
            <span>–90d</span>
            <span>req/s</span>
            <span>now</span>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
          {SERVICES.map((s) => (
            <div
              key={s.name}
              className="mono"
              style={{
                display: "grid",
                gridTemplateColumns: "10px 1fr auto",
                gap: 10,
                padding: "4px 0",
                fontSize: 11.5,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 99,
                  marginTop: 5,
                  background:
                    s.state === "ok" ? "var(--green)" : "var(--amber)",
                  boxShadow: `0 0 0 3px color-mix(in oklab, ${
                    s.state === "ok" ? "var(--green)" : "var(--amber)"
                  } 22%, transparent)`,
                }}
              />
              <span style={{ color: "var(--fg-mute)" }}>{s.name}</span>
              <span style={{ color: "var(--fg-dim)" }}>{s.lat}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

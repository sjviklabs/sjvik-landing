import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Typewriter — types `lines` one character at a time with realistic jitter.
 * Calls `onDone` after the final line completes.
 *
 * When useReducedMotion() is true, renders all lines instantly with no
 * animation and calls onDone on the next tick.
 */

type Props = {
  lines: readonly string[];
  className?: string;
  onDone?: () => void;
};

export default function Typewriter({ lines, className, onDone }: Props) {
  const reduced = useReducedMotion();
  const [ln, setLn] = useState(0);
  const [col, setCol] = useState(0);

  useEffect(() => {
    if (reduced) {
      setLn(lines.length);
      queueMicrotask(() => onDone?.());
      return;
    }
    if (ln >= lines.length) {
      onDone?.();
      return;
    }
    if (col > lines[ln].length) {
      const t = setTimeout(() => {
        setLn((l) => l + 1);
        setCol(0);
      }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCol((c) => c + 1), 18 + Math.random() * 30);
    return () => clearTimeout(t);
  }, [ln, col, lines, reduced, onDone]);

  if (reduced) {
    return (
      <div className={className}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {lines.slice(0, ln).map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      {ln < lines.length && (
        <div>
          {lines[ln].slice(0, col)}
          <span className="caret" />
        </div>
      )}
    </div>
  );
}

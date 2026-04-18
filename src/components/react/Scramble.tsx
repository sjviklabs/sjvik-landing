import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Scramble — crypt-glyph reveal animation. Fires once on mount (and on
 * `trigger` change) to decode random glyphs into the target string.
 *
 * Honors useReducedMotion (nanostore $motion + prefers-reduced-motion):
 * when reduced, jumps straight to the target string with no animation.
 */

type Props = {
  children: string;
  trigger?: unknown;
  duration?: number;
  className?: string;
};

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";

export function useScramble(target: string, trigger?: unknown, duration = 900): string {
  const reduced = useReducedMotion();
  const [text, setText] = useState("");
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (reduced) {
      setText(target);
      return;
    }

    type Step = { from: string; to: string; start: number; end: number; char: string };
    const prev = textRef.current;
    const len = Math.max(target.length, prev.length);
    const queue: Step[] = [];
    for (let i = 0; i < len; i++) {
      const from = prev[i] || "";
      const to = target[i] || "";
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30) + 10;
      queue.push({ from, to, start, end, char: "" });
    }

    let frame = 0;
    let raf = 0;
    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        const step = queue[i];
        if (frame >= step.end) {
          complete++;
          output += step.to;
        } else if (frame >= step.start) {
          if (!step.char || Math.random() < 0.28) {
            step.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          output += `<span style="color:var(--green-soft)">${step.char}</span>`;
        } else {
          output += step.from;
        }
      }
      setText(output);
      if (complete < queue.length) {
        frame++;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, [target, trigger, reduced, duration]);

  return reduced ? target : text;
}

export default function Scramble({ children, trigger, duration, className }: Props) {
  const html = useScramble(children, trigger, duration);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

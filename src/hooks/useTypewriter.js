import { useEffect, useState } from 'react';
import { IS_TEST } from '../lib/env.js';

/** Pure step function — exported for unit testing. */
export function nextFrame({ lineIndex, text, deleting }, lines) {
  const full = lines[lineIndex % lines.length];
  if (!deleting && text === full) return { lineIndex, text, deleting: true, pause: true };
  if (deleting && text === '') return { lineIndex: (lineIndex + 1) % lines.length, text: '', deleting: false, pause: false };
  const next = deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1);
  return { lineIndex, text: next, deleting, pause: false };
}

export function useTypewriter(lines, { typeMs = 55, deleteMs = 28, holdMs = 1800 } = {}) {
  const [state, setState] = useState(() =>
    IS_TEST ? { lineIndex: 0, text: lines[0], deleting: false } : { lineIndex: 0, text: '', deleting: false });

  useEffect(() => {
    if (IS_TEST) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setState({ lineIndex: 0, text: lines[0], deleting: false }); return undefined; }
    const full = lines[state.lineIndex % lines.length];
    const delay = !state.deleting && state.text === full ? holdMs : state.deleting ? deleteMs : typeMs;
    const t = setTimeout(() => setState((s) => nextFrame(s, lines)), delay);
    return () => clearTimeout(t);
  }, [state, lines, typeMs, deleteMs, holdMs]);

  return state.text;
}

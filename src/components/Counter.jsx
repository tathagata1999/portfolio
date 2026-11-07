import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { IS_TEST } from '../lib/env.js';

export default function Counter({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(IS_TEST ? to : 0);

  useEffect(() => {
    if (!inView || IS_TEST) return undefined;
    if (reduce) { setVal(to); return undefined; }
    let raf; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return <span ref={ref}>{val}{suffix}</span>;
}

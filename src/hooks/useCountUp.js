import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const frameRef = useRef();
  const previousTargetRef = useRef(0);

  useEffect(() => {
    const from = previousTargetRef.current;
    const to = Number.isFinite(Number(target)) ? Number(target) : 0;
    const startedAt = performance.now();

    cancelAnimationFrame(frameRef.current);

    const tick = (now) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const next = from + (to - from) * eased;

      setValue(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        previousTargetRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [duration, target]);

  return value;
}

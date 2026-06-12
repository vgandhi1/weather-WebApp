import React, { useEffect, useMemo, useState } from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

/**
 * Subtle precipitation particles layered behind the dashboard.
 * Renders nothing for calm conditions or when reduced motion is requested.
 */
const WeatherEffects = ({ condition }) => {
  const reduced = usePrefersReducedMotion();

  const type = useMemo(() => {
    const c = (condition || '').toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('thunder') || c.includes('storm')) {
      return 'rain';
    }
    if (c.includes('snow') || c.includes('sleet')) return 'snow';
    return null;
  }, [condition]);

  const particles = useMemo(() => {
    if (!type) return [];
    const count = type === 'rain' ? 60 : 40;
    // Deterministic, seeded pseudo-random (Math.sin is pure) so generation stays
    // idempotent across renders — no Math.random during render.
    const rand = (n) => {
      const x = Math.sin(n) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      i,
      left: rand(i + 1) * 100,
      delay: rand(i + 101) * (type === 'rain' ? 1.2 : 4),
      duration: type === 'rain' ? 0.5 + rand(i + 211) * 0.6 : 4 + rand(i + 211) * 4,
      drift: Math.round(rand(i + 307) * 40 - 20),
    }));
  }, [type]);

  if (reduced || !type) return null;

  return (
    <div className={`wx-fx wx-fx--${type}`} aria-hidden>
      {particles.map((p) => (
        <span
          key={p.i}
          className="wx-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
};

export default WeatherEffects;

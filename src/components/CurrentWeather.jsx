import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudSun } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const WeatherIcon = ({ icon, size = 64 }) => {
  switch (icon) {
    case 'sun':
      return <Sun size={size} color="#FDB813" aria-hidden />;
    case 'cloud':
      return <Cloud size={size} color="currentColor" aria-hidden />;
    case 'cloud-rain':
      return <CloudRain size={size} color="currentColor" aria-hidden />;
    case 'cloud-sun':
      return <CloudSun size={size} color="currentColor" aria-hidden />;
    default:
      return <Cloud size={size} color="currentColor" aria-hidden />;
  }
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

const CurrentWeather = ({ data, unit }) => {
  const reducedMotion = usePrefersReducedMotion();
  if (!data) return null;

  const windSpeed =
    unit === 'F' ? `${Math.round(data.windSpeed * 2.237)} mph` : `${Math.round(data.windSpeed * 3.6)} km/h`;

  const displayTemp = Math.round(unit === 'F' ? (data.temp * 9) / 5 + 32 : data.temp);

  const getLocalTime = () => {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const cityTime = utc + data.timezone * 1000;
    return new Date(cityTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const inner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="glass-panel--elevated current-hero-inner"
    >
      <div style={{ marginBottom: '1rem', transform: 'translateZ(20px)' }}>
        <WeatherIcon icon={data.icon} size={80} />
      </div>

      <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: '0.25rem', textAlign: 'center' }}>
        {data.name}
        {data.state ? `, ${data.state}` : ''}
        {data.country ? `, ${data.country}` : ''}
      </h2>
      <p style={{ fontSize: 'var(--text-sm)', opacity: 0.82, marginBottom: '0.5rem' }}>
        Local time: {getLocalTime()}
      </p>

      <h1
        style={{
          fontSize: 'var(--text-hero)',
          fontWeight: 700,
          marginBottom: '0.35rem',
          lineHeight: 1.05,
        }}
        className="text-shadow"
      >
        {displayTemp}°{unit}
      </h1>

      <p style={{ fontSize: 'var(--text-lg)', marginBottom: '1.5rem', opacity: 0.9, textTransform: 'capitalize' }}>
        {data.description}
      </p>

      <div className="current-hero-metrics">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-sm)', opacity: 0.85 }}>
            <Droplets size={20} style={{ color: 'rgba(120, 200, 255, 0.95)' }} aria-hidden />
            <span>Humidity</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>{data.humidity}%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-sm)', opacity: 0.85 }}>
            <Wind size={20} style={{ color: 'rgba(255,255,255,0.75)' }} aria-hidden />
            <span>Wind</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>{windSpeed}</span>
        </div>
      </div>
    </motion.div>
  );

  if (reducedMotion) {
    return (
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '1.5rem' }}>{inner}</div>
    );
  }

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      scale={1.02}
      transitionSpeed={2000}
      perspective={500}
      style={{ width: '100%', maxWidth: '480px', marginBottom: '1.5rem' }}
    >
      {inner}
    </Tilt>
  );
};

export default CurrentWeather;

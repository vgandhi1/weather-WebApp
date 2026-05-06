import React from 'react';
import { Gauge, Sun, Eye, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCityWallTime } from '../utils/cityTime';

const WeatherInsights = ({ weather, airQuality, unit }) => {
  if (!weather) return null;

  const feels = Math.round(unit === 'F' ? weather.feelsLike * 9 / 5 + 32 : weather.feelsLike);
  const windDisplay =
    unit === 'F'
      ? `${Math.round(weather.windSpeed * 2.237)} mph`
      : `${Math.round(weather.windSpeed * 3.6)} km/h`;

  const sunrise =
    weather.sunrise != null && weather.timezone != null
      ? formatCityWallTime(weather.sunrise, weather.timezone)
      : '—';
  const sunset =
    weather.sunset != null && weather.timezone != null
      ? formatCityWallTime(weather.sunset, weather.timezone)
      : '—';

  return (
    <motion.section
      className="glass-panel--subtle weather-insights"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      aria-label="Comfort and conditions"
    >
      <h3>
        <Gauge size={18} aria-hidden />
        At a glance
      </h3>
      <div className="insights-grid">
        <div className="insight-tile">
          <div className="label">Feels like</div>
          <div className="value">
            {feels}°{unit}
          </div>
        </div>
        <div className="insight-tile">
          <div className="label">Humidity</div>
          <div className="value">{weather.humidity}%</div>
        </div>
        <div className="insight-tile">
          <div className="label">Wind</div>
          <div className="value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Wind size={16} aria-hidden />
            {windDisplay}
          </div>
        </div>
        {weather.pressure != null && (
          <div className="insight-tile">
            <div className="label">Pressure</div>
            <div className="value">{weather.pressure} hPa</div>
          </div>
        )}
        {weather.visibility != null && (
          <div className="insight-tile">
            <div className="label">Visibility</div>
            <div className="value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={16} aria-hidden />
              {weather.visibility} km
            </div>
          </div>
        )}
        <div className="insight-tile insight-tile--wide">
          <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sun size={14} aria-hidden />
            Sun
          </div>
          <div className="value" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
            ↑ {sunrise} · ↓ {sunset}
          </div>
        </div>
        {airQuality && (
          <div className="insight-tile insight-tile--wide">
            <div className="label">Air quality (OpenWeather)</div>
            <div className="aqi-badge">
              <span>AQI {airQuality.aqi}</span>
              <span style={{ opacity: 0.85 }}>· {airQuality.label}</span>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default WeatherInsights;

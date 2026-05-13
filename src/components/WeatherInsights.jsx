import React, { useId } from 'react';
import { Eye, CloudFog, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCityWallTime } from '../utils/cityTime';

/* ─── Wind Compass ─────────────────────────────────────── */
function WindCompass({ windDeg, windSpeed, windGust, unit }) {
  const arrowDeg = typeof windDeg === 'number' ? windDeg : 0;
  const speedVal = windSpeed != null
    ? unit === 'F' ? `${Math.round(windSpeed * 2.237)} mph` : `${Math.round(windSpeed * 3.6)} km/h`
    : '—';
  const gustVal = windGust != null
    ? unit === 'F' ? `${Math.round(windGust * 2.237)}` : `${Math.round(windGust * 3.6)}`
    : null;
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  return (
    <div className="ins-compass-wrap" aria-label={`Wind from ${arrowDeg}° at ${speedVal}`}>
      <svg className="ins-compass-svg" viewBox="0 0 96 96" aria-hidden>
        {/* Outer ring */}
        <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Tick marks */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          const x1 = 48 + 38 * Math.sin(a);
          const y1 = 48 - 38 * Math.cos(a);
          const x2 = 48 + 43 * Math.sin(a);
          const y2 = 48 - 43 * Math.cos(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />;
        })}
        {/* Cardinal labels */}
        {dirs.map((d, i) => {
          const a = (i * 45 * Math.PI) / 180;
          const x = 48 + 28 * Math.sin(a);
          const y = 48 - 28 * Math.cos(a) + 4;
          const isNS = d === 'N' || d === 'S';
          return (
            <text key={d} x={x} y={y} textAnchor="middle" fill={isNS ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'} fontSize={isNS ? '8' : '6'} fontWeight={isNS ? '700' : '400'}>
              {d}
            </text>
          );
        })}
        {/* Arrow — direction wind is blowing FROM; arrow points toward destination */}
        <g transform={`rotate(${arrowDeg} 48 48)`}>
          <polygon points="48,12 44,48 48,44 52,48" fill="rgba(255,255,255,0.92)" />
          <polygon points="48,84 44,48 48,52 52,48" fill="rgba(255,255,255,0.3)" />
        </g>
        {/* Centre dot */}
        <circle cx="48" cy="48" r="3.5" fill="rgba(255,255,255,0.85)" />
      </svg>
      <div className="ins-compass-speed">
        <span className="ins-compass-speed__val">{speedVal}</span>
        {gustVal && <span className="ins-compass-speed__gust">gust {gustVal}</span>}
      </div>
    </div>
  );
}

/* ─── UV Index Arc ──────────────────────────────────────── */
const UV_STOPS = [
  { max: 2,  label: 'Low',      color: '#4ade80' },
  { max: 5,  label: 'Moderate', color: '#facc15' },
  { max: 7,  label: 'High',     color: '#fb923c' },
  { max: 10, label: 'Very high',color: '#f87171' },
  { max: Infinity, label: 'Extreme', color: '#c084fc' },
];

function uvInfo(uvi) {
  return UV_STOPS.find((s) => uvi < s.max) ?? UV_STOPS[UV_STOPS.length - 1];
}

function UvArc({ uvi }) {
  const arcId = useId().replace(/:/g, '');
  const safeUvi = typeof uvi === 'number' && uvi >= 0 ? uvi : null;
  const frac = safeUvi != null ? Math.min(safeUvi / 12, 1) : 0;
  const info = safeUvi != null ? uvInfo(safeUvi) : { label: '—', color: 'rgba(255,255,255,0.3)' };

  const cx = 60; const cy = 60; const r = 48;
  const startAngle = -Math.PI;
  const endAngle   = 0;
  const totalAng   = endAngle - startAngle;
  const needleAng  = startAngle + totalAng * frac;

  const arcPath = (sa, ea) => {
    const sx = cx + r * Math.cos(sa); const sy = cy + r * Math.sin(sa);
    const ex = cx + r * Math.cos(ea); const ey = cy + r * Math.sin(ea);
    const laf = ea - sa > Math.PI ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${laf} 1 ${ex} ${ey}`;
  };

  const nx = cx + (r - 10) * Math.cos(needleAng);
  const ny = cy + (r - 10) * Math.sin(needleAng);

  return (
    <div className="ins-uv-wrap" aria-label={`UV index ${safeUvi ?? '—'}, ${info.label}`}>
      <svg className="ins-uv-svg" viewBox="0 0 120 68" aria-hidden>
        <defs>
          <linearGradient id={arcId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#4ade80" />
            <stop offset="40%"  stopColor="#facc15" />
            <stop offset="65%"  stopColor="#fb923c" />
            <stop offset="85%"  stopColor="#f87171" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path d={arcPath(startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
        {/* Filled arc */}
        {safeUvi != null && frac > 0 && (
          <path d={arcPath(startAngle, startAngle + totalAng * frac)} fill="none" stroke={`url(#${arcId})`} strokeWidth="8" strokeLinecap="round" />
        )}
        {/* Needle dot */}
        {safeUvi != null && (
          <circle cx={nx} cy={ny} r="5" fill={info.color} stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
        )}
      </svg>
      <div className="ins-uv-label">
        <span className="ins-uv-label__val" style={{ color: info.color }}>
          {safeUvi != null ? safeUvi.toFixed(1) : '—'}
        </span>
        <span className="ins-uv-label__text">{info.label}</span>
      </div>
    </div>
  );
}

/* ─── AQI Gauge ─────────────────────────────────────────── */
const AQI_COLORS = ['', '#4ade80', '#a3e635', '#facc15', '#fb923c', '#f87171'];
const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very poor'];

function AqiGauge({ aqi }) {
  if (!aqi) return null;
  const level = Math.max(1, Math.min(5, aqi.aqi));
  const frac = (level - 1) / 4;
  const color = AQI_COLORS[level];

  return (
    <div className="ins-aqi-wrap">
      <div className="ins-aqi-bar-track">
        {AQI_COLORS.slice(1).map((c, i) => (
          <div
            key={i}
            className="ins-aqi-segment"
            style={{ background: c, opacity: i < level ? 1 : 0.2 }}
          />
        ))}
        <div className="ins-aqi-thumb" style={{ left: `calc(${frac * 100}% - 6px)`, background: color }} />
      </div>
      <div className="ins-aqi-footer">
        <span className="ins-aqi-val" style={{ color }}>{AQI_LABELS[level]}</span>
        <span className="ins-aqi-sub">AQI {level} / 5</span>
      </div>
    </div>
  );
}

/* ─── Dew Point + Fog warning ───────────────────────────── */
function DewPointTile({ dewPointC, tempC, visibilityKm, unit }) {
  const dp = dewPointC != null
    ? Math.round(unit === 'F' ? (dewPointC * 9) / 5 + 32 : dewPointC)
    : null;
  const spread = dewPointC != null && tempC != null ? Math.abs(tempC - dewPointC) : null;
  const fogLikely = spread != null && spread < 2.5 && (visibilityKm == null || visibilityKm < 8);

  return (
    <div className="ins-dew-wrap">
      <div className="ins-dew-row">
        <span className="ins-dew-label">Dew point</span>
        <span className="ins-dew-val">{dp != null ? `${dp}°${unit}` : '—'}</span>
      </div>
      {fogLikely && (
        <div className="ins-fog-badge" role="status">
          <CloudFog size={13} aria-hidden />
          Fog likely
        </div>
      )}
    </div>
  );
}

/* ─── Precipitation tile map ────────────────────────────── */
function PrecipTile({ tileUrl }) {
  if (!tileUrl) return null;
  const { precipUrl, osmUrl } = tileUrl;
  return (
    <div className="ins-map-wrap" aria-label="Local precipitation radar tile">
      {osmUrl && (
        <img
          className="ins-map-base"
          src={osmUrl}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width={256}
          height={256}
        />
      )}
      <img
        className="ins-map-img"
        src={precipUrl}
        alt="Precipitation overlay"
        loading="lazy"
        decoding="async"
        width={256}
        height={256}
      />
      <div className="ins-map-label">
        <Map size={11} aria-hidden />
        Precipitation · © OSM
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
const WeatherInsights = ({ weather, airQuality, oneCallDaily, tileUrl, unit }) => {
  if (!weather) return null;

  const feels = Math.round(unit === 'F' ? (weather.feelsLike * 9) / 5 + 32 : weather.feelsLike);

  const sunrise =
    weather.sunrise != null && weather.timezone != null
      ? formatCityWallTime(weather.sunrise, weather.timezone)
      : '—';
  const sunset =
    weather.sunset != null && weather.timezone != null
      ? formatCityWallTime(weather.sunset, weather.timezone)
      : '—';

  const uvi = oneCallDaily?.uvi ?? null;
  const dewPoint = oneCallDaily?.dewPoint ?? null;
  const windDeg = oneCallDaily?.windDeg ?? weather.windDeg ?? null;
  const windGust = oneCallDaily?.windGust ?? null;

  return (
    <motion.section
      className="glass-panel--subtle weather-insights"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      aria-label="At-a-glance vitals"
    >
      <h3 className="wi-heading">
        At a glance
      </h3>

      <div className="insights-grid insights-grid--vitals">

        {/* Wind compass */}
        <div className="insight-tile insight-tile--compass">
          <div className="label">Wind</div>
          <WindCompass
            windDeg={windDeg}
            windSpeed={weather.windSpeed}
            windGust={windGust}
            unit={unit}
          />
        </div>

        {/* UV arc */}
        <div className="insight-tile insight-tile--uv">
          <div className="label">UV index</div>
          <UvArc uvi={uvi} />
        </div>

        {/* Feels like */}
        <div className="insight-tile">
          <div className="label">Feels like</div>
          <div className="value">{feels}°{unit}</div>
        </div>

        {/* Humidity */}
        <div className="insight-tile">
          <div className="label">Humidity</div>
          <div className="value">{weather.humidity}%</div>
        </div>

        {/* Pressure */}
        {weather.pressure != null && (
          <div className="insight-tile">
            <div className="label">Pressure</div>
            <div className="value">{weather.pressure} hPa</div>
          </div>
        )}

        {/* Visibility + dew point + fog */}
        <div className="insight-tile">
          <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Eye size={13} aria-hidden />
            Visibility
          </div>
          <div className="value">
            {weather.visibility != null ? `${weather.visibility} km` : '—'}
          </div>
          <DewPointTile
            dewPointC={dewPoint}
            tempC={weather.temp}
            visibilityKm={weather.visibility}
            unit={unit}
          />
        </div>

        {/* AQI */}
        {airQuality && (
          <div className="insight-tile insight-tile--wide">
            <div className="label">Air quality</div>
            <AqiGauge aqi={airQuality} />
          </div>
        )}

        {/* Sunrise / sunset */}
        <div className="insight-tile insight-tile--wide">
          <div className="label">Sun</div>
          <div className="value" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
            ↑ {sunrise} &nbsp;·&nbsp; ↓ {sunset}
          </div>
        </div>

        {/* Precipitation tile map */}
        {tileUrl && (
          <div className="insight-tile insight-tile--wide insight-tile--map">
            <PrecipTile tileUrl={tileUrl} />
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default WeatherInsights;

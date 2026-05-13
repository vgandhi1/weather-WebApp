import React, { useId, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { formatCityHourShort } from '../utils/cityTime';

function toDisplayTemp(tempC, unit) {
  if (tempC == null || Number.isNaN(tempC)) return null;
  return Math.round(unit === 'F' ? (tempC * 9) / 5 + 32 : tempC);
}

function formatWindSpeed(windMs, unit) {
  if (windMs == null || !Number.isFinite(windMs)) return '—';
  if (unit === 'F') return `${Math.round(windMs * 2.237)} mph`;
  return `${Math.round(windMs * 3.6)} km/h`;
}

/** OWM `wind_deg` is direction wind comes *from*; rotate arrow to show where air flows. */
function windArrowRotation(windDeg) {
  if (windDeg == null || !Number.isFinite(windDeg)) return 0;
  return ((windDeg + 180) % 360 + 360) % 360;
}

function HourlyTooltip({ active, payload, unit }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const popPct = Math.round((row.pop ?? 0) * 100);
  return (
    <div className="hourly-tooltip">
      <div className="hourly-tooltip__time">{row.labelFull}</div>
      <div className="hourly-tooltip__row">
        {row.tempDisplay != null ? (
          <span>
            {row.tempDisplay}°{unit}
          </span>
        ) : null}
        {popPct > 0 ? <span className="hourly-tooltip__pop">{popPct}% rain</span> : null}
      </div>
    </div>
  );
}

const HourlyForecast = ({ hourlyData, unit, timezoneOffsetSec, surface = 'dark', isFallback = false }) => {
  const gradId = useId().replace(/:/g, '');

  const next24 = useMemo(() => {
    if (!Array.isArray(hourlyData) || hourlyData.length === 0) return [];
    return hourlyData.slice(0, 24);
  }, [hourlyData]);

  const chartRows = useMemo(() => {
    return next24.map((h, index) => {
      const tempDisplay = toDisplayTemp(h.temp, unit);
      const labelFull =
        timezoneOffsetSec != null ? formatCityHourShort(h.dt, timezoneOffsetSec) : new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      return {
        index,
        dt: h.dt,
        tempDisplay,
        pop: h.pop,
        labelFull,
      };
    });
  }, [next24, unit, timezoneOffsetSec]);

  const strokeColor = surface === 'bright' ? 'rgba(26, 31, 46, 0.82)' : 'rgba(255, 255, 255, 0.92)';
  const gridStroke = surface === 'bright' ? 'rgba(26, 31, 46, 0.08)' : 'rgba(255, 255, 255, 0.08)';

  if (next24.length === 0) {
    return (
      <motion.section
        className="glass-panel--subtle hourly-dashboard hourly-dashboard--empty"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        aria-label="Hourly forecast"
      >
        <h3 className="hourly-dashboard__title">24-hour outlook</h3>
        <p className="hourly-dashboard__empty-hint">
          Hourly detail uses OpenWeather One Call 3.0. If this stays empty, confirm your API key has One Call access
          enabled.
        </p>
      </motion.section>
    );
  }

  const temps = chartRows.map((r) => r.tempDisplay).filter((t) => t != null);
  const tMin = Math.min(...temps);
  const tMax = Math.max(...temps);
  const pad = Math.max(2, Math.round((tMax - tMin) * 0.15) || 2);

  return (
    <motion.section
      className="glass-panel--subtle hourly-dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      aria-label="Hourly forecast for the next twenty-four hours"
    >
      <h3 className="hourly-dashboard__title">
        {isFallback ? '3-day outlook' : '24-hour outlook'}
      </h3>
      {isFallback && (
        <p className="hourly-dashboard__interval-note">3-hour intervals · upgrade to One Call 3.0 for hourly detail</p>
      )}

      <div className="hourly-sparkline-wrap">
        <ResponsiveContainer width="100%" height={132}>
          <AreaChart data={chartRows} margin={{ top: 10, right: 6, left: 6, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 150, 90, 0.45)" />
                <stop offset="45%" stopColor="rgba(255, 200, 140, 0.22)" />
                <stop offset="100%" stopColor="rgba(100, 170, 255, 0.12)" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="index"
              ticks={[0, 6, 12, 18, 23]}
              tick={{ fill: surface === 'bright' ? 'rgba(26,31,46,0.55)' : 'rgba(255,255,255,0.55)', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: gridStroke }}
              tickFormatter={(v) => chartRows[Number(v)]?.labelFull ?? ''}
            />
            <YAxis domain={[tMin - pad, tMax + pad]} hide width={0} />
            <Tooltip content={(props) => <HourlyTooltip {...props} unit={unit} />} cursor={{ stroke: gridStroke, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="tempDisplay"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: strokeColor }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="hourly-scroll hourly-container" tabIndex={0}>
        {next24.map((hour, index) => {
          const timeLabel =
            index === 0
              ? 'Now'
              : timezoneOffsetSec != null
                ? formatCityHourShort(hour.dt, timezoneOffsetSec)
                : new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' });
          const tempDisplay = toDisplayTemp(hour.temp, unit);
          const popPct = Math.round((hour.pop ?? 0) * 100);
          const iconUrl = `https://openweathermap.org/img/wn/${hour.iconCode}@2x.png`;
          const windRot = windArrowRotation(hour.windDeg);
          const windLabel = formatWindSpeed(hour.windSpeed, unit);

          return (
            <div
              key={hour.dt}
              className="hourly-card"
              aria-label={`${timeLabel}, ${tempDisplay != null ? `${tempDisplay} degrees ${unit}` : 'temperature unknown'}, ${popPct} percent chance of precipitation, wind ${windLabel}`}
            >
              <span className="hourly-time">{timeLabel}</span>
              <img src={iconUrl} alt={hour.description || 'Forecast'} className="hourly-icon" width={48} height={48} decoding="async" />
              <span className="hourly-temp">
                {tempDisplay != null ? `${tempDisplay}°` : '—'}
              </span>

              <div className="hourly-pop-wrap">
                <div className="hourly-pop-track" aria-hidden>
                  <div
                    className="hourly-pop-bar"
                    style={{ height: `${Math.max(2, (popPct / 100) * 36)}px` }}
                  />
                </div>
                {popPct > 0 ? <span className="hourly-pop-label">{popPct}%</span> : <span className="hourly-pop-label hourly-pop-label--muted">0%</span>}
              </div>

              <div className="hourly-wind" title={hour.description || 'Wind'}>
                {hour.windDeg != null && hour.windSpeed != null ? (
                  <>
                    <ArrowUp className="hourly-wind-arrow" size={16} strokeWidth={2.2} style={{ transform: `rotate(${windRot}deg)` }} aria-hidden />
                    <span className="hourly-wind-speed">{windLabel}</span>
                  </>
                ) : (
                  <span className="hourly-wind-speed">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default HourlyForecast;

import React from 'react';
import { motion } from 'framer-motion';

/** OWM icon → themed emoji for the range-bar row; keeps the list compact. */
function ConditionDot({ iconCode, condition }) {
  const c = (condition || '').toLowerCase();
  if (c.includes('thunder') || c.includes('storm')) return <span aria-label="Thunderstorm">⛈</span>;
  if (c.includes('snow'))                              return <span aria-label="Snow">🌨</span>;
  if (c.includes('rain') || c.includes('drizzle'))    return <span aria-label="Rain">🌧</span>;
  if (c.includes('cloud'))                             return <span aria-label="Cloudy">⛅</span>;
  if (c.includes('clear') || c.includes('sun'))       return <span aria-label="Clear">☀️</span>;
  if (iconCode?.endsWith('n'))                         return <span aria-label="Night">🌙</span>;
  return <span aria-label="Partly cloudy">🌤</span>;
}

function toDisplay(tempC, unit) {
  if (tempC == null) return null;
  return Math.round(unit === 'F' ? (tempC * 9) / 5 + 32 : tempC);
}

function RangeBar({ tempMin, tempMax, globalMin, globalMax, unit }) {
  const dMin = toDisplay(tempMin, unit);
  const dMax = toDisplay(tempMax, unit);
  const gMin = toDisplay(globalMin, unit);
  const gMax = toDisplay(globalMax, unit);

  const span = gMax - gMin || 1;
  const leftPct  = dMin != null ? ((dMin - gMin) / span) * 100 : 0;
  const widthPct = (dMin != null && dMax != null) ? ((dMax - dMin) / span) * 100 : 0;

  return (
    <div className="range-bar-track" aria-hidden>
      <div
        className="range-bar-fill"
        style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 4)}%` }}
      />
    </div>
  );
}

const Forecast = ({ data, dailyOneCall, unit }) => {
  // Merge One Call daily (min/max, iconCode) with the 5-day 3h forecast data
  const rows = React.useMemo(() => {
    if (Array.isArray(dailyOneCall) && dailyOneCall.length > 0) {
      return dailyOneCall.slice(0, 7).map((d) => ({
        day: d.dayLabel,
        tempMin: d.tempMin,
        tempMax: d.tempMax,
        pop: d.pop,
        iconCode: d.iconCode,
        condition: d.condition,
      }));
    }
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map((d) => ({
      day: d.day,
      tempMin: null,
      tempMax: d.temp,
      pop: null,
      iconCode: null,
      condition: d.condition,
    }));
  }, [data, dailyOneCall]);

  if (rows.length === 0) return null;

  const hasRange = rows.some((r) => r.tempMin != null && r.tempMax != null);

  const allMins = rows.map((r) => toDisplay(r.tempMin ?? r.tempMax, unit)).filter((v) => v != null);
  const allMaxs = rows.map((r) => toDisplay(r.tempMax, unit)).filter((v) => v != null);
  const globalMin = allMins.length ? Math.min(...allMins) : 0;
  const globalMax = allMaxs.length ? Math.max(...allMaxs) : 1;

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item      = { hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } };

  return (
    <motion.section
      className="glass-panel--subtle forecast-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      aria-label={hasRange ? 'Seven day forecast' : 'Five day forecast'}
    >
      <h3>{hasRange ? '7-day forecast' : '5-day forecast'}</h3>

      {/* Mobile horizontal scroll — unchanged for small screens */}
      {!hasRange && (
        <div className="forecast-scroll" role="list">
          {rows.map((row, index) => {
            const displayTemp = toDisplay(row.tempMax, unit);
            return (
              <div key={`m-${index}`} className="forecast-day-card" role="listitem">
                <span className="day-label">{row.day}</span>
                <ConditionDot iconCode={row.iconCode} condition={row.condition} />
                <span className="day-temp">{displayTemp != null ? `${displayTemp}°${unit}` : '—'}</span>
                <span className="day-desc">{row.condition}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Range-bar list (One Call daily) */}
      {hasRange && (
        <motion.ol className="forecast-range-list" variants={container} initial="hidden" animate="show" aria-label="Temperature range by day">
          {rows.map((row, index) => {
            const dMin = toDisplay(row.tempMin, unit);
            const dMax = toDisplay(row.tempMax, unit);
            const popPct = row.pop != null ? Math.round(row.pop * 100) : null;
            return (
              <motion.li key={`r-${index}`} className="forecast-range-row" variants={item}>
                <span className="frr-day">{index === 0 ? 'Today' : row.day}</span>
                <span className="frr-icon"><ConditionDot iconCode={row.iconCode} condition={row.condition} /></span>
                {popPct != null && popPct > 0 && (
                  <span className="frr-pop">{popPct}%</span>
                )}
                <span className="frr-low">{dMin != null ? `${dMin}°` : ''}</span>
                <RangeBar
                  tempMin={row.tempMin}
                  tempMax={row.tempMax}
                  globalMin={globalMin}
                  globalMax={globalMax}
                  unit={unit}
                />
                <span className="frr-high">{dMax != null ? `${dMax}°` : '—'}</span>
              </motion.li>
            );
          })}
        </motion.ol>
      )}

      {/* Fallback list for tablet+ when no One Call data */}
      {!hasRange && (
        <motion.div className="forecast-list" variants={container} initial="hidden" animate="show">
          {rows.map((row, index) => {
            const displayTemp = toDisplay(row.tempMax, unit);
            return (
              <motion.div variants={item} key={`d-${index}`} className="forecast-row">
                <span className="row-day">{row.day}</span>
                <div className="row-mid">
                  <ConditionDot iconCode={row.iconCode} condition={row.condition} />
                  <span style={{ opacity: 0.82, fontSize: 'var(--text-sm)' }}>{row.condition}</span>
                </div>
                <span className="row-temp">{displayTemp != null ? `${displayTemp}°${unit}` : '—'}</span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.section>
  );
};

export default Forecast;

import React from 'react';
import { Cloud, Sun, CloudRain, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherIcon = ({ icon, size = 24 }) => {
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

const Forecast = ({ data, unit }) => {
  if (!data) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="glass-panel--subtle forecast-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      aria-label="Five day forecast"
    >
      <h3>5-day forecast</h3>

      {/* Mobile: horizontal scroll */}
      <div className="forecast-scroll" role="list">
        {data.map((day, index) => {
          const displayTemp = Math.round(unit === 'F' ? (day.temp * 9) / 5 + 32 : day.temp);
          return (
            <div key={`m-${index}`} className="forecast-day-card" role="listitem">
              <span className="day-label">{day.day}</span>
              <WeatherIcon icon={day.icon} size={28} />
              <span className="day-temp">
                {displayTemp}°{unit}
              </span>
              <span className="day-desc">{day.condition}</span>
            </div>
          );
        })}
      </div>

      {/* Tablet+: list */}
      <motion.div
        className="forecast-list"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {data.map((day, index) => {
          const displayTemp = Math.round(unit === 'F' ? (day.temp * 9) / 5 + 32 : day.temp);
          return (
            <motion.div variants={item} key={`d-${index}`} className="forecast-row">
              <span className="row-day">{day.day}</span>
              <div className="row-mid">
                <WeatherIcon icon={day.icon} />
                <span style={{ opacity: 0.82, fontSize: 'var(--text-sm)' }}>{day.condition}</span>
              </div>
              <span className="row-temp">
                {displayTemp}°{unit}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default Forecast;

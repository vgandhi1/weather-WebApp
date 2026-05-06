import React from 'react';
import { motion } from 'framer-motion';

const WeatherSkeleton = () => (
  <motion.div
    className="skeleton-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
    role="status"
    aria-live="polite"
    aria-label="Loading weather"
  >
    <div className="skeleton-hero">
      <div className="skeleton-shimmer" />
    </div>
    <div className="skeleton-rows">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </div>
  </motion.div>
);

export default WeatherSkeleton;

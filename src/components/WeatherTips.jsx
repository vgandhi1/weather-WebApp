import React, { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

function tipsForCondition(condition, description) {
  const c = (condition || '').toLowerCase();
  const d = (description || '').toLowerCase();
  const out = [];

  if (c.includes('thunder') || d.includes('storm')) {
    out.push('Stay indoors if lightning is nearby; avoid open fields and tall trees.');
    out.push('Unplug sensitive electronics if storms are severe in your area.');
  } else if (c.includes('rain') || c.includes('drizzle')) {
    out.push('Waterproof layer and grippy shoes help on wet pavement.');
    out.push('Drive slower than usual; braking distance increases on wet roads.');
  } else if (c.includes('snow')) {
    out.push('Dress in layers; cover extremities in cold and wind.');
    out.push('Clear snow from vehicle roof and lights before driving.');
  } else if (c.includes('clear') || c.includes('sun')) {
    out.push('UV can be strong under clear skies—sunscreen and shade breaks help on long outings.');
    out.push('Stay hydrated, especially if you are active outdoors.');
  } else if (c.includes('cloud')) {
    out.push('Layers work well: temperatures can still shift through the day.');
  } else if (c.includes('mist') || c.includes('fog') || d.includes('fog')) {
    out.push('Low visibility—use low beams and extra following distance when driving.');
  } else {
    out.push('Check the hourly trend before outdoor plans; conditions can change quickly.');
  }

  return out.slice(0, 3);
}

const WeatherTips = ({ condition, description }) => {
  const tips = useMemo(
    () => tipsForCondition(condition, description),
    [condition, description]
  );

  return (
    <motion.section
      className="glass-panel--subtle weather-tips"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      aria-label="Quick safety and comfort tips"
    >
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Lightbulb size={18} aria-hidden />
        Quick tips
      </h3>
      <ul>
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </motion.section>
  );
};

export default WeatherTips;

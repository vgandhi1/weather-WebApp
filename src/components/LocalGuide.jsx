import React from 'react';
import { Compass, ExternalLink, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const LocalGuide = ({ items, location }) => {
  if (!items || items.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, x: 12 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.section
      className="glass-panel--subtle"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      style={{ padding: 'var(--spacing-md)', width: '100%' }}
      aria-label="Explore nearby"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)', gap: '0.5rem' }}>
        <Compass size={22} aria-hidden style={{ flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, lineHeight: 1.2 }}>Explore</h3>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              opacity: 0.78,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: '0.2rem',
            }}
          >
            <MapPin size={12} aria-hidden />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
      >
        {items.map((item, index) => (
          <motion.a
            variants={itemVariant}
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="feed-card"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="feed-card-title">{item.title}</span>
            <div className="feed-card-meta" style={{ justifyContent: 'flex-end' }}>
              <span className="source-pill" style={{ marginRight: 'auto', maxWidth: '70%' }}>
                {item.source}
              </span>
              <ExternalLink size={12} aria-hidden />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default LocalGuide;

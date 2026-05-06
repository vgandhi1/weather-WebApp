import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsFeed = ({ news }) => {
  if (!news || news.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0 },
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return 'Just now';
  };

  return (
    <motion.section
      className="glass-panel--subtle news-feed-wrap"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      style={{ padding: 'var(--spacing-md)', width: '100%' }}
      aria-label="Local headlines"
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-sm)', gap: '0.5rem' }}>
        <Newspaper size={20} aria-hidden />
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Local headlines</h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
      >
        {news.map((article, index) => (
          <motion.a
            variants={item}
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`feed-card${article.image ? ' feed-card--thumb' : ''}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {article.image ? (
              <img
                src={article.image}
                alt=""
                className="feed-card-thumb"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="feed-card-title">{article.title}</span>
              <div className="feed-card-meta">
                <span className="source-pill">{article.source || 'News'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {timeAgo(article.pubDate)}
                  <ExternalLink size={12} aria-hidden />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default NewsFeed;

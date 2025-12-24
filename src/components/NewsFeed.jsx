import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsFeed = ({ news }) => {
    if (!news || news.length === 0) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    // Helper to format date relative to now (e.g., "2 hours ago")
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + "h ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + "m ago";
        }
        return "Just now";
    };

    return (
        <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }} // Stagger after forecast
            style={{
                padding: '1.5rem',
                width: '100%',
                maxWidth: '500px',
                marginTop: '1rem'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Newspaper size={20} style={{ marginRight: '0.5rem' }} />
                <h3 style={{ fontSize: '1.2rem' }}>Local Headlines</h3>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
            >
                {news.map((article, index) => (
                    <motion.a
                        variants={item}
                        key={index}
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0.8rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                        }}
                        whileHover={{ background: 'rgba(255,255,255,0.15)', scale: 1.02 }}
                    >
                        <span style={{ fontWeight: '500', fontSize: '0.95rem', marginBottom: '0.4rem', lineHeight: '1.4' }}>
                            {article.title}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
                            <span>{timeAgo(article.pubDate)}</span>
                            <ExternalLink size={12} />
                        </div>
                    </motion.a>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default NewsFeed;

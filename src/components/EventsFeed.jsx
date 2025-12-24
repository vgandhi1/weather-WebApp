import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const EventsFeed = ({ events }) => {
    if (!events || events.length === 0) return null;

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
        hidden: { opacity: 0, x: 20 }, // Slide from right
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }} // Stagger after news
            style={{
                padding: '1.5rem',
                width: '100%',
                height: 'fit-content'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Calendar size={20} style={{ marginRight: '0.5rem' }} />
                <h3 style={{ fontSize: '1.2rem' }}>Events This Week</h3>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
            >
                {events.map((event, index) => (
                    <motion.a
                        variants={item}
                        key={index}
                        href={event.link}
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
                            {event.title}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
                            <ExternalLink size={12} />
                        </div>
                    </motion.a>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default EventsFeed;

import React from 'react';
import { Compass, ExternalLink, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const LocalGuide = ({ items, location }) => {
    // If no items, don't render (keeps layout clean)
    if (!items || items.length === 0) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{
                padding: '1.5rem',
                width: '100%',
                height: 'fit-content'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Compass size={22} style={{ marginRight: '0.5rem' }} />
                <div style={{ overflow: 'hidden' }}>
                    <h3 style={{ fontSize: '1.2rem', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Explore</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <MapPin size={10} style={{ marginRight: 4, minWidth: 10 }} /> {location}
                    </p>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
            >
                {items.map((item, index) => (
                    <motion.a
                        variants={itemVariant}
                        key={index}
                        href={item.link}
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
                            {item.title}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
                            <span style={{ marginRight: '0.5rem', fontSize: '0.75rem' }}>{item.source}</span>
                            <ExternalLink size={12} />
                        </div>
                    </motion.a>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default LocalGuide;

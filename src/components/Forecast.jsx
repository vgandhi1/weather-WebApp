import React from 'react';
import { Cloud, Sun, CloudRain, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherIcon = ({ icon, size = 24 }) => {
    switch (icon) {
        case 'sun': return <Sun size={size} color="#FDB813" />;
        case 'cloud': return <Cloud size={size} color="#fff" />;
        case 'cloud-rain': return <CloudRain size={size} color="#fff" />;
        case 'cloud-sun': return <CloudSun size={size} color="#fff" />;
        default: return <Cloud size={size} color="#fff" />;
    }
};

const Forecast = ({ data, unit }) => {
    if (!data) return null;

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

    return (
        <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
                padding: '1.5rem',
                width: '100%',
                maxWidth: '500px',
                marginTop: '1rem'
            }}
        >
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>5-Day Forecast</h3>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                {data.map((day, index) => {
                    const displayTemp = Math.round(unit === 'F' ? day.temp * 9 / 5 + 32 : day.temp);
                    return (
                        <motion.div variants={item} key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            borderBottom: index < data.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                        }}>
                            <span style={{ width: '50px', fontWeight: '500' }}>{day.day}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <WeatherIcon icon={day.icon} />
                                <span style={{ opacity: 0.8 }}>{day.condition}</span>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>{displayTemp}°{unit}</span>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
};

export default Forecast;

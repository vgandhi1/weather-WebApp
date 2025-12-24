import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudSun } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const WeatherIcon = ({ icon, size = 64 }) => {
    switch (icon) {
        case 'sun': return <Sun size={size} color="#FDB813" />;
        case 'cloud': return <Cloud size={size} color="#fff" />;
        case 'cloud-rain': return <CloudRain size={size} color="#fff" />;
        case 'cloud-sun': return <CloudSun size={size} color="#fff" />;
        default: return <Cloud size={size} color="#fff" />;
    }
};

const CurrentWeather = ({ data, unit }) => {
    if (!data) return null;

    // 1. Calculate Wind Speed based on Unit
    const windSpeed = unit === 'F'
        ? Math.round(data.windSpeed * 2.237) + ' mph'
        : Math.round(data.windSpeed * 3.6) + ' km/h';

    // 2. Calculate Temp based on Unit
    const displayTemp = Math.round(unit === 'F' ? (data.temp * 9 / 5 + 32) : data.temp);

    const getLocalTime = () => {
        const d = new Date();
        const utc = d.getTime() + d.getTimezoneOffset() * 60000;
        const cityTime = utc + data.timezone * 1000;
        return new Date(cityTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            transitionSpeed={2000}
            className="parallax-effect-glare-scale"
            perspective={500}
            style={{ width: '100%', maxWidth: '500px', marginBottom: '2rem' }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-panel"
                style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transformStyle: 'preserve-3d'
                }}
            >
                <div style={{ marginBottom: '1rem', transform: 'translateZ(20px)' }}>
                    <WeatherIcon icon={data.icon} size={80} />
                </div>

                <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem', transform: 'translateZ(30px)' }}>
                    {data.name}{data.state ? `, ${data.state}` : ''}{data.country ? `, ${data.country}` : ''}
                </h2>
                <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '0.5rem', transform: 'translateZ(20px)' }}>
                    Local Time: {getLocalTime()}
                </p>

                <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '0.5rem', transform: 'translateZ(50px)' }} className="text-shadow">
                    {displayTemp}°{unit}
                </h1>

                <p style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: 0.9, transform: 'translateZ(25px)' }}>
                    {data.description}
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    paddingTop: '1.5rem',
                    transform: 'translateZ(20px)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <Droplets size={20} style={{ marginRight: '0.5rem' }} />
                            <span>Humidity</span>
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{data.humidity}%</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <Wind size={20} style={{ marginRight: '0.5rem' }} />
                            <span>Wind</span>
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{windSpeed}</span>
                    </div>
                </div>
            </motion.div>
        </Tilt>
    );
};

export default CurrentWeather;
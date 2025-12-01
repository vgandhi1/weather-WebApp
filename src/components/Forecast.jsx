import React from 'react';
import { Cloud, Sun, CloudRain, CloudSun } from 'lucide-react';

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

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            width: '100%',
            maxWidth: '500px'
        }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>5-Day Forecast</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.map((day, index) => {
                    const displayTemp = unit === 'F' ? Math.round(day.temp * 9 / 5 + 32) : day.temp;
                    return (
                        <div key={index} style={{
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;

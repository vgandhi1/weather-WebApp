import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudSun } from 'lucide-react';

const WeatherIcon = ({ icon, size = 64 }) => {
    switch (icon) {
        case 'sun': return <Sun size={size} color="#FDB813" />;
        case 'cloud': return <Cloud size={size} color="#fff" />;
        case 'cloud-rain': return <CloudRain size={size} color="#fff" />;
        case 'cloud-sun': return <CloudSun size={size} color="#fff" />;
        default: return <Cloud size={size} color="#fff" />;
    }
};

const CurrentWeather = ({ data }) => {
    if (!data) return null;

    return (
        <div className="glass-panel" style={{
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <WeatherIcon icon={data.icon} size={80} />
            </div>

            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="text-shadow">
                {data.temp}°
            </h1>

            <p style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: 0.9 }}>
                {data.description}
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '1.5rem'
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
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{data.windSpeed} km/h</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;

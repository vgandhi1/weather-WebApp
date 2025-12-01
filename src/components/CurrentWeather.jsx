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

const CurrentWeather = ({ data, unit }) => {
    if (!data) return null;

    // 1. Calculate Wind Speed based on Unit
    // Note: This assumes data.windSpeed comes in as meters/second from the API
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

            <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>
                {data.name}{data.state ? `, ${data.state}` : ''}{data.country ? `, ${data.country}` : ''}
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                Local Time: {getLocalTime()}
            </p>

            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="text-shadow">
                {displayTemp}°{unit}
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
                    {/* CHANGED THIS LINE BELOW: Use the calculated variable */}
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{windSpeed}</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
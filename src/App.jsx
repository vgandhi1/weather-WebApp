import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import UnitToggle from './components/UnitToggle';
import { getWeather, getForecast } from './services/weatherApi';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await getWeather(city);
      const forecastData = await getForecast(city);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  useEffect(() => {
    // Load default city on mount
    fetchWeatherData('Chicago, IL');
  }, []);

  return (
    <>
      <div style={{ display: 'flex', width: '100%', maxWidth: '500px', marginBottom: '2rem' }}>
        <SearchBar onSearch={fetchWeatherData} />
        <UnitToggle unit={unit} onToggle={toggleUnit} />
      </div>

      {loading && (
        <div className="glass-panel" style={{ padding: '1rem', color: 'white' }}>
          Loading...
        </div>
      )}

      {error && (
        <div className="glass-panel" style={{ padding: '1rem', color: '#ff6b6b' }}>
          {error}
        </div>
      )}

      {!loading && !error && weather && (
        <>
          <CurrentWeather data={weather} unit={unit} />
          <Forecast data={forecast} unit={unit} />
        </>
      )}
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import { getWeather, getForecast } from './services/weatherApi';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await getWeather(city);
      const forecastData = await getForecast(city);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load default city on mount
    fetchWeatherData('New York');
  }, []);

  return (
    <>
      <SearchBar onSearch={fetchWeatherData} />

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
          <CurrentWeather data={weather} />
          <Forecast data={forecast} />
        </>
      )}
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import NewsFeed from './components/NewsFeed';
import LocalGuide from './components/LocalGuide';
import UnitToggle from './components/UnitToggle';
import { getWeather, getForecast } from './services/weatherApi';
import { fetchNews, fetchAttractions } from './services/newsApi';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [news, setNews] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('F'); // 'F' or 'C'

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(city),
        getForecast(city)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);

      const locationString = [
        weatherData.name,
        weatherData.state,
        weatherData.country
      ].filter(Boolean).join(', ');

      try {
        const [newsData, attractionsData] = await Promise.all([
          fetchNews(locationString),
          fetchAttractions(locationString)
        ]);
        setNews(newsData);
        setAttractions(attractionsData);
      } catch (secondaryErr) {
        console.error("Failed to fetch secondary data", secondaryErr);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'F' ? 'C' : 'F');
  };

  useEffect(() => {
    fetchWeatherData('Bloomington, Illinois, US');
  }, []);

  const getBackgroundStyle = () => {
    if (!weather) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const condition = weather.condition.toLowerCase();

    if (condition.includes('clear') || condition.includes('sun')) return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
    if (condition.includes('cloud')) return 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'linear-gradient(135deg, #536976 0%, #292E49 100%)';
    if (condition.includes('storm')) return 'linear-gradient(135deg, #141E30 0%, #243B55 100%)';
    if (condition.includes('snow')) return 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)';

    return 'linear-gradient(135deg, #1d2671 0%, #c33764 100%)';
  };

  return (
    <>
      <motion.div
        className="background-wrapper"
        initial={false}
        animate={{ background: getBackgroundStyle() }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
      />

      <div style={{ display: 'flex', width: '100%', maxWidth: '500px', marginBottom: '2rem' }}>
        <SearchBar onSearch={fetchWeatherData} />
        <UnitToggle unit={unit} onToggle={toggleUnit} />
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel"
            style={{ padding: '1rem', color: 'white' }}
          >
            Loading...
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel"
            style={{ padding: '1rem', color: '#ff6b6b' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && weather && (
        <motion.div
          className="dashboard-grid"
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 
            MOBILE ORDER: DOM order is 1, 2, 3.
            1. Weather (Center Column on Desktop)
            2. News (Left Column on Desktop)
            3. Guide (Right Column on Desktop)
          */}

          {/* 1. Weather Block */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gridArea: 'weather' }}>
            <CurrentWeather data={weather} unit={unit} />
            <Forecast data={forecast} unit={unit} />
          </div>

          {/* 2. News Block */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gridArea: 'news' }}>
            {news && news.length > 0 ? (
              <NewsFeed news={news} />
            ) : (
              <div className="glass-panel" style={{ padding: '1rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', width: '100%' }}>
                <p>No news available.</p>
              </div>
            )}
          </div>

          {/* 3. Guide Block */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gridArea: 'guide' }}>
            {attractions && attractions.length > 0 ? (
              <LocalGuide
                items={attractions}
                location={[weather.name, weather.state].filter(Boolean).join(', ')}
              />
            ) : (
              <div className="glass-panel" style={{ padding: '1rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', width: '100%' }}>
                <p>No guide available.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default App;

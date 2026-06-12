import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudAlert, RefreshCw, Newspaper, Compass } from 'lucide-react';
import AppHeader from './components/AppHeader';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import NewsFeed from './components/NewsFeed';
import LocalGuide from './components/LocalGuide';
import WeatherSkeleton from './components/WeatherSkeleton';
import WeatherInsights from './components/WeatherInsights';
import WeatherTips from './components/WeatherTips';
import WeatherEffects from './components/WeatherEffects';
import { getWeather, getForecast, getAirQuality, getOneCallHourly, getOneCallDaily, getMapTileUrl, reverseGeo } from './services/weatherApi';
import { fetchNews, fetchAttractions } from './services/newsApi';

const HourlyForecast = lazy(() => import('./components/HourlyForecast'));

function getBackgroundStyle(weather) {
  if (!weather) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const condition = weather.condition.toLowerCase();
  if (condition.includes('clear') || condition.includes('sun')) {
    return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
  }
  if (condition.includes('cloud')) return 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return 'linear-gradient(135deg, #536976 0%, #292E49 100%)';
  }
  if (condition.includes('storm')) return 'linear-gradient(135deg, #141E30 0%, #243B55 100%)';
  if (condition.includes('snow')) return 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)';
  return 'linear-gradient(135deg, #1d2671 0%, #c33764 100%)';
}

/** Drives `data-surface` on shell for text contrast (see `index.css`). */
function getDataSurface(weather) {
  if (!weather) return 'dark';
  const c = weather.condition.toLowerCase();
  if (c.includes('clear') || c.includes('sun')) return 'bright';
  return 'dark';
}

function EmptyBlock({ graphic, title, hint }) {
  return (
    <div className="glass-panel--subtle empty-state" role="status">
      <div className="empty-state__icon">{graphic}</div>
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__hint">{hint}</p>
    </div>
  );
}

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [news, setNews] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [hourlyOneCall, setHourlyOneCall] = useState(null);
  const [forecastHourly, setForecastHourly] = useState(null);
  const [dailyOneCall, setDailyOneCall] = useState(null);
  const [precipTileUrl, setPrecipTileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('F');
  const [locating, setLocating] = useState(false);
  const lastQueryRef = useRef('Bloomington, Illinois, US');

  const fetchWeatherData = useCallback(async (city) => {
    const q = (city || '').trim() || lastQueryRef.current;
    lastQueryRef.current = q;
    setLoading(true);
    setError(null);
    setAirQuality(null);
    setHourlyOneCall(null);
    setForecastHourly(null);
    setDailyOneCall(null);
    setPrecipTileUrl(null);

    try {
      const [weatherData, forecastData] = await Promise.all([getWeather(q), getForecast(q)]);

      setWeather(weatherData);
      setForecast(forecastData.daily);
      setForecastHourly(forecastData.hourlyFallback);
      setPrecipTileUrl(getMapTileUrl(weatherData.lat, weatherData.lon));

      const locationString = [weatherData.name, weatherData.state, weatherData.country]
        .filter(Boolean)
        .join(', ');

      let newsData = [];
      let attractionsData = [];
      let aqi = null;

      try {
        aqi = await getAirQuality(weatherData.lat, weatherData.lon);
      } catch {
        aqi = null;
      }
      setAirQuality(aqi);

      try {
        const [oneHourly, oneDaily] = await Promise.all([
          getOneCallHourly(weatherData.lat, weatherData.lon),
          getOneCallDaily(weatherData.lat, weatherData.lon),
        ]);
        setHourlyOneCall(oneHourly?.hourly ?? null);
        setDailyOneCall(oneDaily ?? null);
      } catch {
        setHourlyOneCall(null);
        setDailyOneCall(null);
      }

      try {
        newsData = await fetchNews(locationString);
      } catch (secondaryErr) {
        console.error('Failed to fetch news', secondaryErr);
      }
      try {
        attractionsData = await fetchAttractions(locationString);
      } catch (secondaryErr) {
        console.error('Failed to fetch local guide', secondaryErr);
      }

      setNews(Array.isArray(newsData) ? newsData : []);
      setAttractions(Array.isArray(attractionsData) ? attractionsData : []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setWeather(null);
      setForecast(null);
      setNews([]);
      setAttractions([]);
      setHourlyOneCall(null);
      setForecastHourly(null);
      setDailyOneCall(null);
      setPrecipTileUrl(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const label = await reverseGeo(pos.coords.latitude, pos.coords.longitude);
          if (label) await fetchWeatherData(label);
        } finally {
          setLocating(false);
        }
      },
      () => {
        // No coordinates are logged (location is sensitive per logging policy).
        console.warn('Geolocation unavailable or permission denied');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, [fetchWeatherData]);

  useEffect(() => {
    fetchWeatherData('Bloomington, Illinois, US');
  }, [fetchWeatherData]);

  const surface = getDataSurface(weather);

  return (
    <>
      <motion.div
        className="background-wrapper"
        initial={false}
        animate={{ background: getBackgroundStyle(weather) }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <WeatherEffects condition={weather?.condition} />

      <div className="app-shell" data-surface={surface}>
        <AppHeader onSearch={fetchWeatherData} onLocate={handleLocate} locating={locating} unit={unit} onUnitChange={setUnit} />

        <AnimatePresence mode="wait">
          {loading && <WeatherSkeleton key="sk" />}
        </AnimatePresence>

        {!loading && error && (
          <motion.div
            key="err"
            role="alert"
            className="glass-panel error-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="error-panel__title">
              <CloudAlert size={22} aria-hidden />
              Couldn&apos;t load weather
            </div>
            <p className="error-panel__body">
              Check the city spelling or your connection, then try again. If the problem continues, try another
              search.
            </p>
            <button type="button" className="error-panel__retry" onClick={() => fetchWeatherData(lastQueryRef.current)}>
              <RefreshCw size={16} style={{ marginRight: '0.4rem', verticalAlign: 'text-bottom' }} aria-hidden />
              Retry
            </button>
          </motion.div>
        )}

        {!loading && !error && weather && (
          <motion.div
            className="dashboard-grid"
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="dash-news-stack">
              <WeatherInsights
                weather={weather}
                airQuality={airQuality}
                oneCallDaily={dailyOneCall}
                tileUrl={precipTileUrl}
                unit={unit}
              />
              {news && news.length > 0 ? (
                <NewsFeed news={news} />
              ) : (
                <EmptyBlock
                  graphic={<Newspaper size={36} strokeWidth={1.25} aria-hidden />}
                  title="No headlines right now"
                  hint="RSS feeds can be rate-limited, or there may be no stories for this search. Try another city in a moment."
                />
              )}
            </div>

            <div className="dash-weather">
              <CurrentWeather data={weather} unit={unit} today={dailyOneCall?.daily?.[0]} />
              <Suspense
                fallback={
                  <div className="glass-panel--subtle hourly-dashboard hourly-dashboard--skeleton" aria-hidden>
                    <div className="hourly-skeleton-bar" />
                    <div className="hourly-skeleton-scroll">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="hourly-skeleton-chip" />
                      ))}
                    </div>
                  </div>
                }
              >
                <HourlyForecast
                  hourlyData={hourlyOneCall ?? forecastHourly}
                  unit={unit}
                  timezoneOffsetSec={weather.timezone}
                  surface={surface}
                  isFallback={!hourlyOneCall && !!forecastHourly}
                />
              </Suspense>
              <Forecast data={forecast} dailyOneCall={dailyOneCall?.daily} unit={unit} />
            </div>

            <div className="dash-guide">
              <WeatherTips condition={weather.condition} description={weather.description} />
              {attractions && attractions.length > 0 ? (
                <LocalGuide items={attractions} location={[weather.name, weather.state].filter(Boolean).join(', ')} />
              ) : (
                <EmptyBlock
                  graphic={<Compass size={36} strokeWidth={1.25} aria-hidden />}
                  title="No explore links yet"
                  hint="Travel and event picks load from the same RSS pipeline as headlines. Try a larger city or search again shortly."
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default App;

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Helper to validate API key
const checkApiKey = () => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('Please set your VITE_OPENWEATHER_API_KEY in the .env file');
  }
};

// Helper to get coordinates and location details
const getGeoLocation = async (query) => {
  const response = await fetch(
    `${GEO_URL}/direct?q=${query}&limit=1&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to resolve location');
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error('City not found');
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    state: data[0].state,
    country: data[0].country
  };
};

export const getWeather = async (query) => {
  checkApiKey();

  // 1. Get exact location details first
  const location = await getGeoLocation(query);

  // 2. Fetch weather using coordinates
  const response = await fetch(
    `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  // Map API response to our app's format
  return {
    name: location.name, // Use the resolved name from Geocoding
    state: location.state, // Include state
    country: location.country,
    timezone: data.timezone,
    temp: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6),
    icon: mapIcon(data.weather[0].icon)
  };
};

export const getForecast = async (query) => {
  checkApiKey();

  // 1. Get exact location details first
  const location = await getGeoLocation(query);

  // 2. Fetch forecast using coordinates
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  const data = await response.json();

  const dailyData = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));

  return dailyData.slice(0, 5).map(day => ({
    day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    temp: Math.round(day.main.temp),
    condition: day.weather[0].main,
    icon: mapIcon(day.weather[0].icon)
  }));
};

// Helper to map OpenWeatherMap icon codes to our internal icon names
const mapIcon = (code) => {
  if (code === '01d') return 'sun';
  if (code === '02d') return 'cloud-sun';
  if (code === '03d' || code === '04d') return 'cloud';
  if (code === '09d' || code === '10d') return 'cloud-rain';
  if (code === '11d') return 'cloud-rain';
  if (code === '13d') return 'cloud';
  if (code === '50d') return 'cloud';
  if (code.endsWith('n')) return 'cloud';
  return 'cloud';
};

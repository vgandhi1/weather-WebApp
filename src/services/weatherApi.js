const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper to validate API key
const checkApiKey = () => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('Please set your VITE_OPENWEATHER_API_KEY in the .env file');
  }
};

export const getWeather = async (city) => {
  checkApiKey();

  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found');
    }
    if (response.status === 401) {
      throw new Error('Invalid API Key. If you just created it, please wait 10-15 minutes for it to activate.');
    }
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  // Map API response to our app's format
  return {
    temp: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    icon: mapIcon(data.weather[0].icon)
  };
};

export const getForecast = async (city) => {
  checkApiKey();

  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  const data = await response.json();

  // Filter for one reading per day (e.g., noon) to get a 5-day forecast
  // The API returns data every 3 hours (8 items per day)
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
  // Day icons
  if (code === '01d') return 'sun';
  if (code === '02d') return 'cloud-sun';
  if (code === '03d' || code === '04d') return 'cloud';
  if (code === '09d' || code === '10d') return 'cloud-rain';
  if (code === '11d') return 'cloud-rain'; // Thunderstorm
  if (code === '13d') return 'cloud'; // Snow (fallback)
  if (code === '50d') return 'cloud'; // Mist

  // Night icons (simplified mapping)
  if (code.endsWith('n')) return 'cloud';

  return 'cloud';
};

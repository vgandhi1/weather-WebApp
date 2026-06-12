const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
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

/**
 * City autocomplete via OpenWeather direct geocoding.
 * Host is fixed (OWM); user input only fills the URL-encoded `q` query param,
 * so this cannot be steered to an arbitrary destination (SSRF-safe).
 * @param {string} query  Partial city name typed by the user
 * @returns {Promise<Array<{name,state,country,lat,lon,label}>>}
 */
export const searchCities = async (query) => {
  checkApiKey();
  const q = (query || '').trim();
  if (q.length < 2) return [];

  let response;
  try {
    response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`
    );
  } catch {
    return [];
  }
  if (!response.ok) return [];

  let data;
  try {
    data = await response.json();
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  return data.map((c) => ({
    name: c.name,
    state: c.state,
    country: c.country,
    lat: c.lat,
    lon: c.lon,
    label: [c.name, c.state, c.country].filter(Boolean).join(', '),
  }));
};

/**
 * Reverse geocode validated coordinates into a searchable "City, State, Country" label.
 * Coordinates come from the browser Geolocation API and are range-checked before use.
 * @returns {Promise<string|null>}
 */
export const reverseGeo = async (lat, lon) => {
  checkApiKey();
  const la = Number(lat);
  const lo = Number(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (la < -90 || la > 90 || lo < -180 || lo > 180) return null;

  let response;
  try {
    response = await fetch(
      `${GEO_URL}/reverse?lat=${la}&lon=${lo}&limit=1&appid=${API_KEY}`
    );
  } catch {
    return null;
  }
  if (!response.ok) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    return null;
  }
  if (!Array.isArray(data) || data.length === 0) return null;

  const c = data[0];
  return [c.name, c.state, c.country].filter(Boolean).join(', ') || null;
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
    name: location.name,
    state: location.state,
    country: location.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    timezone: data.timezone,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility != null ? Math.round(data.visibility / 1000 * 10) / 10 : null,
    windSpeed: data.wind.speed,
    windDeg: data.wind?.deg ?? null,
    sunrise: data.sys?.sunrise ?? null,
    sunset: data.sys?.sunset ?? null,
    icon: mapIcon(data.weather[0].icon)
  };
};

/** Air Quality Index 1–5 from Open-Weather air pollution API (same API key). */
export const getAirQuality = async (lat, lon) => {
  checkApiKey();
  const response = await fetch(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  if (!response.ok) return null;
  const data = await response.json();
  const aqi = data?.list?.[0]?.main?.aqi;
  if (aqi == null || aqi < 1 || aqi > 5) return null;
  const labels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very poor'];
  return { aqi, label: labels[aqi] || 'Unknown' };
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

  // Map 3-hour interval entries to the same shape consumed by HourlyForecast,
  // used as a fallback when One Call 3.0 is unavailable (free-tier keys).
  const hourlyFallback = data.list.slice(0, 24).map((item) => ({
    dt: item.dt,
    temp: typeof item.main?.temp === 'number' ? item.main.temp : null,
    pop: typeof item.pop === 'number' ? item.pop : 0,
    iconCode: item.weather?.[0]?.icon ?? '01d',
    description: item.weather?.[0]?.description ?? '',
    windDeg: typeof item.wind?.deg === 'number' ? item.wind.deg : null,
    windSpeed: typeof item.wind?.speed === 'number' ? item.wind.speed : null,
  }));

  return {
    daily: dailyData.slice(0, 5).map(day => ({
      day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(day.main.temp),
      condition: day.weather[0].main,
      icon: mapIcon(day.weather[0].icon),
    })),
    hourlyFallback,
  };
};

/**
 * One Call 3.0 — daily slice (8 days) + current uvi/dew_point.
 * Returns null on failure; app degrades gracefully.
 */
export const getOneCallDaily = async (lat, lon) => {
  checkApiKey();
  const la = Number(lat);
  const lo = Number(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (la < -90 || la > 90 || lo < -180 || lo > 180) return null;

  const url = new URL(ONE_CALL_URL);
  url.searchParams.set('lat', String(la));
  url.searchParams.set('lon', String(lo));
  url.searchParams.set('units', 'metric');
  url.searchParams.set('exclude', 'minutely,hourly,alerts');
  url.searchParams.set('appid', API_KEY);

  let response;
  try {
    response = await fetch(url.toString());
  } catch {
    return null;
  }
  if (!response.ok) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    return null;
  }

  const cur = data.current || {};
  const daily = Array.isArray(data.daily)
    ? data.daily.slice(0, 7).map((d) => ({
        dt: d.dt,
        dayLabel: new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        tempMin: typeof d.temp?.min === 'number' ? d.temp.min : null,
        tempMax: typeof d.temp?.max === 'number' ? d.temp.max : null,
        pop: typeof d.pop === 'number' ? d.pop : 0,
        iconCode: d.weather?.[0]?.icon ?? '01d',
        condition: d.weather?.[0]?.main ?? '',
        moonPhase: typeof d.moon_phase === 'number' ? d.moon_phase : null,
      }))
    : [];

  return {
    uvi: typeof cur.uvi === 'number' ? cur.uvi : null,
    dewPoint: typeof cur.dew_point === 'number' ? cur.dew_point : null,
    windDeg: typeof cur.wind_deg === 'number' ? cur.wind_deg : null,
    windGust: typeof cur.wind_gust === 'number' ? cur.wind_gust : null,
    clouds: typeof cur.clouds === 'number' ? cur.clouds : null,
    daily,
  };
};

/**
 * Weather map tile URLs for a fixed zoom level centred on lat/lon.
 * Returns { precipUrl, osmUrl } — coordinates come from geocoded weather data (no user input).
 * osmUrl provides an OpenStreetMap base layer so the transparent precipitation overlay is visible.
 * @param {number} lat  Validated latitude from weather response
 * @param {number} lon  Validated longitude from weather response
 * @param {'precipitation_new'|'clouds_new'|'wind_new'} [layer]
 */
export const getMapTileUrl = (lat, lon, layer = 'precipitation_new') => {
  const la = Number(lat);
  const lo = Number(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (la < -90 || la > 90 || lo < -180 || lo > 180) return null;

  const zoom = 6;
  const n = Math.pow(2, zoom);
  const xTile = Math.floor(((lo + 180) / 360) * n);
  const latRad = (la * Math.PI) / 180;
  const yTile = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);

  return {
    precipUrl: `https://tile.openweathermap.org/map/${layer}/${zoom}/${xTile}/${yTile}.png?appid=${API_KEY}`,
    osmUrl: `https://tile.openstreetmap.org/${zoom}/${xTile}/${yTile}.png`,
  };
};

/**
 * One Call 3.0 — hourly slice for dashboard (48h available; caller typically uses first 24).
 * Returns null if the key cannot access One Call or the request fails.
 */
export const getOneCallHourly = async (lat, lon) => {
  checkApiKey();
  const la = Number(lat);
  const lo = Number(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (la < -90 || la > 90 || lo < -180 || lo > 180) return null;

  const url = new URL(ONE_CALL_URL);
  url.searchParams.set('lat', String(la));
  url.searchParams.set('lon', String(lo));
  url.searchParams.set('units', 'metric');
  url.searchParams.set('exclude', 'minutely,daily,alerts,current');
  url.searchParams.set('appid', API_KEY);

  let response;
  try {
    response = await fetch(url.toString());
  } catch {
    return null;
  }
  if (!response.ok) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    return null;
  }

  if (!Array.isArray(data.hourly)) return null;

  const hourly = data.hourly.map((h) => ({
    dt: h.dt,
    temp: typeof h.temp === 'number' ? h.temp : null,
    pop: typeof h.pop === 'number' ? h.pop : 0,
    iconCode: h.weather?.[0]?.icon ?? '01d',
    description: h.weather?.[0]?.description ?? '',
    windDeg: typeof h.wind_deg === 'number' ? h.wind_deg : null,
    windSpeed: typeof h.wind_speed === 'number' ? h.wind_speed : null,
  }));

  return { hourly };
};

// Helper to map OpenWeatherMap icon codes to our internal icon names.
// Preserves day/night variants and distinct conditions (snow, storm, fog).
const ICON_MAP = {
  '01d': 'sun',        '01n': 'moon',
  '02d': 'cloud-sun',  '02n': 'cloud-moon',
  '03d': 'cloud',      '03n': 'cloud',
  '04d': 'cloud',      '04n': 'cloud',
  '09d': 'cloud-rain', '09n': 'cloud-rain',
  '10d': 'cloud-rain', '10n': 'cloud-rain',
  '11d': 'storm',      '11n': 'storm',
  '13d': 'snow',       '13n': 'snow',
  '50d': 'fog',        '50n': 'fog',
};

const mapIcon = (code) => ICON_MAP[code] || 'cloud';

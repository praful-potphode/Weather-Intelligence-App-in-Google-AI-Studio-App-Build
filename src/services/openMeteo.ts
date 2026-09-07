import {
  GeoLocation,
  WeatherData,
  WeatherConditionInfo,
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
} from '../types/weather';

/**
 * Open-Meteo API Endpoints
 * - Geocoding API: Converts city names into latitude, longitude, and timezone
 * - Forecast API: Fetches real-time current weather and 7-day forecast data
 */
export const OPEN_METEO_GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
export const OPEN_METEO_FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

export const POPULAR_CITIES: GeoLocation[] = [
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    country: 'United States',
    country_code: 'US',
    admin1: 'California',
    timezone: 'America/Los_Angeles',
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
    timezone: 'America/New_York',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    timezone: 'Europe/London',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
    timezone: 'Europe/Paris',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8678,
    longitude: 151.2073,
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
    timezone: 'Australia/Sydney',
  },
  {
    id: 1880252,
    name: 'Singapore',
    latitude: 1.2897,
    longitude: 103.8501,
    country: 'Singapore',
    country_code: 'SG',
    timezone: 'Asia/Singapore',
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.2582,
    longitude: 55.3047,
    country: 'United Arab Emirates',
    country_code: 'AE',
    timezone: 'Asia/Dubai',
  },
];

/**
 * Maps WMO Weather interpretation codes (WW) to human descriptions and icon keys
 */
export function getWeatherCodeInfo(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: isDay ? 'Sun' : 'Moon',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        description: 'Sunny and clear conditions with unobstructed visibility.',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        icon: isDay ? 'SunMedium' : 'MoonStar',
        badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        description: 'Mostly sunny with occasional passing light clouds.',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        description: 'Intermittent sunshine filtered through scattered cloud cover.',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        icon: 'Cloud',
        badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        description: 'Complete cloud cover with diminished direct sunlight.',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        icon: 'CloudFog',
        badgeClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
        description: 'Reduced visibility due to dense surface fog layer.',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 55 ? 'Heavy Drizzle' : 'Light Drizzle',
        icon: 'CloudDrizzle',
        badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
        description: 'Fine mist and intermittent gentle precipitation.',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        icon: 'CloudSnow',
        badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        description: 'Sub-freezing drizzle with danger of icy surface glaze.',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        icon: 'CloudRain',
        badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        description: 'Mild rain showers; umbrella recommended for outdoors.',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        icon: 'CloudRain',
        badgeClass: 'bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-600/20',
        description: 'Steady rainfall with wet pavements and reduced traction.',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        icon: 'CloudRain',
        badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        description: 'Intense rain downpours; carry waterproof protection.',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        icon: 'CloudSnow',
        badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        description: 'Hazardous freezing rain causing slick road conditions.',
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 75 ? 'Heavy Snowfall' : 'Snowfall',
        icon: 'Snowflake',
        badgeClass: 'bg-sky-400/10 text-sky-600 dark:text-sky-300 border-sky-400/20',
        description: 'Active snowfall accumulating on outdoor surfaces.',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        icon: 'Snowflake',
        badgeClass: 'bg-sky-400/10 text-sky-600 dark:text-sky-300 border-sky-400/20',
        description: 'Fine frozen crystalline snow grains.',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Violent Rain Showers' : 'Rain Showers',
        icon: 'CloudRain',
        badgeClass: 'bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-600/20',
        description: 'Passing rain showers with sudden bursts of precipitation.',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        icon: 'Snowflake',
        badgeClass: 'bg-sky-400/10 text-sky-600 dark:text-sky-300 border-sky-400/20',
        description: 'Intermittent bursts of snow showers.',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        icon: 'CloudLightning',
        badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        description: 'Active lightning, thunder, and gusty storm squalls.',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        icon: 'CloudLightning',
        badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        description: 'Severe thunderstorm accompanied by localized hail.',
      };
    default:
      return {
        code,
        label: 'Variable Clouds',
        icon: 'Cloud',
        badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        description: 'Typical seasonal atmospheric conditions.',
      };
  }
}

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  // Check if input is a direct "latitude, longitude" coordinate pair (e.g. "37.77, -122.41")
  const coordMatch = trimmed.match(/^([-+]?\d+(\.\d+)?)\s*,\s*([-+]?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[3]);
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return [
        {
          id: Math.round(Math.abs(lat * 1000 + lon * 1000)),
          name: `Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
          latitude: lat,
          longitude: lon,
          country: 'Custom Coordinates',
          country_code: 'GEO',
          admin1: 'Direct GPS',
        },
      ];
    }
  }

  // Open-Meteo Geocoding API: converts city name into latitude, longitude, and metadata
  const url = `${OPEN_METEO_GEOCODING_API}?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding HTTP error: ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (err) {
    console.error('Error searching cities with Open-Meteo Geocoding API:', err);
    // Return matching popular cities as fallback
    return POPULAR_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        (c.country && c.country.toLowerCase().includes(trimmed.toLowerCase()))
    );
  }
}

/**
 * Fetches real-time weather and 7-day forecast from Open-Meteo
 */
export async function fetchWeatherData(
  city: GeoLocation,
  tempUnit: TemperatureUnit = 'celsius',
  windUnit: WindSpeedUnit = 'kmh',
  precipUnit: PrecipitationUnit = 'mm'
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: city.timezone || 'auto',
  });

  if (tempUnit === 'fahrenheit') {
    params.set('temperature_unit', 'fahrenheit');
  }
  if (windUnit === 'mph') {
    params.set('wind_speed_unit', 'mph');
  }
  if (precipUnit === 'inch') {
    params.set('precipitation_unit', 'inch');
  }

  const endpoint = `${OPEN_METEO_FORECAST_API}?${params.toString()}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    let errorDetail = `Open-Meteo forecast failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.reason) {
        errorDetail = `Open-Meteo API Error: ${errJson.reason} (HTTP ${response.status})`;
      }
    } catch {
      // response might not be JSON
    }
    throw new Error(errorDetail);
  }

  const data = await response.json();

  // Current weather
  const current = {
    time: data.current.time,
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    relativeHumidity: data.current.relative_humidity_2m ?? 0,
    isDay: data.current.is_day === 1,
    precipitation: data.current.precipitation ?? 0,
    weatherCode: data.current.weather_code ?? 0,
    cloudCover: data.current.cloud_cover ?? 0,
    pressureMsl: Math.round(data.current.pressure_msl ?? 1013),
    windSpeed: Math.round(data.current.wind_speed_10m ?? 0),
    windDirection: data.current.wind_direction_10m ?? 0,
    uvIndex: Math.round((data.current.uv_index ?? 0) * 10) / 10,
  };

  // Hourly (next 24 hours from current time index)
  const hourlyTimes: string[] = data.hourly?.time || [];
  const currentTimeIso = data.current.time;
  let currentIndex = hourlyTimes.findIndex((t) => t.startsWith(currentTimeIso.slice(0, 13)));
  if (currentIndex === -1) currentIndex = 0;

  const next24Hours = hourlyTimes.slice(currentIndex, currentIndex + 24).map((timeStr, idx) => {
    const rawIdx = currentIndex + idx;
    const dateObj = new Date(timeStr);
    const hourLabel = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    return {
      time: timeStr,
      hourLabel,
      temperature: Math.round(data.hourly.temperature_2m[rawIdx] ?? 0),
      weatherCode: data.hourly.weather_code[rawIdx] ?? 0,
      precipitationProbability: data.hourly.precipitation_probability[rawIdx] ?? 0,
      relativeHumidity: data.hourly.relative_humidity_2m[rawIdx] ?? 0,
      windSpeed: Math.round(data.hourly.wind_speed_10m[rawIdx] ?? 0),
      uvIndex: Math.round((data.hourly.uv_index[rawIdx] ?? 0) * 10) / 10,
      isCurrentHour: idx === 0,
    };
  });

  // Daily (7 days)
  const dailyDates: string[] = data.daily?.time || [];
  const dailyForecast = dailyDates.slice(0, 7).map((dateStr, idx) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayLabel = idx === 0 ? 'Today' : dateObj.toLocaleDateString([], { weekday: 'short' });

    return {
      date: dateStr,
      dayLabel,
      weatherCode: data.daily.weather_code[idx] ?? 0,
      tempMax: Math.round(data.daily.temperature_2m_max[idx] ?? 0),
      tempMin: Math.round(data.daily.temperature_2m_min[idx] ?? 0),
      apparentTempMax: Math.round(data.daily.apparent_temperature_max[idx] ?? 0),
      apparentTempMin: Math.round(data.daily.apparent_temperature_min[idx] ?? 0),
      precipitationSum: Math.round((data.daily.precipitation_sum[idx] ?? 0) * 10) / 10,
      precipitationProbabilityMax: data.daily.precipitation_probability_max[idx] ?? 0,
      windSpeedMax: Math.round(data.daily.wind_speed_10m_max[idx] ?? 0),
      uvIndexMax: Math.round((data.daily.uv_index_max[idx] ?? 0) * 10) / 10,
      sunrise: data.daily.sunrise[idx] ? new Date(data.daily.sunrise[idx]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '',
      sunset: data.daily.sunset[idx] ? new Date(data.daily.sunset[idx]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '',
    };
  });

  return {
    city,
    current,
    hourly: next24Hours,
    daily: dailyForecast,
    units: {
      temperature: tempUnit === 'celsius' ? '°C' : '°F',
      windSpeed: windUnit === 'kmh' ? 'km/h' : 'mph',
      precipitation: precipUnit === 'mm' ? 'mm' : 'in',
    },
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Reverse geocode helper using BigDataCloud free client-side reverse geocoding
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeoLocation> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const name = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: Date.now(),
        name,
        latitude: lat,
        longitude: lon,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding error:', e);
  }

  return {
    id: Date.now(),
    name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
    latitude: lat,
    longitude: lon,
  };
}

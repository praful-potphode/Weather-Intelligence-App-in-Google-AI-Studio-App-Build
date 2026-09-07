import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Gauge,
  Sunrise,
  Sunset,
  CloudRain,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getWeatherCodeInfo } from '../services/openMeteo';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { city, current, daily, units } = data;
  const condition = getWeatherCodeInfo(current.weatherCode, current.isDay);

  const todayForecast = daily[0];

  // Cardinal direction helper
  const getWindCardinal = (deg: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx] || 'N';
  };

  // UV level text & color
  const getUvDetails = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-500', barBg: 'bg-emerald-500', pct: Math.min(100, (uv / 11) * 100) };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-500', barBg: 'bg-amber-500', pct: Math.min(100, (uv / 11) * 100) };
    if (uv <= 7) return { text: 'High', color: 'text-orange-500', barBg: 'bg-orange-500', pct: Math.min(100, (uv / 11) * 100) };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-500', barBg: 'bg-rose-500', pct: Math.min(100, (uv / 11) * 100) };
    return { text: 'Extreme', color: 'text-purple-600', barBg: 'bg-purple-600', pct: 100 };
  };

  const uvDetails = getUvDetails(current.uvIndex);

  // Format local observation time
  const observationDate = new Date(current.time);
  const formattedTime = observationDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedDate = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Hero Overview Card */}
      <div
        id="current-weather-hero"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-md border border-slate-700/60"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Location & Conditions */}
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-sky-400 text-xs sm:text-sm font-semibold tracking-wide">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>
                {city.name}
                {city.country ? `, ${city.country}` : ''}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10" title="Geocoded Coordinates via Open-Meteo">
                {city.latitude >= 0 ? `${city.latitude.toFixed(2)}°N` : `${Math.abs(city.latitude).toFixed(2)}°S`},{' '}
                {city.longitude >= 0 ? `${city.longitude.toFixed(2)}°E` : `${Math.abs(city.longitude).toFixed(2)}°W`}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 flex items-center gap-1 font-normal">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formattedTime}
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl sm:text-7xl font-extrabold tracking-tight font-sans">
                {current.temperature}
                <span className="text-sky-400 font-light text-3xl sm:text-5xl">{units.temperature}</span>
              </span>

              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/10 backdrop-blur-xs">
                  <WeatherIcon name={condition.icon} className="w-3.5 h-3.5 text-amber-400" />
                  <span>{condition.label}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Feels like{' '}
                  <span className="font-semibold text-white">
                    {current.apparentTemperature}
                    {units.temperature}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              {condition.description}
            </p>

            {todayForecast && (
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <span className="text-slate-400">High:</span>
                  <span className="font-semibold text-white">
                    {todayForecast.tempMax}
                    {units.temperature}
                  </span>
                </span>
                <span className="text-slate-600">/</span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-400">Low:</span>
                  <span className="font-semibold text-white">
                    {todayForecast.tempMin}
                    {units.temperature}
                  </span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-sky-300 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5" />
                  {todayForecast.precipitationProbabilityMax}% precip chance
                </span>
              </div>
            )}
          </div>

          {/* Right: Prominent Weather Condition Emblem */}
          <div className="self-center md:self-auto flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <WeatherIcon
              name={condition.icon}
              className="w-16 h-16 sm:w-20 sm:h-20 text-sky-400 filter drop-shadow-sm mb-2"
            />
            <span className="text-xs font-semibold text-slate-200 text-center tracking-wide uppercase">
              {condition.label}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Humidity */}
        <div
          id="metric-humidity"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs">
            <span className="font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {current.relativeHumidity}%
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              {current.relativeHumidity > 70
                ? 'Humid'
                : current.relativeHumidity < 30
                ? 'Dry air'
                : 'Comfortable'}
            </p>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div
          id="metric-wind"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs">
            <span className="font-medium">Wind</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
              <span>{current.windSpeed}</span>
              <span className="text-xs font-normal text-slate-600 dark:text-slate-300">{units.windSpeed}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>
                {getWindCardinal(current.windDirection)} ({current.windDirection}°)
              </span>
            </p>
          </div>
        </div>

        {/* UV Index */}
        <div
          id="metric-uv"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs">
            <span className="font-medium">UV Index</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{current.uvIndex}</span>
              <span className={`text-xs font-semibold ${uvDetails.color}`}>
                {uvDetails.text}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${uvDetails.barBg}`}
                style={{ width: `${uvDetails.pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Precipitation */}
        <div
          id="metric-precipitation"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs">
            <span className="font-medium">Precipitation</span>
            <CloudRain className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
              <span>{current.precipitation}</span>
              <span className="text-xs font-normal text-slate-600 dark:text-slate-300">{units.precipitation}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              {todayForecast ? `${todayForecast.precipitationProbabilityMax}% max chance` : 'Current'}
            </p>
          </div>
        </div>

        {/* Pressure */}
        <div
          id="metric-pressure"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs">
            <span className="font-medium">Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
              <span>{current.pressureMsl}</span>
              <span className="text-xs font-normal text-slate-600 dark:text-slate-300">hPa</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              {current.pressureMsl >= 1013 ? 'High pressure (Fair)' : 'Low pressure (Unsettled)'}
            </p>
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div
          id="metric-sun"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs">
            <span className="font-medium">Sun Cycle</span>
            <Sunrise className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Sunrise className="w-3 h-3 text-amber-500" /> Rise
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {todayForecast?.sunrise || '--'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Sunset className="w-3 h-3 text-orange-500" /> Set
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {todayForecast?.sunset || '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

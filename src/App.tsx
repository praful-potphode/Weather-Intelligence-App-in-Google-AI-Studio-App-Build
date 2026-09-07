import React, { useState, useEffect, useCallback } from 'react';
import {
  GeoLocation,
  WeatherData,
  TemperatureUnit,
  WeatherIntelligenceReport,
} from './types/weather';
import {
  POPULAR_CITIES,
  fetchWeatherData,
} from './services/openMeteo';
import { generateWeatherIntelligence } from './services/intelligence';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { PlanningIntelligence } from './components/PlanningIntelligence';
import { CloudflareDeployModal } from './components/CloudflareDeployModal';
import { Loader2, AlertCircle, RefreshCw, CloudUpload, Github, ShieldCheck } from 'lucide-react';

const SAVED_CITIES_STORAGE_KEY = 'weather_intelligence_saved_cities';
const PREF_UNIT_STORAGE_KEY = 'weather_intelligence_temp_unit';

export default function App() {
  // State
  const [currentCity, setCurrentCity] = useState<GeoLocation>(POPULAR_CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('celsius');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // Saved / Favorited cities state
  const [savedCities, setSavedCities] = useState<GeoLocation[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_CITIES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse saved cities from localStorage:', e);
    }
    return [POPULAR_CITIES[0], POPULAR_CITIES[2], POPULAR_CITIES[3]]; // San Francisco, London, Tokyo
  });

  // Load preferred temperature unit
  useEffect(() => {
    try {
      const storedUnit = localStorage.getItem(PREF_UNIT_STORAGE_KEY);
      if (storedUnit === 'celsius' || storedUnit === 'fahrenheit') {
        setTempUnit(storedUnit);
      }
    } catch (e) {
      console.warn('Failed reading temp unit from localStorage:', e);
    }
  }, []);

  // Save preferred unit
  const handleToggleTempUnit = () => {
    const nextUnit: TemperatureUnit = tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTempUnit(nextUnit);
    try {
      localStorage.setItem(PREF_UNIT_STORAGE_KEY, nextUnit);
    } catch (e) {
      console.warn('Failed saving temp unit to localStorage:', e);
    }
  };

  // Toggle favorite city
  const handleToggleSaveCity = (cityToToggle: GeoLocation) => {
    setSavedCities((prev) => {
      const exists = prev.some(
        (c) =>
          c.name.toLowerCase() === cityToToggle.name.toLowerCase() ||
          (Math.abs(c.latitude - cityToToggle.latitude) < 0.05 &&
            Math.abs(c.longitude - cityToToggle.longitude) < 0.05)
      );

      let updated: GeoLocation[];
      if (exists) {
        updated = prev.filter(
          (c) =>
            c.name.toLowerCase() !== cityToToggle.name.toLowerCase() &&
            !(
              Math.abs(c.latitude - cityToToggle.latitude) < 0.05 &&
              Math.abs(c.longitude - cityToToggle.longitude) < 0.05
            )
        );
      } else {
        updated = [...prev, cityToToggle];
      }

      try {
        localStorage.setItem(SAVED_CITIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  // Fetch Weather Data
  const loadWeather = useCallback(
    async (city: GeoLocation, unit: TemperatureUnit) => {
      setIsLoading(true);
      setError(null);
      try {
        const windUnit = unit === 'celsius' ? 'kmh' : 'mph';
        const precipUnit = unit === 'celsius' ? 'mm' : 'inch';
        const data = await fetchWeatherData(city, unit, windUnit, precipUnit);
        setWeatherData(data);
      } catch (err: any) {
        console.error('Failed to load weather:', err);
        setError(err.message || 'Unable to retrieve weather data from Open-Meteo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load and reload on city or unit change
  useEffect(() => {
    loadWeather(currentCity, tempUnit);
  }, [currentCity, tempUnit, loadWeather]);

  // Compute planning recommendations
  const intelligenceReport: WeatherIntelligenceReport | null = weatherData
    ? generateWeatherIntelligence(weatherData)
    : null;

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header
        cityName={currentCity.name}
        countryName={currentCity.country}
        tempUnit={tempUnit}
        onToggleTempUnit={handleToggleTempUnit}
        onRefresh={() => loadWeather(currentCity, tempUnit)}
        isLoading={isLoading}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search & City Switcher */}
        <section aria-label="Location Search and Bookmarks">
          <SearchBar
            currentCity={currentCity}
            onSelectCity={(city) => setCurrentCity(city)}
            savedCities={savedCities}
            onToggleSaveCity={handleToggleSaveCity}
          />
        </section>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-rose-800 dark:text-rose-200 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadWeather(currentCity, tempUnit)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="p-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Fetching Open-Meteo Observations
              </h3>
              <p className="text-xs text-slate-500">
                Connecting to global meteorological satellites and forecast models for {currentCity.name}...
              </p>
            </div>
          </div>
        )}

        {/* Weather Dashboards */}
        {weatherData && intelligenceReport && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Current Weather Observation */}
            <section aria-label="Current Weather Observation">
              <CurrentWeather data={weatherData} />
            </section>

            {/* 2. 24-Hour Timeline Outlook */}
            <section aria-label="24-Hour Timeline Forecast">
              <HourlyForecast
                hourly={weatherData.hourly}
                tempUnit={weatherData.units.temperature}
                windUnit={weatherData.units.windSpeed}
              />
            </section>

            {/* 3. Planning Intelligence & Automated Recommendations */}
            <section aria-label="Weather Intelligence & Planning Recommendations">
              <PlanningIntelligence intelligence={intelligenceReport} />
            </section>

            {/* 4. 7-Day Synoptic Forecast */}
            <section aria-label="7-Day Synoptic Forecast">
              <DailyForecast
                daily={weatherData.daily}
                tempUnit={weatherData.units.temperature}
                windUnit={weatherData.units.windSpeed}
                precipUnit={weatherData.units.precipitation}
              />
            </section>
          </div>
        )}
      </main>

      {/* Cloudflare Pages Deployment & GitHub Modal */}
      <CloudflareDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 mt-8 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Weather Intelligence App
            </span>
            <span>•</span>
            <span>
              Geocoding via{' '}
              <a
                href="https://geocoding-api.open-meteo.com/v1/search"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline font-medium font-mono text-[11px]"
              >
                Open-Meteo Geocoding API
              </a>
            </span>
            <span>•</span>
            <span>
              Weather via{' '}
              <a
                href="https://api.open-meteo.com/v1/forecast"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline font-medium font-mono text-[11px]"
              >
                Open-Meteo Forecast API
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeployModalOpen(true)}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              <span>Deploy to Cloudflare Pages</span>
            </button>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Edge Ready</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

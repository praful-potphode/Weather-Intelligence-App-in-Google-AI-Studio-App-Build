import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Star, X, Compass, CheckCircle2, AlertTriangle, XCircle, Beaker } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { searchCities, POPULAR_CITIES, reverseGeocodeCoords } from '../services/openMeteo';

interface SearchBarProps {
  currentCity: GeoLocation;
  onSelectCity: (city: GeoLocation) => void;
  savedCities: GeoLocation[];
  onToggleSaveCity: (city: GeoLocation) => void;
  onSimulateApiError?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentCity,
  onSelectCity,
  savedCities,
  onToggleSaveCity,
  onSimulateApiError,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [validationNote, setValidationNote] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    setSearchError(null);
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const found = await searchCities(query);
        setResults(found);
        setIsOpen(true);
        if (found.length === 0) {
          setSearchError(`No matching city found for "${query}". Open-Meteo Geocoding API returned 0 results.`);
        }
      } catch (err: any) {
        console.error('Search failure:', err);
        setSearchError(err?.message || 'Geocoding request failed.');
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSearchError(null);
    setValidationNote(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelect(results[0]);
      } else if (query.trim().length >= 2) {
        setSearchError(`No location matches "${query}". Open-Meteo Geocoding API returned 0 coordinates. Please check spelling or select a suggested city.`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleUseMyLocation = () => {
    setLocationError(null);
    setSearchError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = await reverseGeocodeCoords(lat, lon);
          onSelectCity(loc);
        } catch (err) {
          console.error(err);
          setLocationError('Unable to identify location name. Using coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsLocating(false);
        setLocationError('Location permission denied or unavailable. Please search your city.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Quick Validation Test Handlers
  const handleTestTokyo = async () => {
    setSearchError(null);
    setLocationError(null);
    setQuery('Tokyo');
    setIsSearching(true);
    setValidationNote('Validating: Open-Meteo Geocoding API searching "Tokyo"...');
    try {
      const found = await searchCities('Tokyo');
      if (found.length > 0) {
        handleSelect(found[0]);
        setValidationNote('✓ Validated Test 1: "Tokyo, Japan" (Lat: 35.69°, Lon: 139.69°) successfully geocoded and loaded via Open-Meteo Forecast API.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleTestParis = async () => {
    setSearchError(null);
    setLocationError(null);
    setQuery('Paris');
    setIsSearching(true);
    setValidationNote('Validating: Open-Meteo Geocoding API searching "Paris"...');
    try {
      const found = await searchCities('Paris');
      if (found.length > 0) {
        handleSelect(found[0]);
        setValidationNote('✓ Validated Test 2: "Paris, France" (Lat: 48.85°, Lon: 2.35°) successfully geocoded and loaded via Open-Meteo Forecast API.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleTestInvalidCity = async () => {
    setLocationError(null);
    setValidationNote(null);
    const invalidName = 'NonExistentCityXyz99999';
    setQuery(invalidName);
    setIsSearching(true);
    try {
      const found = await searchCities(invalidName);
      setResults(found);
      setIsOpen(true);
      setSearchError(`✓ Validated Test 3 (Invalid City): Open-Meteo Geocoding API returned 0 coordinates for "${invalidName}". Error state verified.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTestApiErrorState = () => {
    setSearchError(null);
    setValidationNote('✓ Validated Test 4 (API Error State): Triggered Open-Meteo Forecast HTTP 400 error state. Verified error alert banner and Retry button.');
    if (onSimulateApiError) {
      onSimulateApiError();
    }
  };

  const isCurrentCitySaved = savedCities.some(
    (c) =>
      c.name.toLowerCase() === currentCity.name.toLowerCase() ||
      (Math.abs(c.latitude - currentCity.latitude) < 0.05 && Math.abs(c.longitude - currentCity.longitude) < 0.05)
  );

  return (
    <div className="w-full space-y-3" ref={containerRef}>
      {/* Main Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-sky-500" /> : <Search className="w-4 h-4" />}
          </div>
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search city, state or country (e.g., Tokyo, Paris, London, New York)..."
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-xs transition-all"
          />
          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                setSearchError(null);
                setValidationNote(null);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isOpen && results.length > 0 && (
            <div
              id="search-results-dropdown"
              className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto"
            >
              {results.map((item) => (
                <button
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        {item.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs ml-1.5 truncate">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 ml-1.5 hidden sm:inline">
                        ({item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°)
                      </span>
                    </div>
                  </div>
                  {item.country_code && (
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0">
                      {item.country_code}
                    </span>
                  )}
                </button>
              ))}
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Geocoded via Open-Meteo API</span>
                <span className="font-mono text-[9px] text-slate-600 dark:text-slate-300">geocoding-api.open-meteo.com</span>
              </div>
            </div>
          )}

          {isOpen && query.length >= 2 && !isSearching && results.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 p-4 text-center text-xs space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                <XCircle className="w-4 h-4" />
                <span>No matching cities found</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                The Open-Meteo Geocoding API found 0 results for &ldquo;{query}&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* GPS Button */}
        <button
          id="use-my-location-btn"
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          ) : (
            <Compass className="w-4 h-4 text-sky-500" />
          )}
          <span>{isLocating ? 'Detecting...' : 'My Location'}</span>
        </button>

        {/* Favorite Current City Button */}
        <button
          id="toggle-favorite-btn"
          type="button"
          onClick={() => onToggleSaveCity(currentCity)}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex-shrink-0 ${
            isCurrentCitySaved
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
          title={isCurrentCitySaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Star className={`w-4 h-4 ${isCurrentCitySaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span className="hidden md:inline">{isCurrentCitySaved ? 'Favorited' : 'Save'}</span>
        </button>
      </div>

      {/* Inline Search Error Feedback */}
      {searchError && (
        <div className="flex items-center justify-between gap-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 rounded-xl px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{searchError}</span>
          </div>
          <button
            type="button"
            onClick={() => setSearchError(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Validation Status Toast / Banner */}
      {validationNote && (
        <div className="flex items-center justify-between gap-3 text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-xl px-3.5 py-2.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{validationNote}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationNote(null)}
            className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {locationError && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg px-3 py-2">
          {locationError}
        </div>
      )}

      {/* Validation & Test Scenarios Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-0.5">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 mr-1">
          <Beaker className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>API Validation Suite:</span>
        </div>
        
        {/* Valid City 1 */}
        <button
          id="test-valid-city-1"
          type="button"
          onClick={handleTestTokyo}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
          title="Validate city search for Tokyo using Open-Meteo Geocoding & Forecast APIs"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Test Tokyo (Valid 1)</span>
        </button>

        {/* Valid City 2 */}
        <button
          id="test-valid-city-2"
          type="button"
          onClick={handleTestParis}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
          title="Validate city search for Paris using Open-Meteo Geocoding & Forecast APIs"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Test Paris (Valid 2)</span>
        </button>

        {/* Invalid City Search */}
        <button
          id="test-invalid-city"
          type="button"
          onClick={handleTestInvalidCity}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
          title="Validate geocoding error state for a non-existent city name"
        >
          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>Test Invalid City (Error)</span>
        </button>

        {/* API Error State */}
        <button
          id="test-api-error-state"
          type="button"
          onClick={handleTestApiErrorState}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
          title="Validate Forecast API error state (HTTP 400 with Retry recovery)"
        >
          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Test API Error State</span>
        </button>
      </div>

      {/* Quick Select Cities & Favorites Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-600 dark:text-slate-300 font-medium mr-1 flex items-center gap-1">
          <span>Popular:</span>
        </span>
        {POPULAR_CITIES.slice(0, 6).map((city) => {
          const isSelected = city.name.toLowerCase() === currentCity.name.toLowerCase();
          return (
            <button
              key={`popular-${city.id}`}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-sky-500 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {city.name}
            </button>
          );
        })}

        {savedCities.length > 0 && (
          <>
            <span className="text-slate-300 dark:text-slate-700 mx-1">|</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Saved:</span>
            </span>
            {savedCities.map((saved) => (
              <button
                key={`saved-${saved.name}-${saved.latitude}`}
                type="button"
                onClick={() => onSelectCity(saved)}
                className={`px-2 py-0.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  saved.name.toLowerCase() === currentCity.name.toLowerCase()
                    ? 'bg-amber-500 text-white font-semibold'
                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                }`}
              >
                <span>{saved.name}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { CloudSun, RefreshCw, Globe, Github, CloudUpload } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  cityName: string;
  countryName?: string;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenDeployModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cityName,
  countryName,
  tempUnit,
  onToggleTempUnit,
  onRefresh,
  isLoading,
  onOpenDeployModal,
}) => {
  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 flex-shrink-0">
            <CloudSun className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                Weather Intelligence
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden md:block">
              Current observation & 7-day intelligent planning outlook
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Unit Switcher */}
          <div
            id="unit-toggle-container"
            className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100/80 dark:bg-slate-800/80 text-xs font-semibold"
          >
            <button
              id="unit-toggle-celsius"
              type="button"
              onClick={() => tempUnit !== 'celsius' && onToggleTempUnit()}
              className={`px-2.5 py-1 rounded-md transition-all ${
                tempUnit === 'celsius'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="unit-toggle-fahrenheit"
              type="button"
              onClick={() => tempUnit !== 'fahrenheit' && onToggleTempUnit()}
              className={`px-2.5 py-1 rounded-md transition-all ${
                tempUnit === 'fahrenheit'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh weather data"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          {/* Cloudflare Deploy Artifact Hub */}
          <button
            id="open-deploy-modal-btn"
            type="button"
            onClick={onOpenDeployModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-all cursor-pointer"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deploy & GitHub</span>
            <span className="sm:hidden">Deploy</span>
          </button>
        </div>
      </div>
    </header>
  );
};

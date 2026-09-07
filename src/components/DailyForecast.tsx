import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, Sun, Wind, Sunrise, Sunset } from 'lucide-react';
import { DailyForecastItem } from '../types/weather';
import { getWeatherCodeInfo } from '../services/openMeteo';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  tempUnit: string;
  windUnit: string;
  precipUnit: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  tempUnit,
  windUnit,
  precipUnit,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Global min/max across 7 days for the temperature range visual bar
  const globalMin = Math.min(...daily.map((d) => d.tempMin));
  const globalMax = Math.max(...daily.map((d) => d.tempMax));
  const rangeSpan = Math.max(1, globalMax - globalMin);

  return (
    <div
      id="seven-day-forecast-section"
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            7-Day Synoptic Outlook
          </h2>
        </div>
        <span className="text-xs text-slate-500">Tap day for details</span>
      </div>

      <div className="space-y-2">
        {daily.map((day, idx) => {
          const condition = getWeatherCodeInfo(day.weatherCode, true);
          const isExpanded = expandedIndex === idx;

          // Calculate bar position
          const leftPct = ((day.tempMin - globalMin) / rangeSpan) * 100;
          const widthPct = Math.max(8, ((day.tempMax - day.tempMin) / rangeSpan) * 100);

          return (
            <div
              key={`daily-${day.date}`}
              className="border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-850/40 hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Row Header */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
              >
                {/* Day Name & Date */}
                <div className="w-24 sm:w-28 flex-shrink-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {day.dayLabel}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                {/* Condition Icon & Label */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <WeatherIcon name={condition.icon} className="w-5 h-5 text-sky-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate hidden sm:inline">
                    {condition.label}
                  </span>
                </div>

                {/* Rain Chance */}
                <div className="w-14 sm:w-16 text-right flex-shrink-0">
                  {day.precipitationProbabilityMax > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <Droplets className="w-3 h-3" />
                      {day.precipitationProbabilityMax}%
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">0%</span>
                  )}
                </div>

                {/* Min / Max Temp Bar */}
                <div className="w-32 sm:w-48 flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-8 text-right">
                    {day.tempMin}°
                  </span>
                  <div className="flex-1 h-2 bg-slate-200/80 dark:bg-slate-700 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-500"
                      style={{
                        left: `${Math.min(90, Math.max(0, leftPct))}%`,
                        width: `${Math.min(100, widthPct)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white w-8">
                    {day.tempMax}°
                  </span>
                </div>

                {/* Toggle chevron */}
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-4 pb-3 pt-1 border-t border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Sunrise className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block">Sunrise</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {day.sunrise || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Sunset className="w-4 h-4 text-orange-500" />
                    <div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block">Sunset</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {day.sunset || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block">Max Wind Gusts</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {day.windSpeedMax} {windUnit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block">Max UV Index</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {day.uvIndexMax} (Peak)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

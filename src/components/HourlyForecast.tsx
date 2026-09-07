import React from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import { HourlyForecastItem } from '../types/weather';
import { getWeatherCodeInfo } from '../services/openMeteo';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  tempUnit: string;
  windUnit: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  tempUnit,
  windUnit,
}) => {
  return (
    <div
      id="hourly-forecast-section"
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            24-Hour Timeline Outlook
          </h2>
        </div>
        <span className="text-xs text-slate-500">Hourly intervals</span>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {hourly.map((item, index) => {
          const condition = getWeatherCodeInfo(item.weatherCode, true);
          return (
            <div
              key={`hour-${index}-${item.time}`}
              className={`flex-shrink-0 w-24 p-3 rounded-xl flex flex-col items-center justify-between text-center transition-all ${
                item.isCurrentHour
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-500/80 shadow-xs'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/60'
              }`}
            >
              {/* Hour */}
              <span
                className={`text-xs font-semibold ${
                  item.isCurrentHour
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.hourLabel}
              </span>

              {/* Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  name={condition.icon}
                  className={`w-6 h-6 ${
                    item.isCurrentHour ? 'text-sky-500' : 'text-slate-700 dark:text-slate-300'
                  }`}
                />
              </div>

              {/* Temperature */}
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {item.temperature}
                {tempUnit}
              </div>

              {/* Rain Chance */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                <Droplets className="w-3 h-3" />
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

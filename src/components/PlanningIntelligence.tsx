import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Shirt,
  Umbrella,
  Sun,
  Glasses,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { WeatherIntelligenceReport, ActivityScore } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface PlanningIntelligenceProps {
  intelligence: WeatherIntelligenceReport;
}

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({ intelligence }) => {
  const { overallConditionSummary, bestOutdoorWindow, activities, wardrobe, alerts } = intelligence;

  // Status badge styling helper
  const getStatusBadge = (status: ActivityScore['status']) => {
    switch (status) {
      case 'Optimal':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'Good':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20';
      case 'Fair':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'Poor':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-4" id="planning-recommendations-container">
      {/* Intelligence Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Weather Planning Intelligence
            </h2>
            <p className="text-xs text-slate-500">
              Automated outdoor feasibility & daily preparation recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Active Alerts Banner if any */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                alert.level === 'alert'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                  : alert.level === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                  : 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/50 text-sky-900 dark:text-sky-200'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.level === 'alert' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                ) : alert.level === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider">{alert.title}</div>
                <div className="text-xs mt-0.5 opacity-90 leading-relaxed">{alert.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two Column Section: Best Window & Wardrobe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Best Outdoor Window (5 cols) */}
        <div
          id="best-outdoor-window-card"
          className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 border border-indigo-800/50 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {bestOutdoorWindow.title}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {bestOutdoorWindow.suitabilityScore}% Ideal
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-extrabold text-white tracking-tight">
                {bestOutdoorWindow.timeRange}
              </div>
              <p className="text-xs text-indigo-100/80 mt-2 leading-relaxed">
                {bestOutdoorWindow.description}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-indigo-800/60 flex items-center justify-between text-xs text-indigo-200">
            <span className="leading-snug">{overallConditionSummary}</span>
          </div>
        </div>

        {/* Smart Wardrobe & Packing Guide (7 cols) */}
        <div
          id="wardrobe-recommendations-card"
          className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-sky-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Clothing & Essentials Guide
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Weather-adaptive</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 block">Top Layer</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {wardrobe.top}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 block">Bottom Layer</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {wardrobe.bottom}
                </span>
              </div>

              {wardrobe.outerwear && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 block">Outerwear / Coat</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {wardrobe.outerwear}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Essentials Checklist Chips */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mr-1">Checklist:</span>

            {/* Umbrella */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                wardrobe.umbrellaNeeded
                  ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent'
              }`}
            >
              <Umbrella className="w-3.5 h-3.5" />
              <span>{wardrobe.umbrellaNeeded ? 'Umbrella Needed' : 'No Umbrella'}</span>
            </span>

            {/* Sunglasses */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                wardrobe.sunglassesNeeded
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent'
              }`}
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>{wardrobe.sunglassesNeeded ? 'Sunglasses Advised' : 'Sunglasses Optional'}</span>
            </span>

            {/* Sunscreen */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                wardrobe.sunscreenNeeded
                  ? 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{wardrobe.sunscreenNeeded ? 'SPF 30+ Sunscreen' : 'Low UV'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Activity Suitability Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Activity Suitability & Outdoor Index
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <WeatherIcon name={activity.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {activity.name}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      activity.status
                    )}`}
                  >
                    {activity.status} ({activity.score}%)
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-2.5">
                  {activity.summary}
                </p>

                {activity.tips.length > 0 && (
                  <ul className="mt-2.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    {activity.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    activity.score >= 80
                      ? 'bg-emerald-500'
                      : activity.score >= 65
                      ? 'bg-sky-500'
                      : activity.score >= 45
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${activity.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

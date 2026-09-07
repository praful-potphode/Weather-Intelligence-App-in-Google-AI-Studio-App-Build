export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';
export type PrecipitationUnit = 'mm' | 'inch';

export interface WeatherUnitsPreference {
  temp: TemperatureUnit;
  wind: WindSpeedUnit;
  precip: PrecipitationUnit;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
}

export interface HourlyForecastItem {
  time: string;
  hourLabel: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  relativeHumidity: number;
  windSpeed: number;
  uvIndex: number;
  isCurrentHour: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayLabel: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  city: GeoLocation;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  units: {
    temperature: string;
    windSpeed: string;
    precipitation: string;
  };
  fetchedAt: string;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  icon: string;
  badgeClass: string;
  description: string;
}

export interface ActivityScore {
  id: string;
  name: string;
  category: 'fitness' | 'leisure' | 'travel';
  score: number; // 0 to 100
  status: 'Optimal' | 'Good' | 'Fair' | 'Poor';
  icon: string;
  summary: string;
  tips: string[];
}

export interface WardrobeRecommendation {
  top: string;
  bottom: string;
  outerwear?: string;
  footwear: string;
  accessories: string[];
  umbrellaNeeded: boolean;
  sunglassesNeeded: boolean;
  sunscreenNeeded: boolean;
}

export interface WeatherAlert {
  id: string;
  level: 'info' | 'warning' | 'alert';
  title: string;
  message: string;
  icon: string;
}

export interface OutdoorWindow {
  title: string;
  timeRange: string;
  description: string;
  suitabilityScore: number;
}

export interface WeatherIntelligenceReport {
  overallConditionSummary: string;
  bestOutdoorWindow: OutdoorWindow;
  activities: ActivityScore[];
  wardrobe: WardrobeRecommendation;
  alerts: WeatherAlert[];
}

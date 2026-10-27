/**
 * Real-time Jeddah Climate Classification & Meteorological Utilities
 * Specifically calibrated for Jeddah's coastal Red Sea climate dynamics.
 */

export type WeatherConditionKey = 'dust' | 'humid' | 'hot' | 'moderate' | 'cold';

export interface WeatherClassification {
  key: WeatherConditionKey;
  labelAr: string;
  labelEn: string;
  shortLabelAr: string;
  dotColor: string;
  glowColor: string;
  pingClass: string;
}

export interface RawWeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface JeddahWeatherResponse {
  temperatureC: number;
  apparentTemperatureC: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  classification: WeatherClassification;
  lastUpdated: string;
  isFallback?: boolean;
}

/**
 * WMO Weather codes that represent dust, sand, or haze phenomena:
 * 06: Widespread dust in suspension
 * 07: Dust or sand raised by wind
 * 08: Well-developed dust whirls
 * 09: Duststorm or sandstorm within sight
 * 30: Slight or moderate duststorm/sandstorm
 * 31: Duststorm/sandstorm has decreased
 * 32: Severe duststorm/sandstorm
 */
const DUST_WEATHER_CODES = new Set([6, 7, 8, 9, 30, 31, 32]);

/**
 * Pure classifier function for Jeddah's coastal climate.
 * Analyzes temperature, relative humidity, apparent temperature, WMO code, and wind speed.
 */
export function classifyJeddahWeather(data: RawWeatherData): WeatherClassification {
  const {
    temperature_2m: temp,
    relative_humidity_2m: humidity,
    apparent_temperature: apparentTemp,
    weather_code: weatherCode,
    wind_speed_10m: windSpeed,
  } = data;

  // 1. Dust / Sandstorm (عجاج / غبار)
  // Triggered by specific WMO codes OR high wind speed (>35 km/h) accompanied by low humidity (<40%)
  const isDustCode = DUST_WEATHER_CODES.has(weatherCode);
  const isHighWindDust = windSpeed > 35 && humidity < 40;
  if (isDustCode || isHighWindDust) {
    return {
      key: 'dust',
      labelAr: 'غبار',
      labelEn: 'Dusty',
      shortLabelAr: 'غبار',
      dotColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      pingClass: 'bg-amber-500',
    };
  }

  // 2. High Humidity / Sultry Coastal Air (رطب / كتمة ورطوبة)
  // Signature Red Sea phenomenon: relative humidity >= 70% and temperature > 28°C
  if (humidity >= 70 && temp > 28) {
    return {
      key: 'humid',
      labelAr: 'رطب',
      labelEn: 'Humid',
      shortLabelAr: 'رطب',
      dotColor: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      pingClass: 'bg-cyan-500',
    };
  }

  // 3. Extreme Heat (حر / حر شمس)
  // Actual temperature or apparent heat index >= 36°C with moderate/normal humidity
  if (temp >= 36 || apparentTemp >= 36) {
    return {
      key: 'hot',
      labelAr: 'حر',
      labelEn: 'Hot',
      shortLabelAr: 'حر',
      dotColor: '#EF4444',
      glowColor: 'rgba(239, 68, 68, 0.45)',
      pingClass: 'bg-red-500',
    };
  }

  // 4. Cool / Winter Weather (بارد / منعش)
  // In coastal Jeddah, any temperature below 22°C (especially during winter sea breezes) is considered cool
  if (temp < 22) {
    return {
      key: 'cold',
      labelAr: 'بارد',
      labelEn: 'Cool',
      shortLabelAr: 'بارد',
      dotColor: '#38BDF8',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      pingClass: 'bg-sky-400',
    };
  }

  // 5. Moderate / Pleasant Sea Breeze (معتدل / نسناس عليل)
  // Comfort range: 24°C to 32°C with comfortable humidity (<65%)
  if (temp >= 24 && temp <= 32 && humidity < 65) {
    return {
      key: 'moderate',
      labelAr: 'معتدل',
      labelEn: 'Moderate',
      shortLabelAr: 'معتدل',
      dotColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      pingClass: 'bg-emerald-500',
    };
  }

  // Graceful transition fallbacks for intermediate ranges:
  // - Mild pleasant night (22°C - 24°C): Moderate
  if (temp < 24) {
    return {
      key: 'moderate',
      labelAr: 'معتدل',
      labelEn: 'Moderate',
      shortLabelAr: 'معتدل',
      dotColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      pingClass: 'bg-emerald-500',
    };
  }

  // - Warm with elevated humidity (32°C - 36°C with humidity >= 60%): Humid
  if (humidity >= 60) {
    return {
      key: 'humid',
      labelAr: 'رطب',
      labelEn: 'Humid',
      shortLabelAr: 'رطب',
      dotColor: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      pingClass: 'bg-cyan-500',
    };
  }

  // Default pleasant fallback
  return {
    key: 'moderate',
    labelAr: 'معتدل',
    labelEn: 'Moderate',
    shortLabelAr: 'معتدل',
    dotColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    pingClass: 'bg-emerald-500',
  };
}

/**
 * Safe fallback weather data representing Jeddah's typical pleasant coastal baseline.
 * Used when offline, during network timeouts, or when the API is unreachable.
 */
export const JEDDAH_FALLBACK_WEATHER: JeddahWeatherResponse = {
  temperatureC: 30,
  apparentTemperatureC: 32,
  humidity: 55,
  windSpeed: 12,
  weatherCode: 0,
  classification: {
    key: 'moderate',
    labelAr: 'معتدل',
    labelEn: 'Moderate',
    shortLabelAr: 'معتدل',
    dotColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    pingClass: 'bg-emerald-500',
  },
  lastUpdated: new Date().toISOString(),
  isFallback: true,
};

/**
 * Cyberpunk 风格天气配色方案
 */

import { WeatherType } from '../../../services/weather/weatherTypes';

export interface WeatherColors {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
}

/**
 * 天气配色映射
 */
export const WEATHER_COLOR_SCHEMES: Record<WeatherType, WeatherColors> = {
  [WeatherType.SUNNY]: {
    primary: '#ffaa00',
    secondary: '#ff6600',
    background: '#1a0f00',
    accent: '#ffcc00',
  },
  [WeatherType.RAINY]: {
    primary: '#00f3ff',
    secondary: '#0088ff',
    background: '#000a12',
    accent: '#00d4ff',
  },
  [WeatherType.SNOWY]: {
    primary: '#ffffff',
    secondary: '#aaddff',
    background: '#050510',
    accent: '#e6f3ff',
  },
  [WeatherType.CLOUDY]: {
    primary: '#8899aa',
    secondary: '#667788',
    background: '#0a0f14',
    accent: '#99aabb',
  },
  [WeatherType.FOGGY]: {
    primary: '#556677',
    secondary: '#334455',
    background: '#080c10',
    accent: '#667788',
  },
  [WeatherType.WINDY]: {
    primary: '#00ffaa',
    secondary: '#00ff66',
    background: '#001a0f',
    accent: '#00ffcc',
  },
  [WeatherType.SANDSTORM]: {
    primary: '#cc8800',
    secondary: '#aa6600',
    background: '#1a1000',
    accent: '#dd9900',
  },
};

/**
 * 获取天气配色
 */
export const getWeatherColors = (weatherType: WeatherType): WeatherColors => {
  return WEATHER_COLOR_SCHEMES[weatherType] || WEATHER_COLOR_SCHEMES[WeatherType.SUNNY];
};

/**
 * 将十六进制颜色转换为 Three.js RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 1, g: 1, b: 1 };
};
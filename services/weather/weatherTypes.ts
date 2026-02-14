/**
 * 天气服务类型定义
 */

/**
 * 天气类型枚举
 */
export enum WeatherType {
  SUNNY = 'sunny',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  CLOUDY = 'cloudy',
  FOGGY = 'foggy',
  WINDY = 'windy',
  SANDSTORM = 'sandstorm',
}

/**
 * 天气数据接口
 */
export interface WeatherData {
  /** 天气类型 */
  type: WeatherType;
  /** 温度 */
  temperature: number;
  /** 湿度 */
  humidity: number;
  /** 风速 */
  windSpeed: number;
  /** 天气描述 */
  description: string;
  /** 城市名称 */
  city: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 和风天气 API 响应
 */
export interface QWeatherResponse {
  code: string;
  now: {
    temp: string;
    humidity: string;
    windSpeed: string;
    text: string;
    icon: string;
  };
  updateTime: string;
}

/**
 * OpenWeatherMap API 响应
 */
export interface OpenWeatherResponse {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string;
  dt: number;
}

/**
 * 天气 API 提供商
 */
export enum WeatherProvider {
  QWEATHER = 'qweather',
  OPENWEATHER = 'openweather',
}
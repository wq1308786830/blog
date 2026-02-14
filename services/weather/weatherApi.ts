/**
 * 天气 API 服务
 * 支持和风天气和 OpenWeatherMap
 */

import { WeatherData, WeatherType, QWeatherResponse, OpenWeatherResponse, WeatherProvider } from './weatherTypes';
import { mapQWeatherCode, mapOpenWeatherId } from './weatherMapper';

/**
 * 默认天气数据（API 失败时使用）
 */
const DEFAULT_WEATHER: WeatherData = {
  type: WeatherType.SUNNY,
  temperature: 25,
  humidity: 60,
  windSpeed: 10,
  description: '晴天',
  city: '北京',
  updateTime: new Date().toISOString(),
};

/**
 * 从和风天气获取天气数据
 */
const fetchQWeather = async (location = '101010100'): Promise<WeatherData> => {
  const apiKey = process.env.NEXT_PUBLIC_QWEATHER_KEY;

  if (!apiKey) {
    console.warn('QWeather API key not configured, using default weather');
    return DEFAULT_WEATHER;
  }

  try {
    // 尝试生产环境 API
    const url = `https://pe3yfrteqb.re.qweatherapi.com/v7/weather/now?location=${location}&key=${apiKey}`;
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`QWeather API error: ${response.status}`);
    }

    const data: QWeatherResponse = await response.json();

    if (data.code !== '200') {
      console.warn(`QWeather API returned code: ${data.code}, using default weather`);
      return DEFAULT_WEATHER;
    }

    return {
      type: mapQWeatherCode(data.now.icon),
      temperature: parseFloat(data.now.temp),
      humidity: parseFloat(data.now.humidity),
      windSpeed: parseFloat(data.now.windSpeed),
      description: data.now.text,
      city: '当前位置',
      updateTime: data.updateTime,
    };
  } catch (error) {
    console.error('Failed to fetch QWeather data:', error);
    return DEFAULT_WEATHER;
  }
};

/**
 * 从 OpenWeatherMap 获取天气数据
 */
const fetchOpenWeather = async (lat = 39.9042, lon = 116.4074): Promise<WeatherData> => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

  if (!apiKey) {
    console.warn('OpenWeather API key not configured, using default weather');
    return DEFAULT_WEATHER;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_cn`;
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`);
    }

    const data: OpenWeatherResponse = await response.json();
    const weatherId = data.weather[0]?.id || 800;

    return {
      type: mapOpenWeatherId(weatherId),
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      description: data.weather[0]?.description || '晴',
      city: data.name,
      updateTime: new Date(data.dt * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch OpenWeather data:', error);
    return DEFAULT_WEATHER;
  }
};

/**
 * 获取天气数据
 * 优先使用和风天气，失败时降级到 OpenWeatherMap
 */
export const getWeatherData = async (
  provider: WeatherProvider = WeatherProvider.QWEATHER,
  params?: { location?: string; lat?: number; lon?: number }
): Promise<WeatherData> => {
  if (provider === WeatherProvider.QWEATHER) {
    const data = await fetchQWeather(params?.location);
    // 如果和风天气返回默认数据，尝试 OpenWeatherMap
    if (data === DEFAULT_WEATHER && params?.lat && params?.lon) {
      return fetchOpenWeather(params.lat, params.lon);
    }
    return data;
  }

  return fetchOpenWeather(params?.lat, params?.lon);
};
/**
 * 天气页面 - 服务端入口
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { getWeatherData } from '../../services/weather/weatherApi';
import { WeatherProvider } from '../../services/weather/weatherTypes';
import { WeatherClient } from '../../components/Weather/WeatherClient';
import './weather.css';

export const metadata: Metadata = {
  title: '赛博朋克天气 | Cyberpunk Weather',
  description: '实时天气展示，Three.js 3D 粒子特效，赛博朋克风格',
};

/**
 * 天气页面
 */
export default async function WeatherPage() {
  // 获取天气数据（默认使用和风天气）
  const weatherData = await getWeatherData(WeatherProvider.QWEATHER, {
    location: '101010100', // 北京
  });

  return (
    <main className="weather-page">
      <Suspense fallback={<div className="weather-page-loading">加载天气数据中...</div>}>
        <WeatherClient initialWeatherData={weatherData} />
      </Suspense>
    </main>
  );
}
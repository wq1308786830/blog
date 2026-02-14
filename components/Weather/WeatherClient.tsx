/**
 * 天气页面客户端组件
 */

'use client';

import { memo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { WeatherData, WeatherType } from '../../services/weather/weatherTypes';
import { WeatherInfo } from './ui/WeatherInfo';
import './weatherClient.css';

// 动态导入 Three.js 场景（禁用 SSR）
const WeatherScene = dynamic(() => import('./WeatherScene').then((mod) => mod.WeatherScene), {
  ssr: false,
  loading: () => <div className="weather-loading">加载中...</div>,
});

export interface WeatherClientProps {
  initialWeatherData: WeatherData;
}

/**
 * 天气客户端组件
 */
const WeatherClient: React.FC<WeatherClientProps> = memo(({ initialWeatherData }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>(initialWeatherData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="weather-loading">初始化中...</div>;
  }

  return (
    <div className="weather-client-container">
      {/* Three.js 场景 */}
      <WeatherScene weatherType={weatherData.type} intensity={1} />

      {/* 天气信息 HUD */}
      <WeatherInfo data={weatherData} />

      {/* 页面标题 */}
      <div className="weather-title">
        <h1>Cyberpunk Weather</h1>
        <p>赛博朋克天气系统</p>
      </div>
    </div>
  );
});

WeatherClient.displayName = 'WeatherClient';

export { WeatherClient };
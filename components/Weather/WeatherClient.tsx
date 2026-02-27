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
  const [selectedWeather, setSelectedWeather] = useState<WeatherType | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 天气类型选项
  const weatherOptions = [
    { type: WeatherType.SUNNY, label: '☀️ 晴天' },
    { type: WeatherType.RAINY, label: '🌧️ 雨天' },
    { type: WeatherType.SNOWY, label: '❄️ 雪天' },
    { type: WeatherType.CLOUDY, label: '☁️ 多云' },
    { type: WeatherType.FOGGY, label: '🌫️ 雾天' },
    { type: WeatherType.WINDY, label: '💨 大风' },
    { type: WeatherType.SANDSTORM, label: '🏜️ 沙尘暴' },
  ];

  // 当前显示的天气类型
  const currentWeatherType = selectedWeather || weatherData.type;

  if (!isClient) {
    return <div className="weather-loading">初始化中...</div>;
  }

  return (
    <div className="weather-client-container">
      {/* Three.js 场景 */}
      <WeatherScene weatherType={currentWeatherType} intensity={1} />

      {/* 天气信息 HUD */}
      <WeatherInfo data={weatherData} />

      {/* 天气切换器 */}
      <div className="weather-switcher">
        <div className="weather-switcher-title">切换天气类型</div>
        <div className="weather-switcher-options">
          {weatherOptions.map((option) => (
            <button
              key={option.type}
              className={`weather-switcher-button ${currentWeatherType === option.type ? 'active' : ''}`}
              onClick={() => setSelectedWeather(option.type)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

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
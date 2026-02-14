/**
 * 天气信息 HUD 组件
 * Cyberpunk 风格信息面板
 */

'use client';

import { memo } from 'react';
import { WeatherData } from '../../../services/weather/weatherTypes';
import { getWeatherColors } from '../utils/weatherColors';
import './weatherInfo.css';

export interface WeatherInfoProps {
  data: WeatherData;
}

/**
 * 天气类型中文映射
 */
const WEATHER_TYPE_NAMES: Record<string, string> = {
  sunny: '晴天',
  rainy: '雨天',
  snowy: '雪天',
  cloudy: '多云',
  foggy: '雾霾',
  windy: '大风',
  sandstorm: '沙尘',
};

/**
 * 天气信息组件
 */
const WeatherInfo: React.FC<WeatherInfoProps> = memo(({ data }) => {
  const colors = getWeatherColors(data.type);

  return (
    <div className="weather-info-container">
      <div
        className="weather-info-panel"
        style={{
          '--primary-color': colors.primary,
          '--secondary-color': colors.secondary,
          '--accent-color': colors.accent,
        } as React.CSSProperties}
      >
        {/* 城市名称 */}
        <div className="weather-city">{data.city}</div>

        {/* 天气类型 */}
        <div className="weather-type">
          <span className="weather-type-label">天气</span>
          <span className="weather-type-value">{WEATHER_TYPE_NAMES[data.type] || data.description}</span>
        </div>

        {/* 温度 */}
        <div className="weather-temp">
          <span className="temp-value">{data.temperature}</span>
          <span className="temp-unit">°C</span>
        </div>

        {/* 详细信息 */}
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">湿度</span>
            <span className="detail-value">{data.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">风速</span>
            <span className="detail-value">{data.windSpeed} km/h</span>
          </div>
        </div>

        {/* 更新时间 */}
        <div className="weather-update-time">
          更新时间: {new Date(data.updateTime).toLocaleString('zh-CN')}
        </div>
      </div>
    </div>
  );
});

WeatherInfo.displayName = 'WeatherInfo';

export { WeatherInfo };
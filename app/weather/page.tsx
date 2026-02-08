'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 天气数据类型
interface WeatherData {
  location: string;
  temp: string;
  condition: string;
  humidity: string;
  wind: string;
  loading: boolean;
  error: string | null;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData>({
    location: '天水',
    temp: '',
    condition: '',
    humidity: '',
    wind: '',
    loading: true,
    error: null
  });

  const [customCity, setCustomCity] = useState('');

  // 获取天气数据
  const fetchWeather = async (city: string) => {
    setWeather(prev => ({ ...prev, loading: true, error: null }));

    try {
      // 使用 wttr.in API
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?m&format=%l:+%c+%t+%h+%w`
      );

      if (!response.ok) throw new Error('获取天气失败');

      const data = await response.text();

      // 解析响应: 天水: ⛅️  +6°C 35% ↑30km/h
      const parts = data.split(':');
      if (parts.length < 2) throw new Error('数据解析失败');

      const location = parts[0].trim();
      const weatherInfo = parts.slice(1).join(':').trim();

      // 使用正则提取各项数据
      const tempMatch = weatherInfo.match(/([+-]?\d+°C)/);
      const humidityMatch = weatherInfo.match(/(\d+)%/);
      const windMatch = weatherInfo.match(/(↑|↓|←|→|↖|↗|↙|↘)\s*(\d+km\/h)/);
      const conditionMatch = weatherInfo.match(/([☀️☁️⛅️🌧️❄️])/);

      setWeather({
        location,
        temp: tempMatch ? tempMatch[1] : '--',
        condition: conditionMatch ? conditionMatch[1] : '未知',
        humidity: humidityMatch ? humidityMatch[1] : '--',
        wind: windMatch ? `${windMatch[1]}${windMatch[2]}` : '--',
        loading: false,
        error: null
      });
    } catch (err) {
      setWeather(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : '未知错误'
      }));
    }
  };

  // 获取用户位置
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('浏览器不支持地理位置');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // 使用 Open-Meteo 的反向地理编码获取城市名
          const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=zh`
          );
          const geoData = await geoResponse.json();

          const city = geoData.results?.[0]?.name || '未知位置';
          fetchWeather(city);
        } catch {
          // 如果获取城市名失败，用坐标
          fetchWeather(`${latitude},${longitude}`);
        }
      },
      (error) => {
        alert('获取位置失败: ' + error.message);
      }
    );
  };

  // 页面加载时获取天水的天气
  useEffect(() => {
    fetchWeather('天水');
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col p-4 md:p-10 max-w-7xl mx-auto gap-10">

      {/* Header */}
      <header className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <div className="flex flex-col">
          <span className="text-[var(--primary)] text-xs tracking-[0.2em] animate-pulse">SYSTEM_ONLINE</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            WEATHER<span className="text-[var(--primary)]">.MODULE</span>
          </h1>
        </div>
        <Link
          href="/"
          className="px-6 py-2 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all text-xs font-mono uppercase"
        >
          &lt; RETURN
        </Link>
      </header>

      {/* Main Weather Display */}
      <div className="flex flex-col items-center justify-center gap-8 py-20">

        {weather.loading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--muted)] font-mono animate-pulse">INITIALIZING_WEATHER_DATA...</p>
          </div>
        ) : weather.error ? (
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-400 font-mono mb-4">ERROR: {weather.error}</p>
            <button
              onClick={() => fetchWeather(weather.location)}
              className="px-6 py-2 bg-[var(--primary)] text-black font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              RETRY
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <p className="text-[var(--muted)] text-xs font-mono tracking-[0.2em]">CURRENT_LOCATION</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[var(--text)]">
                {weather.location}
              </h2>
            </div>

            {/* Main Weather */}
            <div className="relative">
              <div className="absolute -inset-8 bg-[var(--primary)] opacity-10 blur-3xl rounded-full" />
              <div className="relative z-10 border-2 border-[var(--border)] bg-[rgba(0,10,20,0.8)] p-10 backdrop-blur-sm">
                <div className="text-8xl md:text-9xl mb-4">{weather.condition}</div>
                <div className="text-6xl md:text-8xl font-bold text-[var(--primary)] cyber-glitch" data-text={weather.temp}>
                  {weather.temp}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="border border-[var(--border)] p-4 bg-[rgba(0,10,20,0.6)]">
                <p className="text-[var(--muted)] text-xs font-mono mb-2">HUMIDITY</p>
                <p className="text-2xl font-bold text-[var(--text)]">{weather.humidity}%</p>
              </div>
              <div className="border border-[var(--border)] p-4 bg-[rgba(0,10,20,0.6)]">
                <p className="text-[var(--muted)] text-xs font-mono mb-2">WIND</p>
                <p className="text-2xl font-bold text-[var(--text)]">{weather.wind}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="w-full max-w-md space-y-4">
          {/* Get My Location */}
          <button
            onClick={getLocation}
            className="w-full px-6 py-3 bg-[rgba(0,243,255,0.1)] border border-[var(--primary)] text-[var(--primary)] font-bold uppercase tracking-widest hover:bg-[var(--primary)] hover:text-black transition-all"
          >
            📍 DETECT_MY_LOCATION
          </button>

          {/* Custom City */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather(customCity)}
              placeholder="输入城市名称..."
              className="flex-1 px-4 py-3 bg-[rgba(0,10,20,0.8)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] font-mono text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
            <button
              onClick={() => fetchWeather(customCity)}
              className="px-6 py-3 bg-[var(--border)] text-black font-bold uppercase text-sm hover:bg-[var(--text)] transition-colors"
            >
              QUERY
            </button>
          </div>
        </div>

      </div>

      <footer className="text-center py-10 border-t border-[var(--border)] text-[var(--muted)] text-xs font-mono">
        <p>DATA_SOURCE: WTTR.IN · OPEN-METEO</p>
        <p className="opacity-50 mt-2">WEATHER_MODULE_V1.0</p>
      </footer>
    </main>
  );
}

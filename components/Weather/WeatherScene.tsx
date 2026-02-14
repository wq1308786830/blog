/**
 * Three.js 天气场景主组件
 * 根据天气类型渲染对应的特效
 */

'use client';

import { memo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { WeatherType, WeatherData } from '../../services/weather/weatherTypes';
import { getWeatherColors } from './utils/weatherColors';
import { SunnyEffect } from './effects/SunnyEffect';
import { RainyEffect } from './effects/RainyEffect';
import { SnowyEffect } from './effects/SnowyEffect';
import { CloudyEffect } from './effects/CloudyEffect';
import { FoggyEffect } from './effects/FoggyEffect';
import { WindyEffect } from './effects/WindyEffect';
import { SandstormEffect } from './effects/SandstormEffect';

export interface WeatherSceneProps {
  weatherType: WeatherType;
  intensity?: number;
}

/**
 * 天气效果渲染器
 */
const WeatherEffectRenderer: React.FC<{ weatherType: WeatherType; intensity: number }> = memo(
  ({ weatherType, intensity }) => {
    switch (weatherType) {
      case WeatherType.SUNNY:
        return <SunnyEffect intensity={intensity} />;
      case WeatherType.RAINY:
        return <RainyEffect intensity={intensity} />;
      case WeatherType.SNOWY:
        return <SnowyEffect intensity={intensity} />;
      case WeatherType.CLOUDY:
        return <CloudyEffect intensity={intensity} />;
      case WeatherType.FOGGY:
        return <FoggyEffect intensity={intensity} />;
      case WeatherType.WINDY:
        return <WindyEffect intensity={intensity} />;
      case WeatherType.SANDSTORM:
        return <SandstormEffect intensity={intensity} />;
      default:
        return <SunnyEffect intensity={intensity} />;
    }
  }
);

WeatherEffectRenderer.displayName = 'WeatherEffectRenderer';

/**
 * 天气场景主组件
 */
const WeatherScene: React.FC<WeatherSceneProps> = memo(({ weatherType, intensity = 1 }) => {
  const colors = getWeatherColors(weatherType);

  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: colors.background,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* 摄像机 */}
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />

        {/* 轨道控制（可选） */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />

        {/* 天气效果 */}
        <WeatherEffectRenderer weatherType={weatherType} intensity={intensity} />
      </Suspense>
    </Canvas>
  );
});

WeatherScene.displayName = 'WeatherScene';

export { WeatherScene };
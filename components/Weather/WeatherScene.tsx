/**
 * Three.js 天气场景主组件
 * 根据天气类型渲染对应的特效
 */

'use client';

import { memo, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { WeatherType } from '../../services/weather/weatherTypes';
import { getWeatherColors } from './utils/weatherColors';
import { SunnyEffect } from './effects/SunnyEffect';
import { CyberRainEffect } from './effects/CyberRainEffect';
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
        return <CyberRainEffect intensity={intensity} backgroundImage="/imgs/rainy-background.webp" />;
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
 * 场景背景色设置组件
 */
const SceneBackground: React.FC<{ color: string; transparent?: boolean }> = ({ color, transparent }) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    if (transparent) {
      gl.setClearColor(0x000000, 0);
      scene.background = null;
    } else {
      const bgColor = new THREE.Color(color);
      gl.setClearColor(bgColor);
      scene.background = bgColor;
    }
  }, [color, gl, scene, transparent]);

  return null;
};

/**
 * 天气场景主组件
 */
const WeatherScene: React.FC<WeatherSceneProps> = memo(({ weatherType, intensity = 1 }) => {
  const colors = getWeatherColors(weatherType);
  const isRainy = weatherType === WeatherType.RAINY;

  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      gl={{
        antialias: true,
        alpha: isRainy,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <SceneBackground color={colors.background} transparent={isRainy} />
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

        {/* 赛博朋克后期处理 */}
        <EffectComposer>
          <Bloom
            intensity={2.0}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
});

WeatherScene.displayName = 'WeatherScene';

export { WeatherScene };
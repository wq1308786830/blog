/**
 * 雾霾效果 - 雾气弥漫
 */

'use client';

import { useMemo, memo } from 'react';
import { ParticleSystem, ParticleSystemProps } from '../particles/ParticleSystem';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface FoggyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 雾气粒子动画
 */
const foggyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  props: ParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 缓慢随机移动
    positions[i3] += Math.sin(Date.now() * 0.0005 + i * 0.1) * 0.005;
    positions[i3 + 1] += Math.cos(Date.now() * 0.0004 + i * 0.15) * 0.003;
    positions[i3 + 2] += Math.sin(Date.now() * 0.0003 + i * 0.2) * 0.005;

    // 边界检测
    if (Math.abs(positions[i3]) > spread / 2) velocities[i3] *= -1;
    if (Math.abs(positions[i3 + 1]) > spread / 2) velocities[i3 + 1] *= -1;
    if (Math.abs(positions[i3 + 2]) > spread / 2) velocities[i3 + 2] *= -1;
  }
};

/**
 * 雾霾效果主组件
 */
const FoggyEffect: React.FC<FoggyEffectProps> = memo(({ intensity = 1, particleCount = 2000 }) => {
  const colors = getWeatherColors(WeatherType.FOGGY);

  return (
    <group>
      {/* 浓雾粒子 */}
      <ParticleSystem
        count={particleCount}
        color={colors.primary}
        size={0.4}
        spread={25}
        speed={intensity * 0.2}
        opacity={0.4}
        animate={foggyAnimate}
      />

      {/* 薄雾粒子 */}
      <ParticleSystem
        count={particleCount * 1.5}
        color={colors.secondary}
        size={0.3}
        spread={30}
        speed={intensity * 0.15}
        opacity={0.25}
        animate={foggyAnimate}
      />

      {/* 远处雾气 */}
      <ParticleSystem
        count={particleCount / 2}
        color={colors.accent}
        size={0.5}
        spread={35}
        speed={intensity * 0.1}
        opacity={0.15}
      />

      {/* 昏暗环境光 */}
      <ambientLight color={colors.secondary} intensity={0.3} />
    </group>
  );
});

FoggyEffect.displayName = 'FoggyEffect';

export { FoggyEffect };
/**
 * 大风效果 - 水平流动风粒子
 */

'use client';

import { useMemo, memo } from 'react';
import { ParticleSystem, ParticleSystemProps } from '../particles/ParticleSystem';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface WindyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 风粒子动画
 */
const windyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  props: ParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 快速水平移动
    positions[i3] += 0.15 + Math.random() * 0.05;

    // 轻微垂直波动
    positions[i3 + 1] += Math.sin(Date.now() * 0.002 + i * 0.5) * 0.02;

    // 重置到左侧
    if (positions[i3] > spread / 2) {
      positions[i3] = -spread / 2;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 大风效果主组件
 */
const WindyEffect: React.FC<WindyEffectProps> = memo(({ intensity = 1, particleCount = 2500 }) => {
  const colors = getWeatherColors(WeatherType.WINDY);

  return (
    <group>
      {/* 主风粒子 */}
      <ParticleSystem
        count={particleCount}
        color={colors.primary}
        size={0.08}
        spread={25}
        speed={intensity * 1.5}
        opacity={0.7}
        animate={windyAnimate}
      />

      {/* 细小风粒子 */}
      <ParticleSystem
        count={particleCount / 2}
        color={colors.secondary}
        size={0.05}
        spread={20}
        speed={intensity * 2}
        opacity={0.5}
        animate={windyAnimate}
      />

      {/* 漂浮灰尘 */}
      <ParticleSystem
        count={particleCount / 3}
        color={colors.accent}
        size={0.03}
        spread={30}
        speed={intensity * 1.2}
        opacity={0.4}
        animate={windyAnimate}
      />

      {/* 绿色光源 */}
      <pointLight position={[0, 5, 0]} color={colors.accent} intensity={intensity * 1.5} distance={40} />

      {/* 环境光 */}
      <ambientLight color={colors.secondary} intensity={0.3} />
    </group>
  );
});

WindyEffect.displayName = 'WindyEffect';

export { WindyEffect };
/**
 * 沙尘效果 - 昏黄沙尘粒子
 */

'use client';

import { useMemo, memo } from 'react';
import { ParticleSystem, ParticleSystemProps } from '../particles/ParticleSystem';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface SandstormEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 沙尘粒子动画
 */
const sandstormAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  props: ParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 快速水平移动 + 旋转
    positions[i3] += 0.12 + Math.random() * 0.08;
    positions[i3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.03;
    positions[i3 + 2] += Math.cos(Date.now() * 0.001 + i * 0.5) * 0.02;

    // 重置到左侧
    if (positions[i3] > spread / 2) {
      positions[i3] = -spread / 2;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 沙尘效果主组件
 */
const SandstormEffect: React.FC<SandstormEffectProps> = memo(({ intensity = 1, particleCount = 3000 }) => {
  const colors = getWeatherColors(WeatherType.SANDSTORM);

  return (
    <group>
      {/* 主沙尘粒子 */}
      <ParticleSystem
        count={particleCount}
        color={colors.primary}
        size={0.15}
        spread={30}
        speed={intensity * 1.3}
        opacity={0.6}
        animate={sandstormAnimate}
      />

      {/* 细小沙尘 */}
      <ParticleSystem
        count={particleCount * 1.5}
        color={colors.secondary}
        size={0.1}
        spread={35}
        speed={intensity * 1.5}
        opacity={0.4}
        animate={sandstormAnimate}
      />

      {/* 大颗粒沙尘 */}
      <ParticleSystem
        count={particleCount / 4}
        color={colors.accent}
        size={0.2}
        spread={25}
        speed={intensity * 1.1}
        opacity={0.5}
        animate={sandstormAnimate}
      />

      {/* 黄色光源 */}
      <pointLight position={[0, 5, 0]} color={colors.accent} intensity={intensity * 2} distance={45} />

      {/* 昏黄环境光 */}
      <ambientLight color={colors.secondary} intensity={0.4} />
    </group>
  );
});

SandstormEffect.displayName = 'SandstormEffect';

export { SandstormEffect };
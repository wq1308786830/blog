/**
 * 晴天效果 - 金色光粒子飘动 + 阳光光晕
 */

'use client';

import { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleSystem, ParticleSystemProps } from '../particles/ParticleSystem';
import { getWeatherColors, hexToRgb } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface SunnyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 晴天粒子动画
 */
const sunnyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  props: ParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 向上飘动 + 随机横向偏移
    positions[i3] += Math.sin(Date.now() * 0.001 + i) * 0.002;
    positions[i3 + 1] += 0.01 + Math.random() * 0.005;
    positions[i3 + 2] += Math.cos(Date.now() * 0.001 + i) * 0.002;

    // 重置到起点
    if (positions[i3 + 1] > spread / 2) {
      positions[i3 + 1] = -spread / 2;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 光晕组件
 */
const SunGlow: React.FC<{ intensity: number }> = memo(({ intensity }) => {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      // 脉动效果
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale * intensity);
    }
  });

  const geometry = useMemo(() => new THREE.SphereGeometry(2, 32, 32), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffaa00',
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return (
    <mesh ref={glowRef} position={[0, 5, -5]} geometry={geometry} material={material} />
  );
});

SunGlow.displayName = 'SunGlow';

/**
 * 晴天效果主组件
 */
const SunnyEffect: React.FC<SunnyEffectProps> = memo(({ intensity = 1, particleCount = 2000 }) => {
  const colors = getWeatherColors(WeatherType.SUNNY);

  return (
    <group>
      {/* 光粒子 */}
      <ParticleSystem
        count={particleCount}
        color={colors.primary}
        size={0.15}
        spread={20}
        speed={intensity}
        opacity={0.6}
        animate={sunnyAnimate}
      />

      {/* 额外的光晕粒子 */}
      <ParticleSystem
        count={500}
        color={colors.secondary}
        size={0.08}
        spread={15}
        speed={intensity * 0.8}
        opacity={0.4}
      />

      {/* 光源 */}
      <pointLight position={[0, 10, 0]} color={colors.accent} intensity={intensity * 2} distance={50} />

      {/* 太阳光晕 */}
      <SunGlow intensity={intensity} />
    </group>
  );
});

SunnyEffect.displayName = 'SunnyEffect';

export { SunnyEffect };
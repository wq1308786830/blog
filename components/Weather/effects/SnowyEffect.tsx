/**
 * 雪天效果 - 缓慢飘落雪花 + 冰霜效果
 */

'use client';

import { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleSystem, ParticleSystemProps } from '../particles/ParticleSystem';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface SnowyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 雪花粒子动画
 */
const snowyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  props: ParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 缓慢飘落 + 横向摆动
    positions[i3] += Math.sin(Date.now() * 0.001 + i) * 0.01;
    positions[i3 + 1] -= 0.02 + Math.random() * 0.01;
    positions[i3 + 2] += Math.cos(Date.now() * 0.001 + i * 0.5) * 0.01;

    // 重置到顶部
    if (positions[i3 + 1] < -spread / 2) {
      positions[i3 + 1] = spread / 2;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 冰霜地面效果
 */
const FrostGround: React.FC = memo(() => {
  const frostRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.PlaneGeometry(20, 20, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#e6f3ff',
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return (
    <mesh
      ref={frostRef}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -4.5, 0]}
    />
  );
});

FrostGround.displayName = 'FrostGround';

/**
 * 雪天效果主组件
 */
const SnowyEffect: React.FC<SnowyEffectProps> = memo(({ intensity = 1, particleCount = 2500 }) => {
  const colors = getWeatherColors(WeatherType.SNOWY);

  return (
    <group>
      {/* 主雪花粒子 */}
      <ParticleSystem
        count={particleCount}
        color={colors.primary}
        size={0.12}
        spread={20}
        speed={intensity}
        opacity={0.9}
        animate={snowyAnimate}
      />

      {/* 细小雪花 */}
      <ParticleSystem
        count={particleCount / 2}
        color={colors.secondary}
        size={0.06}
        spread={25}
        speed={intensity * 0.8}
        opacity={0.7}
        animate={snowyAnimate}
      />

      {/* 冰霜地面 */}
      <FrostGround />

      {/* 冷色光源 */}
      <pointLight position={[0, 5, 0]} color={colors.accent} intensity={intensity * 1.2} distance={35} />

      {/* 环境光 */}
      <ambientLight color={colors.secondary} intensity={0.3} />
    </group>
  );
});

SnowyEffect.displayName = 'SnowyEffect';

export { SnowyEffect };
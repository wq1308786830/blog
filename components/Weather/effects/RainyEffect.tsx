/**
 * 雨天效果 - 高速下落雨滴 + 水波纹
 */

'use client';

import { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleSystem, ParticleSystemProps } from '../particles/ParticleSystem';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface RainyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 雨滴粒子动画
 */
const rainyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  props: ParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 快速下落
    positions[i3 + 1] -= 0.3 + Math.random() * 0.1;

    // 添加水平偏移（模拟风力）
    positions[i3] += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.005;

    // 重置到顶部
    if (positions[i3 + 1] < -spread / 2) {
      positions[i3 + 1] = spread / 2;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 水波纹组件
 */
const RainRipples: React.FC<{ count: number }> = memo(({ count }) => {
  const ripplesRef = useRef<THREE.Group>(null);
  const ripples = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 15,
      z: (Math.random() - 0.5) * 15,
      scale: 0,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (!ripplesRef.current) return;

    ripplesRef.current.children.forEach((child, index) => {
      const ripple = ripples[index];
      const time = state.clock.elapsedTime + ripple.phase;
      const scale = (Math.sin(time * 2) + 1) * 0.5;

      child.scale.setScalar(scale * 0.5);
      (child as THREE.Mesh).material = (child as THREE.Mesh).material as THREE.Material;
      ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 1 - scale;
    });
  });

  const geometry = useMemo(() => new THREE.RingGeometry(0.1, 0.15, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#00f3ff',
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return (
    <group ref={ripplesRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      {ripples.map((ripple) => (
        <mesh key={ripple.id} position={[ripple.x, 0, ripple.z]} geometry={geometry} material={material} />
      ))}
    </group>
  );
});

RainRipples.displayName = 'RainRipples';

/**
 * 雨天效果主组件
 */
const RainyEffect: React.FC<RainyEffectProps> = memo(({ intensity = 1, particleCount = 3000 }) => {
  const colors = getWeatherColors(WeatherType.RAINY);

  return (
    <group>
      {/* 雨滴粒子 */}
      <ParticleSystem
        count={particleCount}
        color={colors.primary}
        size={0.05}
        spread={20}
        speed={intensity}
        opacity={0.8}
        animate={rainyAnimate}
      />

      {/* 细雨 */}
      <ParticleSystem
        count={particleCount / 2}
        color={colors.secondary}
        size={0.03}
        spread={25}
        speed={intensity * 1.2}
        opacity={0.5}
        animate={rainyAnimate}
      />

      {/* 水波纹 */}
      <RainRipples count={20} />

      {/* 蓝色光源 */}
      <pointLight position={[0, 5, 0]} color={colors.accent} intensity={intensity * 1.5} distance={40} />

      {/* 环境光 */}
      <ambientLight color={colors.secondary} intensity={0.2} />
    </group>
  );
});

RainyEffect.displayName = 'RainyEffect';

export { RainyEffect };
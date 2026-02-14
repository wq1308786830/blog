/**
 * 多云效果 - 体积云层 + 雾气
 */

'use client';

import { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleSystem } from '../particles/ParticleSystem';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface CloudyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 云朵组件
 */
const Cloud: React.FC<{ position: [number, number, number]; scale: number }> = memo(({ position, scale }) => {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cloudRef.current) {
      // 缓慢漂移
      cloudRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.1) * 0.002;
      cloudRef.current.position.y += Math.cos(state.clock.elapsedTime * 0.15) * 0.001;
    }
  });

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);
  const sphereMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#aabbcc',
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      <mesh geometry={sphereGeometry} material={sphereMaterial} position={[0, 0, 0]} />
      <mesh geometry={sphereGeometry} material={sphereMaterial} position={[1.5, 0, 0]} scale={0.8} />
      <mesh geometry={sphereGeometry} material={sphereMaterial} position={[-1.5, 0, 0]} scale={0.8} />
      <mesh geometry={sphereGeometry} material={sphereMaterial} position={[0.75, 0.5, 0]} scale={0.9} />
      <mesh geometry={sphereGeometry} material={sphereMaterial} position={[-0.75, 0.5, 0]} scale={0.9} />
    </group>
  );
});

Cloud.displayName = 'Cloud';

/**
 * 多云效果主组件
 */
const CloudyEffect: React.FC<CloudyEffectProps> = memo(({ intensity = 1, particleCount = 1500 }) => {
  const colors = getWeatherColors(WeatherType.CLOUDY);

  // 云朵位置配置
  const clouds = useMemo(
    () => [
      { position: [-6, 3, -5] as [number, number, number], scale: 1.5 },
      { position: [0, 4, -8] as [number, number, number], scale: 2 },
      { position: [6, 3.5, -6] as [number, number, number], scale: 1.8 },
      { position: [-3, 5, -10] as [number, number, number], scale: 1.3 },
      { position: [4, 5.5, -12] as [number, number, number], scale: 1.6 },
    ],
    []
  );

  return (
    <group>
      {/* 雾气粒子 */}
      <ParticleSystem
        count={particleCount}
        color={colors.primary}
        size={0.2}
        spread={25}
        speed={intensity * 0.3}
        opacity={0.3}
      />

      {/* 云层 */}
      {clouds.map((cloud, index) => (
        <Cloud key={index} position={cloud.position} scale={cloud.scale} />
      ))}

      {/* 环境光 */}
      <ambientLight color={colors.secondary} intensity={0.4} />

      {/* 微弱点光源 */}
      <pointLight position={[0, 8, 0]} color={colors.accent} intensity={intensity * 0.8} distance={30} />
    </group>
  );
});

CloudyEffect.displayName = 'CloudyEffect';

export { CloudyEffect };
/**
 * 增强版晴天效果 - 太阳光晕、光束、金色粒子
 */

'use client';

import { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AdvancedParticleSystem } from '../particles/AdvancedParticleSystem';
import { AdvancedParticleSystemProps } from '../particles/AdvancedParticleSystem';
import { createBeamMaterial } from '../shaders/advancedShaders';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface EnhancedSunnyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 太阳光晕组件
 */
const SunHalo: React.FC<{ intensity: number; color: string }> = memo(({ intensity, color }) => {
  const haloRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (haloRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      haloRef.current.scale.setScalar(scale);
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.002;
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z += 0.001 * (i + 1);
      });
    }
  });

  const haloGeometry = useMemo(() => new THREE.CircleGeometry(4, 64), []);
  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15 * intensity,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [color, intensity]
  );

  return (
    <group position={[0, 8, -10]}>
      {/* 主光晕 */}
      <mesh ref={haloRef} geometry={haloGeometry} material={haloMaterial} />

      {/* 光环 */}
      <group ref={ringsRef}>
        {[1.5, 2.5, 3.5].map((radius, i) => (
          <mesh key={i} rotation={[0, 0, i * 0.5]}>
            <ringGeometry args={[radius, radius + 0.1, 64]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.2 * intensity}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
});

SunHalo.displayName = 'SunHalo';

/**
 * 光束组件
 */
const LightBeams: React.FC<{ count: number; color: string }> = memo(({ count, color }) => {
  const beamsRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const beams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [(Math.random() - 0.5) * 20, Math.random() * 10 - 5, -10] as [number, number, number],
      rotation: [0, 0, Math.random() * Math.PI * 2] as [number, number, number],
      scale: [0.1, 5 + Math.random() * 10, 1] as [number, number, number],
      speed: 0.5 + Math.random() * 1,
    }));
  }, [count]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (beamsRef.current) {
      beamsRef.current.children.forEach((beam, i) => {
        const opacity = (beam as THREE.Mesh).material as THREE.MeshBasicMaterial;
        opacity.opacity = (Math.sin(timeRef.current * beams[i].speed + i) + 1) * 0.3;
      });
    }
  });

  return (
    <group ref={beamsRef}>
      {beams.map((beam) => (
        <mesh key={beam.id} position={beam.position} rotation={beam.rotation} scale={beam.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
});

LightBeams.displayName = 'LightBeams';

/**
 * 晴天粒子动画
 */
const sunnyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  time: number,
  props: AdvancedParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 向上飘动 + 旋转
    const angle = time * 0.5 + i * 0.01;
    positions[i3] += Math.sin(angle) * 0.01;
    positions[i3 + 1] += 0.02 + Math.sin(time + i * 0.1) * 0.01;
    positions[i3 + 2] += Math.cos(angle) * 0.01;

    // 重置到起点
    if (positions[i3 + 1] > spread / 2) {
      positions[i3 + 1] = -spread / 2;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 增强版晴天效果主组件
 */
const EnhancedSunnyEffect: React.FC<EnhancedSunnyEffectProps> = memo(
  ({ intensity = 1, particleCount = 3000 }) => {
    const colors = getWeatherColors(WeatherType.SUNNY);

    return (
      <group>
        {/* 主粒子系统 */}
        <AdvancedParticleSystem
          count={particleCount}
          color={colors.primary}
          secondaryColor={colors.secondary}
          sizeRange={[1, 3]}
          spread={25}
          speed={intensity}
          opacity={0.6}
          animate={sunnyAnimate}
        />

        {/* 额外的光点粒子 */}
        <AdvancedParticleSystem
          count={particleCount / 3}
          color={colors.accent}
          secondaryColor={colors.primary}
          sizeRange={[0.5, 1.5]}
          spread={30}
          speed={intensity * 0.8}
          opacity={0.4}
        />

        {/* 太阳光晕 */}
        <SunHalo intensity={intensity} color={colors.primary} />

        {/* 光束 */}
        <LightBeams count={8} color={colors.primary} />

        {/* 强烈的主光源 */}
        <pointLight position={[0, 15, 0]} color={colors.accent} intensity={intensity * 3} distance={60} />
        <pointLight position={[10, 10, 5]} color={colors.secondary} intensity={intensity * 1.5} distance={40} />
        <pointLight position={[-10, 10, 5]} color={colors.primary} intensity={intensity * 1.5} distance={40} />

        {/* 环境光 */}
        <ambientLight color={colors.secondary} intensity={0.4} />
      </group>
    );
  }
);

EnhancedSunnyEffect.displayName = 'EnhancedSunnyEffect';

export { EnhancedSunnyEffect };
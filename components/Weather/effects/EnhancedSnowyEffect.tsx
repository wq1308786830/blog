/**
 * 增强版雪天效果 - 雪花、冰霜、光晕、闪烁
 */

'use client';

import { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AdvancedParticleSystem } from '../particles/AdvancedParticleSystem';
import { AdvancedParticleSystemProps } from '../particles/AdvancedParticleSystem';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface EnhancedSnowyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 冰晶闪烁组件
 */
const IceSparkles: React.FC<{ count: number; color: string }> = memo(({ count, color }) => {
  const sparklesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = Math.random() * 15 - 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      sizes[i] = Math.random() * 0.3 + 0.1;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, sizes, phases };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [color]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (sparklesRef.current && material) {
      material.opacity = (Math.sin(timeRef.current * 3) + 1) * 0.4;
    }
  });

  return <points ref={sparklesRef} geometry={geometry} material={material} />;
});

IceSparkles.displayName = 'IceSparkles';

/**
 * 冰霜地面
 */
const FrostGround: React.FC<{ color: string }> = memo(({ color }) => {
  const frostRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (frostRef.current) {
      const material = frostRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(40, 40, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [color]
  );

  return (
    <mesh ref={frostRef} geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.9, 0]} />
  );
});

FrostGround.displayName = 'FrostGround';

/**
 * 雪花粒子动画
 */
const snowyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  time: number,
  props: AdvancedParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 缓慢飘落 + 随机横向摆动
    positions[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.02;
    positions[i3 + 1] -= 0.03 + Math.random() * 0.02;
    positions[i3 + 2] += Math.cos(time * 0.5 + i * 0.15) * 0.02;

    // 重置到顶部
    if (positions[i3 + 1] < -spread / 2) {
      positions[i3 + 1] = spread / 2;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 增强版雪天效果主组件
 */
const EnhancedSnowyEffect: React.FC<EnhancedSnowyEffectProps> = memo(
  ({ intensity = 1, particleCount = 4000 }) => {
    const colors = getWeatherColors(WeatherType.SNOWY);

    return (
      <group>
        {/* 主雪花粒子 */}
        <AdvancedParticleSystem
          count={particleCount}
          color={colors.primary}
          secondaryColor={colors.secondary}
          sizeRange={[1.5, 3]}
          spread={30}
          speed={intensity}
          opacity={0.9}
          animate={snowyAnimate}
        />

        {/* 细小雪花 */}
        <AdvancedParticleSystem
          count={particleCount / 2}
          color={colors.secondary}
          secondaryColor={colors.primary}
          sizeRange={[0.5, 1.5]}
          spread={35}
          speed={intensity * 0.8}
          opacity={0.7}
          animate={snowyAnimate}
        />

        {/* 闪烁雪花 */}
        <AdvancedParticleSystem
          count={500}
          color={colors.accent}
          sizeRange={[2, 4]}
          spread={25}
          speed={intensity * 0.6}
          opacity={0.5}
        />

        {/* 冰晶闪烁 */}
        <IceSparkles count={200} color={colors.accent} />

        {/* 冰霜地面 */}
        <FrostGround color={colors.secondary} />

        {/* 冷色光源 */}
        <pointLight position={[0, 10, 0]} color={colors.accent} intensity={intensity * 1.5} distance={50} />
        <pointLight position={[10, 8, 5]} color={colors.secondary} intensity={intensity} distance={40} />
        <pointLight position={[-10, 8, 5]} color={colors.primary} intensity={intensity} distance={40} />

        {/* 环境光 */}
        <ambientLight color={colors.secondary} intensity={0.4} />
      </group>
    );
  }
);

EnhancedSnowyEffect.displayName = 'EnhancedSnowyEffect';

export { EnhancedSnowyEffect };
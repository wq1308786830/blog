/**
 * 增强版雨天效果 - 雨滴、闪电、水波纹、雾气
 */

'use client';

import { useRef, useMemo, memo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AdvancedParticleSystem } from '../particles/AdvancedParticleSystem';
import { AdvancedParticleSystemProps } from '../particles/AdvancedParticleSystem';
import { createRippleMaterial } from '../shaders/advancedShaders';
import { getWeatherColors } from '../utils/weatherColors';
import { WeatherType } from '../../../services/weather/weatherTypes';

export interface EnhancedRainyEffectProps {
  intensity?: number;
  particleCount?: number;
}

/**
 * 闪电组件
 */
const Lightning: React.FC<{ intensity: number }> = memo(({ intensity }) => {
  const [visible, setVisible] = useState(false);
  const lightRef = useRef<THREE.PointLight>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const flash = () => {
      if (Math.random() > 0.7) {
        setVisible(true);
        if (lightRef.current) {
          lightRef.current.intensity = intensity * 10;
        }
        setTimeout(() => setVisible(false), 100);
        setTimeout(() => {
          setVisible(true);
          if (lightRef.current) {
            lightRef.current.intensity = intensity * 8;
          }
          setTimeout(() => setVisible(false), 50);
        }, 150);
      }
    };

    const interval = setInterval(flash, 2000);
    return () => clearInterval(interval);
  }, [intensity]);

  const lightningGeometry = useMemo(() => {
    const points = [];
    let y = 20;
    points.push(new THREE.Vector3(0, y, -15));
    while (y > -10) {
      y -= 2 + Math.random() * 3;
      const x = (Math.random() - 0.5) * 4;
      points.push(new THREE.Vector3(x, y, -15));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [visible]);

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 10, 0]} color="#ffffff" intensity={0} distance={100} />
      {visible && (
        <line geometry={lightningGeometry}>
          <lineBasicMaterial color="#ffffff" linewidth={3} transparent opacity={0.9} />
        </line>
      )}
    </group>
  );
});

Lightning.displayName = 'Lightning';

/**
 * 增强版水波纹
 */
const EnhancedRipples: React.FC<{ count: number; color: string }> = memo(({ count, color }) => {
  const ripplesRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const ripples = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [(Math.random() - 0.5) * 20, -4.8, (Math.random() - 0.5) * 20] as [number, number, number],
      scale: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (ripplesRef.current) {
      ripplesRef.current.children.forEach((ripple, i) => {
        const scale = (Math.sin(timeRef.current * 2 + ripples[i].phase) + 1) * ripples[i].scale;
        ripple.scale.setScalar(scale);
        const material = (ripple as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = (1 - scale / 4) * 0.6;
      });
    }
  });

  const rippleGeometry = useMemo(() => new THREE.RingGeometry(0.1, 0.15, 32), []);
  const rippleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [color]
  );

  return (
    <group ref={ripplesRef}>
      {ripples.map((ripple) => (
        <mesh key={ripple.id} position={ripple.position} rotation={[-Math.PI / 2, 0, 0]} geometry={rippleGeometry} material={rippleMaterial} />
      ))}
    </group>
  );
});

EnhancedRipples.displayName = 'EnhancedRipples';

/**
 * 雨滴粒子动画
 */
const rainyAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  time: number,
  props: AdvancedParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 快速下落 + 水平偏移
    positions[i3 + 1] -= 0.4 + Math.random() * 0.2;
    positions[i3] += Math.sin(time * 2 + i * 0.1) * 0.01;

    // 重置到顶部
    if (positions[i3 + 1] < -spread / 2) {
      positions[i3 + 1] = spread / 2;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
    }
  }
};

/**
 * 雾气动画
 */
const mistAnimate = (
  positions: Float32Array,
  velocities: Float32Array,
  deltaTime: number,
  time: number,
  props: AdvancedParticleSystemProps
) => {
  const { count = 1000, spread = 10 } = props;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 缓慢水平移动
    positions[i3] += Math.sin(time * 0.5 + i * 0.2) * 0.02;
    positions[i3 + 1] += Math.cos(time * 0.3 + i * 0.15) * 0.01;
    positions[i3 + 2] += Math.sin(time * 0.4 + i * 0.1) * 0.02;

    // 边界检测
    if (Math.abs(positions[i3]) > spread / 2) positions[i3] *= -0.9;
    if (Math.abs(positions[i3 + 1]) > spread / 2) positions[i3 + 1] *= -0.9;
    if (Math.abs(positions[i3 + 2]) > spread / 2) positions[i3 + 2] *= -0.9;
  }
};

/**
 * 增强版雨天效果主组件
 */
const EnhancedRainyEffect: React.FC<EnhancedRainyEffectProps> = memo(
  ({ intensity = 1, particleCount = 5000 }) => {
    const colors = getWeatherColors(WeatherType.RAINY);

    return (
      <group>
        {/* 主雨滴粒子 */}
        <AdvancedParticleSystem
          count={particleCount}
          color={colors.primary}
          secondaryColor={colors.accent}
          sizeRange={[0.8, 2]}
          spread={30}
          speed={intensity * 1.5}
          opacity={0.7}
          animate={rainyAnimate}
        />

        {/* 细雨 */}
        <AdvancedParticleSystem
          count={particleCount / 2}
          color={colors.secondary}
          secondaryColor={colors.primary}
          sizeRange={[0.3, 0.8]}
          spread={35}
          speed={intensity * 2}
          opacity={0.5}
          animate={rainyAnimate}
        />

        {/* 雾气 */}
        <AdvancedParticleSystem
          count={800}
          color={colors.primary}
          secondaryColor={colors.secondary}
          sizeRange={[3, 6]}
          spread={40}
          speed={intensity * 0.3}
          opacity={0.15}
          animate={mistAnimate}
        />

        {/* 水波纹 */}
        <EnhancedRipples count={30} color={colors.primary} />

        {/* 闪电 */}
        <Lightning intensity={intensity} />

        {/* 蓝色光源 */}
        <pointLight position={[0, 10, 0]} color={colors.accent} intensity={intensity * 2} distance={50} />
        <pointLight position={[15, 5, 0]} color={colors.secondary} intensity={intensity * 1.2} distance={40} />
        <pointLight position={[-15, 5, 0]} color={colors.primary} intensity={intensity * 1.2} distance={40} />

        {/* 环境光 */}
        <ambientLight color={colors.secondary} intensity={0.3} />
      </group>
    );
  }
);

EnhancedRainyEffect.displayName = 'EnhancedRainyEffect';

export { EnhancedRainyEffect };
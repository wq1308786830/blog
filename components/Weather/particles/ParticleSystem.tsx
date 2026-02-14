/**
 * 通用粒子系统基类
 * 使用 BufferGeometry + Points 实现高性能渲染
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { memo } from 'react';

export interface ParticleSystemProps {
  /** 粒子数量 */
  count?: number;
  /** 粒子颜色 */
  color?: string;
  /** 粒子大小 */
  size?: number;
  /** 扩散范围 */
  spread?: number;
  /** 动画速度 */
  speed?: number;
  /** 自定义动画函数 */
  animate?: (
    positions: Float32Array,
    velocities: Float32Array,
    deltaTime: number,
    props: ParticleSystemProps
  ) => void;
  /** 粒子透明度 */
  opacity?: number;
  /** 是否使用点精灵 */
  useSprite?: boolean;
}

/**
 * 粒子系统组件
 */
const ParticleSystem: React.FC<ParticleSystemProps> = memo(
  ({
    count = 1000,
    color = '#ffffff',
    size = 0.1,
    spread = 10,
    speed = 1,
    animate,
    opacity = 0.8,
    useSprite = true,
  }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const velocitiesRef = useRef<Float32Array>(null!);
    const timeRef = useRef(0);

    // 初始化粒子位置和速度
    const { positions, velocities } = useMemo(() => {
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // 随机位置
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 1] = (Math.random() - 0.5) * spread;
        positions[i3 + 2] = (Math.random() - 0.5) * spread;

        // 随机速度
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      }

      velocitiesRef.current = velocities;
      return { positions, velocities };
    }, [count, spread]);

    // 创建 BufferGeometry
    const geometry = useMemo(() => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return geo;
    }, [positions]);

    // 创建材质
    const material = useMemo(() => {
      return new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    }, [color, size, opacity]);

    // 动画循环
    useFrame((state, delta) => {
      if (!pointsRef.current) return;

      timeRef.current += delta * speed;
      const positionAttribute = pointsRef.current.geometry.getAttribute('position');
      const positions = positionAttribute.array as Float32Array;
      const velocities = velocitiesRef.current;

      // 自定义动画或默认动画
      if (animate) {
        animate(positions, velocities, delta, { count, color, size, spread, speed, opacity });
      } else {
        // 默认动画：随机飘动
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];

          // 边界检测
          if (Math.abs(positions[i3]) > spread / 2) velocities[i3] *= -1;
          if (Math.abs(positions[i3 + 1]) > spread / 2) velocities[i3 + 1] *= -1;
          if (Math.abs(positions[i3 + 2]) > spread / 2) velocities[i3 + 2] *= -1;
        }
      }

      positionAttribute.needsUpdate = true;
    });

    // 清理
    useEffect(() => {
      return () => {
        geometry.dispose();
        material.dispose();
      };
    }, [geometry, material]);

    return <points ref={pointsRef} geometry={geometry} material={material} />;
  }
);

ParticleSystem.displayName = 'ParticleSystem';

export { ParticleSystem };
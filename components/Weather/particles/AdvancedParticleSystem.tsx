/**
 * 高级粒子系统 - 使用自定义着色器
 * 支持发光、动态颜色、脉动效果
 */

'use client';

import { useRef, useMemo, useEffect, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createAdvancedParticleMaterial,
  createGlowTexture,
} from '../shaders/advancedShaders';

export interface AdvancedParticleSystemProps {
  /** 粒子数量 */
  count?: number;
  /** 主颜色 */
  color?: string;
  /** 次颜色 */
  secondaryColor?: string;
  /** 粒子大小范围 */
  sizeRange?: [number, number];
  /** 扩散范围 */
  spread?: number;
  /** 动画速度 */
  speed?: number;
  /** 自定义动画函数 */
  animate?: (
    positions: Float32Array,
    velocities: Float32Array,
    deltaTime: number,
    time: number,
    props: AdvancedParticleSystemProps
  ) => void;
  /** 基础透明度 */
  opacity?: number;
  /** 是否使用自定义着色器 */
  useCustomShader?: boolean;
  /** 脉动强度 */
  pulseIntensity?: number;
}

/**
 * 高级粒子系统组件
 */
const AdvancedParticleSystem: React.FC<AdvancedParticleSystemProps> = memo(
  ({
    count = 1000,
    color = '#ffffff',
    secondaryColor,
    sizeRange = [0.5, 2],
    spread = 10,
    speed = 1,
    animate,
    opacity = 0.8,
    useCustomShader = true,
    pulseIntensity = 0.3,
  }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const timeRef = useRef(0);

    // 初始化粒子属性
    const { positions, colors, sizes, alphas, speeds, velocities } = useMemo(() => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const alphas = new Float32Array(count);
      const speeds = new Float32Array(count);
      const velocities = new Float32Array(count * 3);

      const color1 = new THREE.Color(color);
      const color2 = new THREE.Color(secondaryColor || color);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // 随机位置
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 1] = (Math.random() - 0.5) * spread;
        positions[i3 + 2] = (Math.random() - 0.5) * spread;

        // 渐变颜色
        const mixFactor = Math.random();
        const mixedColor = color1.clone().lerp(color2, mixFactor);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        // 随机大小
        sizes[i] = THREE.MathUtils.lerp(sizeRange[0], sizeRange[1], Math.random());

        // 随机透明度
        alphas[i] = Math.random() * opacity;

        // 随机速度
        speeds[i] = 0.5 + Math.random() * 1.5;

        // 随机速度向量
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      }

      return { positions, colors, sizes, alphas, speeds, velocities };
    }, [count, color, secondaryColor, sizeRange, spread, opacity]);

    // 创建几何体
    const geometry = useMemo(() => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
      geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
      return geo;
    }, [positions, colors, sizes, alphas, speeds]);

    // 创建材质
    const material = useMemo(() => {
      if (useCustomShader) {
        return createAdvancedParticleMaterial(0, createGlowTexture());
      }
      return new THREE.PointsMaterial({
        color,
        size: 0.5,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    }, [useCustomShader, color, opacity]);

    // 动画循环
    useFrame((state, delta) => {
      if (!pointsRef.current) return;

      timeRef.current += delta * speed;

      // 更新着色器时间
      if (useCustomShader && materialRef.current) {
        materialRef.current.uniforms.time.value = timeRef.current;
      }

      const positionAttribute = pointsRef.current.geometry.getAttribute('position');
      const positions = positionAttribute.array as Float32Array;

      // 自定义动画或默认动画
      if (animate) {
        animate(positions, velocities, delta, timeRef.current, {
          count,
          color,
          secondaryColor,
          sizeRange,
          spread,
          speed,
          opacity,
          useCustomShader,
          pulseIntensity,
        });
      } else {
        // 默认动画：随机飘动
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3] += velocities[i3] * speed;
          positions[i3 + 1] += velocities[i3 + 1] * speed;
          positions[i3 + 2] += velocities[i3 + 2] * speed;

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

    return (
      <points ref={pointsRef} geometry={geometry}>
        <primitive object={material} ref={materialRef} attach="material" />
      </points>
    );
  }
);

AdvancedParticleSystem.displayName = 'AdvancedParticleSystem';

export { AdvancedParticleSystem };
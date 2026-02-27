/**
 * 赛博朋克粒子系统
 * 使用Points优化性能,支持数万粒子
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNeonParticleMaterial } from '../shaders/cyberpunkShaders';

export interface CyberpunkParticleSystemProps {
  count?: number;
  primaryColor?: string;
  secondaryColor?: string;
  spread?: number;
  speed?: number;
  sizeMultiplier?: number;
}

export const CyberpunkParticleSystem: React.FC<CyberpunkParticleSystemProps> = ({
  count = 15000,
  primaryColor = '#00ffff',
  secondaryColor = '#ff00ff',
  spread = 30,
  speed = 1,
  sizeMultiplier = 1,
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 初始化粒子属性
  const { positions, colors, sizes, alphas, glitches } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const glitches = new Float32Array(count);

    const primaryColorObj = new THREE.Color(primaryColor);
    const secondaryColorObj = new THREE.Color(secondaryColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 位置
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = Math.random() * spread - spread / 2;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;

      // 颜色混合
      const mixRatio = Math.random();
      const color = primaryColorObj.clone().lerp(secondaryColorObj, mixRatio);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // 大小 - 应用倍数
      sizes[i] = (0.2 + Math.random() * 0.5) * sizeMultiplier;

      // 透明度
      alphas[i] = 0.5 + Math.random() * 0.5;

      // 故障强度
      glitches[i] = Math.random() * 0.5;
    }

    return { positions, colors, sizes, alphas, glitches };
  }, [count, primaryColor, secondaryColor, spread, sizeMultiplier]);

  // 创建几何体
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('glitchIntensity', new THREE.BufferAttribute(glitches, 1));
    return geo;
  }, [positions, colors, sizes, alphas, glitches]);

  // 创建材质
  const material = useMemo(() => createNeonParticleMaterial(), []);

  // 鼠标移动监听
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 动画循环
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;

    // 更新粒子位置
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 雨滴下落
      positions[i3 + 1] -= (0.3 + Math.random() * 0.2) * speed;

      // 水平摆动
      positions[i3] += Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.01;

      // 重置到顶部
      if (positions[i3 + 1] < -spread / 2) {
        positions[i3 + 1] = spread / 2;
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 2] = (Math.random() - 0.5) * spread;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // 更新shader uniforms
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.mousePos.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
};
/**
 * Three.js 游戏场景
 * 古风水墨风格背景
 */

'use client';

import { memo, Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== 水墨云雾效果 ====================

const InkClouds = memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const count = 30;

  const clouds = useMemo(() => {
    const cloudData = [];
    for (let i = 0; i < count; i++) {
      cloudData.push({
        position: [
          (Math.random() - 0.5) * 150,
          Math.random() * 20 + 10,
          (Math.random() - 0.5) * 150,
        ] as [number, number, number],
        scale: Math.random() * 5 + 3,
        opacity: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.02 + 0.01,
      });
    }
    return cloudData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.x += clouds[i].speed * Math.sin(state.clock.elapsedTime * 0.5);
        child.position.z += clouds[i].speed * Math.cos(state.clock.elapsedTime * 0.3);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 8]} />
          <meshBasicMaterial
            color="#e8e4dc"
            transparent
            opacity={cloud.opacity}
          />
        </mesh>
      ))}
    </group>
  );
});

InkClouds.displayName = 'InkClouds';

// ==================== 主场景组件 ====================

interface GameSceneProps {
  territories?: unknown[];
  selectedTerritoryId?: string | null;
}

const GameScene = memo(({ territories, selectedTerritoryId }: GameSceneProps) => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'transparent',
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 50, 50], fov: 45 }}
    >
      <Suspense fallback={null}>
        {/* 环境光 */}
        <ambientLight intensity={0.8} />
        <color attach="background" args={['transparent']} />

        {/* 水墨云雾 */}
        <InkClouds />
      </Suspense>
    </Canvas>
  );
});

GameScene.displayName = 'GameScene';

export { GameScene };
export default GameScene;
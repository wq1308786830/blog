/**
 * Three.js 游戏场景
 * 赛博朋克风格地图背景
 */

'use client';

import { memo, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { Territory } from './types/gameTypes';

interface GameSceneProps {
  territories: Territory[];
  selectedTerritoryId?: string | null;
}

// 网格背景
const CyberpunkGrid = memo(() => {
  const gridConfig = useMemo(
    () => ({
      position: new THREE.Vector3(0, -2, 0),
      args: [100, 100] as [number, number],
    }),
    []
  );

  return (
    <gridHelper
      position={gridConfig.position}
      args={[...gridConfig.args, 50, 50]}
      material={new THREE.LineBasicMaterial({ color: 0x00f5ff, opacity: 0.15, transparent: true })}
    />
  );
});

CyberpunkGrid.displayName = 'CyberpunkGrid';

// 领地标记
const TerritoryMarkers = memo(({ territories, selectedTerritoryId }: GameSceneProps) => {
  const markers = useMemo(() => {
    return territories.map((territory) => {
      const isSelected = territory.id === selectedTerritoryId;
      const isOwned = !!territory.ownerId;

      // 根据状态确定颜色
      let color = 0x666666; // 默认灰色
      if (isOwned) {
        color = territory.ownerId === 'faction-player' ? 0x00f5ff : 0xff0066;
      }

      return {
        id: territory.id,
        position: new THREE.Vector3(territory.position.x, territory.position.y, territory.position.z || 0),
        color,
        isSelected,
        size: isSelected ? 0.5 : 0.3,
      };
    });
  }, [territories, selectedTerritoryId]);

  return (
    <>
      {markers.map((marker) => (
        <group key={marker.id} position={marker.position}>
          {/* 领地核心 */}
          <mesh>
            <octahedronGeometry args={[marker.size, 0]} />
            <meshBasicMaterial
              color={marker.color}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 选中时的光环 */}
          {marker.isSelected && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.8, 32]} />
              <meshBasicMaterial
                color={0x00f5ff}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* 发光效果 */}
          <pointLight
            color={marker.color}
            intensity={marker.isSelected ? 2 : 0.5}
            distance={5}
            decay={2}
          />
        </group>
      ))}
    </>
  );
});

TerritoryMarkers.displayName = 'TerritoryMarkers';

// 粒子效果
const ParticleField = memo(() => {
  const count = 200;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      // 赛博朋克颜色
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0;
      }
    }

    return [positions, colors];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
});

ParticleField.displayName = 'ParticleField';

// 连接线
const TerritoryConnections = memo(({ territories }: { territories: Territory[] }) => {
  const lines = useMemo(() => {
    const points: THREE.Vector3[] = [];

    territories.forEach((territory) => {
      territory.connectedTo.forEach((connectedId) => {
        const connected = territories.find((t) => t.id === connectedId);
        if (connected && territory.id < connectedId) { // 避免重复
          points.push(
            new THREE.Vector3(territory.position.x, territory.position.y, territory.position.z || 0),
            new THREE.Vector3(connected.position.x, connected.position.y, connected.position.z || 0)
          );
        }
      });
    });

    return points;
  }, [territories]);

  if (lines.length === 0) return null;

  const geometry = new THREE.BufferGeometry().setFromPoints(lines);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={0x00f5ff} transparent opacity={0.2} />
    </lineSegments>
  );
});

TerritoryConnections.displayName = 'TerritoryConnections';

// 主场景组件
const GameScene = memo(({ territories, selectedTerritoryId }: GameSceneProps) => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // 让点击穿透到地图
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 30], fov: 60 }}
    >
      <Suspense fallback={null}>
        {/* 环境 */}
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.3} />

        {/* 星空背景 */}
        <Stars
          radius={100}
          depth={50}
          count={1000}
          factor={4}
          saturation={0.5}
          fade
          speed={0.5}
        />

        {/* 网格 */}
        <CyberpunkGrid />

        {/* 粒子场 */}
        <ParticleField />

        {/* 领地标记 */}
        <TerritoryMarkers territories={territories} selectedTerritoryId={selectedTerritoryId} />

        {/* 领地连接线 */}
        <TerritoryConnections territories={territories} />

        {/* 摄像机控制 */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={60}
        />

        {/* 后期处理 */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
});

GameScene.displayName = 'GameScene';

export { GameScene };
export default GameScene;

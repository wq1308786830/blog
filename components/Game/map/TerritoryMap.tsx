/**
 * 领土地图组件
 * 古风水墨风格3D地图 - 2.5D等轴视角
 * 支持拖拽缩放和战斗功能
 */
'use client';

import { memo, useCallback, useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Territory } from '../types/gameTypes';
import { HistoricalMap } from './HistoricalMap';
import {
  FACTION_TERRITORIES,
  MAP_BOUNDS,
  geoToMapCoord,
  isPointInPolygon,
  type GeoPoint,
} from '../data/geoData';
import './territoryMap.css';

// ==================== 类型定义 ====================

interface TerritoryMapProps {
  territories: Territory[];
  selectedTerritoryId?: string | null;
  onTerritorySelect: (territoryId: string) => void;
  onBattle?: (fromId: string, toId: string) => void;
  playerFactionId: string;
}

// ==================== 等轴相机控制器 ====================

const IsometricCamera = ({ zoom, position }: { zoom: number; position: { x: number; y: number } }) => {
  const { camera } = useThree();

  useEffect(() => {
    // 设置等轴视角（45度俯视）
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 1, 0);
  }, [camera]);

  useFrame(() => {
    // 更新相机位置
    camera.position.x = 50 + position.x * 0.5;
    camera.position.z = 50 - position.y * 0.5;
  });

  return null;
};

// ==================== 射线检测器 ====================

const RaycasterHandler = ({
  onTerritoryClick,
  selectedFactionId,
}: {
  onTerritoryClick?: (factionId: string) => void;
  selectedFactionId?: string | null;
}) => {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      // 检测点击位置对应的地理坐标
      // 这里简化处理，通过屏幕坐标反推地理坐标
      const x = mouse.current.x * 55;
      const y = -mouse.current.y * 55;

      // 转换为地理坐标
      const geoX = x / 55 * ((MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng) / 2);
      const geoY = y / 55 * ((MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) / 2);

      const clickPoint: GeoPoint = {
        lng: geoX,
        lat: -geoY,
      };

      // 检查点击了哪个势力领地
      for (const territory of FACTION_TERRITORIES) {
        for (const border of territory.borders) {
          if (isPointInPolygon(clickPoint, border.points)) {
            onTerritoryClick?.(territory.factionId);
            return;
          }
        }
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, onTerritoryClick]);

  return null;
};

// ==================== 地图UI层 ====================

const MapUI = memo(({
  onZoomIn,
  onZoomOut,
  onReset,
  canAttack,
  attackMode,
  onToggleAttackMode,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canAttack: boolean;
  attackMode: boolean;
  onToggleAttackMode: () => void;
}) => {
  return (
    <>
      {/* 缩放控制 */}
      <div className="map-controls">
        <button onClick={onZoomIn} title="放大">+</button>
        <button onClick={onZoomOut} title="缩小">-</button>
        <button onClick={onReset} title="重置">⟲</button>
        {canAttack && (
          <button
            className={`attack-btn ${attackMode ? 'active' : ''}`}
            onClick={onToggleAttackMode}
            title="攻击模式"
          >
            ⚔️
          </button>
        )}
      </div>

      {/* 图例 */}
      <div className="map-legend">
        <div className="legend-title">势力图例</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color player" />
            <span>玩家</span>
          </div>
          <div className="legend-item">
            <span className="legend-color neutral" />
            <span>中立</span>
          </div>
          <div className="legend-item">
            <span className="legend-color enemy" />
            <span>敌对</span>
          </div>
        </div>
      </div>
    </>
  );
});

MapUI.displayName = 'MapUI';

// ==================== 主组件 ====================

const TerritoryMap = memo(({
  territories,
  selectedTerritoryId,
  onTerritorySelect,
  onBattle,
  playerFactionId,
}: TerritoryMapProps) => {
  // ==================== State ====================
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [attackMode, setAttackMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // ==================== Callbacks ====================

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z * 0.8, 0.3));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleToggleAttackMode = useCallback(() => {
    setAttackMode((prev) => !prev);
  }, []);

  const handleFactionClick = useCallback((factionId: string) => {
    // 找到对应的领地ID
    const territory = territories.find((t) => t.ownerId === factionId);
    if (territory) {
      if (attackMode && selectedTerritoryId && selectedTerritoryId !== territory.id) {
        onBattle?.(selectedTerritoryId, territory.id);
        setAttackMode(false);
      } else {
        onTerritorySelect(territory.id);
      }
    }
  }, [territories, attackMode, selectedTerritoryId, onBattle, onTerritorySelect]);

  // ==================== 计算属性 ====================

  const selectedTerritory = territories.find((t) => t.id === selectedTerritoryId);
  const canAttack = selectedTerritory?.ownerId !== undefined &&
    selectedTerritory.ownerId !== playerFactionId;

  // ==================== 渲染 ====================

  return (
    <div
      className="territory-map"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Canvas
        orthographic
        camera={{
          zoom: zoom * 2,
          position: [50, 50, 50],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        style={{
          background: 'transparent',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          {/* 环境光 */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[50, 50, 25]} intensity={0.8} />

          {/* 历史地图 */}
          <HistoricalMap
            onTerritoryClick={handleFactionClick}
            selectedFactionId={selectedTerritory?.ownerId}
          />

          {/* 相机控制 */}
          <OrbitControls
            enableRotate={false}
            enablePan={true}
            enableZoom={true}
            minZoom={0.3}
            maxZoom={3}
            panSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* UI层 */}
      <MapUI
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        canAttack={!!canAttack}
        attackMode={attackMode}
        onToggleAttackMode={handleToggleAttackMode}
      />

      {/* 攻击模式提示 */}
      {attackMode && (
        <div className="attack-hint">
          点击目标领地发起攻击
        </div>
      )}
    </div>
  );
});

TerritoryMap.displayName = 'TerritoryMap';

export { TerritoryMap };
export default TerritoryMap;
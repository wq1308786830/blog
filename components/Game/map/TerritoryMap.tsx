/**
 * 领土地图组件
 * 赛博朋克风格的2D地图 - 带拖拽缩放和战斗功能
 * 遵循 React Hooks 规则：所有 hooks 在组件开头调用
 */
'use client';

import { memo, useCallback, useState, useRef } from 'react';
import type { Territory } from '../types/gameTypes';
import './territoryMap.css';

interface TerritoryMapProps {
  territories: Territory[];
  selectedTerritoryId?: string | null;
  onTerritorySelect: (territoryId: string) => void;
  onBattle?: (fromId: string, toId: string) => void;
  playerFactionId: string;
}

// 势力颜色映射
const factionColors: Record<string, string> = {
  'faction-zhou': '#FFD700',
  'faction-qin': '#00f5ff',
  'faction-qi': '#ff0066',
  'faction-chu': '#ff6600',
  'faction-jin': '#9900ff',
  'faction-wei': '#00ff66',
  'faction-zhao': '#ffcc00',
  'faction-han': '#0066ff',
  'faction-yan': '#ff0000',
  'faction-wu': '#00ffff',
  'faction-yue': '#ff99cc',
  'faction-song': '#cc99ff',
  'faction-lu': '#99ff99',
  'faction-zheng': '#ffcc99',
  'faction-chen': '#99ccff',
  'faction-ba': '#cccccc',
  'faction-shu': '#888888',
};

// 辅助函数：计算领地边界
const calculateBounds = (territories: Territory[]) => {
  if (!territories || territories.length === 0) {
    return null;
  }
  return {
    minX: Math.min(...territories.map((t) => t.position.x)) - 5,
    maxX: Math.max(...territories.map((t) => t.position.x)) + 5,
    minY: Math.min(...territories.map((t) => t.position.y)) - 5,
    maxY: Math.max(...territories.map((t) => t.position.y)) + 5,
  };
};

const TerritoryMap = memo(({
  territories,
  selectedTerritoryId,
  onTerritorySelect,
  onBattle,
  playerFactionId,
}: TerritoryMapProps) => {
  // ==================== 1. useState Hooks ====================
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [attackMode, setAttackMode] = useState(false);

  // ==================== 2. useRef Hooks ====================
  const svgRef = useRef<SVGSVGElement>(null);

  // ==================== 3. useCallback Hooks ====================
  const toSvgCoords = useCallback((x: number, y: number, bounds: { minX: number; maxX: number; minY: number; maxY: number }, width: number, height: number) => ({
    x: ((x - bounds.minX) / width) * 100,
    y: ((bounds.maxY - y) / height) * 100,
  }), []);

  const getTerritoryColor = useCallback((territory: Territory) => {
    if (territory.ownerId) {
      return factionColors[territory.ownerId] || '#666666';
    }
    return '#444444';
  }, []);

  const getTerritoryClass = useCallback((territory: Territory, selectedId: string | null | undefined, isAttackMode: boolean) => {
    const classes = ['territory-node'];
    if (territory.id === selectedId) {
      classes.push('selected');
    }
    if (territory.ownerId === playerFactionId) {
      classes.push('player-owned');
    } else if (territory.ownerId) {
      classes.push('enemy-owned');
    } else {
      classes.push('neutral');
    }
    if (territory.isCapital) {
      classes.push('capital');
    }
    if (isAttackMode && territory.ownerId && territory.ownerId !== playerFactionId) {
      classes.push('attack-target');
    }
    return classes.join(' ');
  }, [playerFactionId]);

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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.5), 4));
  }, []);

  const handleTerritoryClick = useCallback((territory: Territory) => {
    if (attackMode && selectedTerritoryId && selectedTerritoryId !== territory.id) {
      onBattle?.(selectedTerritoryId, territory.id);
      setAttackMode(false);
    } else {
      onTerritorySelect(territory.id);
    }
  }, [attackMode, selectedTerritoryId, onBattle, onTerritorySelect]);

  const handleZoomIn = useCallback(() => {
    setScale(s => Math.min(s * 1.2, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(s => Math.max(s * 0.8, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleToggleAttackMode = useCallback(() => {
    setAttackMode(prev => !prev);
  }, []);

  // ==================== 4. 条件返回 - 在所有 Hooks 之后 ====================
  if (!territories || territories.length === 0) {
    return (
      <div className="territory-map loading">
        <div className="loading-spinner">加载地图中...</div>
      </div>
    );
  }

  // ==================== 5. 渲染逻辑 ====================
  const bounds = calculateBounds(territories);
  const width = bounds ? bounds.maxX - bounds.minX : 0;
  const height = bounds ? bounds.maxY - bounds.minY : 0;
  const selectedTerritory = territories.find(t => t.id === selectedTerritoryId);
  const canAttack = selectedTerritory?.ownerId !== undefined && selectedTerritory.ownerId !== playerFactionId;

  return (
    <div className="territory-map">
      {/* 缩放控制 */}
      <div className="map-controls">
        <button onClick={handleZoomIn} title="放大">+</button>
        <button onClick={handleZoomOut} title="缩小">-</button>
        <button onClick={handleReset} title="重置">⟲</button>
        {canAttack && (
          <button
            className={`attack-btn ${attackMode ? 'active' : ''}`}
            onClick={handleToggleAttackMode}
            title="攻击模式"
          >
            ⚔️
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        className="map-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* 连接线 */}
        <g className="connections">
          {territories.map((territory) =>
            territory.connectedTo.map((connectedId) => {
              const connected = territories.find((t) => t.id === connectedId);
              if (!connected || territory.id > connectedId || !bounds) return null;
              const start = toSvgCoords(territory.position.x, territory.position.y, bounds, width, height);
              const end = toSvgCoords(connected.position.x, connected.position.y, bounds, width, height);
              return (
                <line
                  key={`${territory.id}-${connectedId}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className="connection-line"
                />
              );
            })
          )}
        </g>

        {/* 领地节点 */}
        <g className="territories">
          {territories.map((territory) => {
            if (!bounds) return null;
            const pos = toSvgCoords(territory.position.x, territory.position.y, bounds, width, height);
            const color = getTerritoryColor(territory);
            return (
              <g
                key={territory.id}
                className={getTerritoryClass(territory, selectedTerritoryId, attackMode)}
                onClick={() => handleTerritoryClick(territory)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={territory.isCapital ? 4 : 2.5}
                  fill={color}
                  className="territory-circle"
                />
                {territory.id === selectedTerritoryId && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={territory.isCapital ? 6 : 4}
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="0.5"
                    className="selection-ring"
                  />
                )}
                <text
                  x={pos.x}
                  y={pos.y + (territory.isCapital ? 7 : 5)}
                  textAnchor="middle"
                  className="territory-label"
                  fontSize={territory.isCapital ? 2.5 : 2}
                >
                  {territory.name}
                </text>
                {territory.isCapital && (
                  <text
                    x={pos.x}
                    y={pos.y - 5}
                    textAnchor="middle"
                    className="capital-marker"
                    fontSize={3}
                  >
                    ★
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 攻击模式提示 */}
      {attackMode && (
        <div className="attack-hint">
          点击目标领地发起攻击
        </div>
      )}

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
    </div>
  );
});

TerritoryMap.displayName = 'TerritoryMap';
export { TerritoryMap };
export default TerritoryMap;
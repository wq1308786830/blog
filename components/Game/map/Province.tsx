/**
 * 领地详情组件
 * 显示单个领地的完整信息
 */

'use client';

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Territory, Building, Army } from '../types/gameTypes';
import { TerrainType, TerritoryStatus, BuildingType } from '../types/gameTypes';
import './province.css';

interface ProvinceProps {
  territory: Territory;
  armies?: Army[];
  isVisible?: boolean;
  onClose?: () => void;
  onBuild?: (buildingType: BuildingType) => void;
  onRecruit?: () => void;
  onManage?: () => void;
  isOwned?: boolean;
}

// 地形名称映射
const terrainNames: Record<TerrainType, string> = {
  [TerrainType.PLAIN]: '平原',
  [TerrainType.MOUNTAIN]: '山地',
  [TerrainType.RIVER]: '河流',
  [TerrainType.FOREST]: '森林',
  [TerrainType.DESERT]: '沙漠',
  [TerrainType.SWAMP]: '沼泽',
};

// 地形图标映射
const terrainIcons: Record<TerrainType, string> = {
  [TerrainType.PLAIN]: '🌾',
  [TerrainType.MOUNTAIN]: '⛰️',
  [TerrainType.RIVER]: '🌊',
  [TerrainType.FOREST]: '🌲',
  [TerrainType.DESERT]: '🏜️',
  [TerrainType.SWAMP]: '🌿',
};

// 地形颜色映射
const terrainColors: Record<TerrainType, string> = {
  [TerrainType.PLAIN]: '#90EE90',
  [TerrainType.MOUNTAIN]: '#8B7355',
  [TerrainType.RIVER]: '#4169E1',
  [TerrainType.FOREST]: '#228B22',
  [TerrainType.DESERT]: '#DEB887',
  [TerrainType.SWAMP]: '#556B2F',
};

// 状态名称映射
const statusNames: Record<TerritoryStatus, string> = {
  [TerritoryStatus.NEUTRAL]: '中立',
  [TerritoryStatus.OWNED]: '己方',
  [TerritoryStatus.OCCUPIED]: '占领',
  [TerritoryStatus.CONTESTED]: '争夺中',
  [TerritoryStatus.DEVASTATED]: '荒废',
};

// 状态颜色映射
const statusColors: Record<TerritoryStatus, string> = {
  [TerritoryStatus.NEUTRAL]: '#888888',
  [TerritoryStatus.OWNED]: '#00f5ff',
  [TerritoryStatus.OCCUPIED]: '#ff0066',
  [TerritoryStatus.CONTESTED]: '#ffcc00',
  [TerritoryStatus.DEVASTATED]: '#ff0000',
};

// 建筑类型名称映射
const buildingTypeNames: Record<BuildingType, string> = {
  [BuildingType.FARM]: '农田',
  [BuildingType.MINE]: '矿场',
  [BuildingType.BARRACKS]: '兵营',
  [BuildingType.MARKET]: '市场',
  [BuildingType.ACADEMY]: '学院',
  [BuildingType.WALL]: '城墙',
  [BuildingType.TEMPLE]: '神庙',
};

// 建筑图标映射
const buildingTypeIcons: Record<BuildingType, string> = {
  [BuildingType.FARM]: '🌾',
  [BuildingType.MINE]: '⛏️',
  [BuildingType.BARRACKS]: '⚔️',
  [BuildingType.MARKET]: '🏪',
  [BuildingType.ACADEMY]: '📚',
  [BuildingType.WALL]: '🏰',
  [BuildingType.TEMPLE]: '🏛️',
};

// 资源图标映射
const resourceIcons: Record<string, string> = {
  population: '👥',
  food: '🌾',
  gold: '💰',
  wood: '🪵',
  iron: '⛏️',
  prestige: '👑',
};

// 资源名称映射
const resourceNames: Record<string, string> = {
  population: '人口',
  food: '粮食',
  gold: '金钱',
  wood: '木材',
  iron: '铁矿',
  prestige: '声望',
};

// 建筑卡片组件
interface BuildingCardProps {
  building: Building;
}

const BuildingCard = memo(({ building }: BuildingCardProps) => (
  <div className="building-card">
    <div className="building-icon">{buildingTypeIcons[building.type]}</div>
    <div className="building-info">
      <span className="building-name">{building.name}</span>
      <span className="building-level">Lv.{building.level}</span>
    </div>
    <div className="building-effects">
      {building.effects.map((effect, i) => (
        <span key={i} className="effect-badge">
          {resourceIcons[effect.type as string] || '📊'} {effect.value > 0 ? '+' : ''}{effect.value}
        </span>
      ))}
    </div>
  </div>
));

BuildingCard.displayName = 'BuildingCard';

// 可建造建筑选项
const BUILDING_OPTIONS: { type: BuildingType; cost: Record<string, number>; description: string }[] = [
  { type: BuildingType.FARM, cost: { gold: 100, wood: 50 }, description: '增加粮食产出' },
  { type: BuildingType.MINE, cost: { gold: 150, wood: 30 }, description: '增加铁矿产出' },
  { type: BuildingType.BARRACKS, cost: { gold: 200, iron: 50 }, description: '可在此招募军队' },
  { type: BuildingType.MARKET, cost: { gold: 100, wood: 30 }, description: '增加金钱收入' },
  { type: BuildingType.ACADEMY, cost: { gold: 300, wood: 50 }, description: '提升科技研究速度' },
  { type: BuildingType.WALL, cost: { gold: 150, iron: 100 }, description: '提升防御等级' },
  { type: BuildingType.TEMPLE, cost: { gold: 200, wood: 80 }, description: '增加声望和民心' },
];

const Province = memo(({
  territory,
  armies = [],
  isVisible = true,
  onClose,
  onBuild,
  onRecruit,
  onManage,
  isOwned = false,
}: ProvinceProps) => {
  // 计算资源总产出
  const totalResources = useMemo(() => {
    return Object.entries(territory.resources).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, number>);
  }, [territory.resources]);

  // 按类型分组建筑
  const groupedBuildings = useMemo(() => {
    const groups: Record<string, Building[]> = {};
    territory.buildings.forEach((building) => {
      if (!groups[building.type]) {
        groups[building.type] = [];
      }
      groups[building.type].push(building);
    });
    return groups;
  }, [territory.buildings]);

  // 本地军队
  const localArmies = useMemo(() => {
    return armies.filter((army) => army.currentTerritoryId === territory.id);
  }, [armies, territory.id]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="province-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="province-panel"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="province-header">
              <div className="province-title-row">
                <h2 className="province-name">{territory.name}</h2>
                {territory.isCapital && (
                  <span className="capital-badge">
                    <span className="capital-icon">★</span>
                    首都
                  </span>
                )}
              </div>
              <button className="close-button" onClick={onClose} aria-label="关闭">
                ×
              </button>
            </div>

            {/* 状态栏 */}
            <div className="province-status-bar">
              <div className="status-item">
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColors[territory.status] }}
                >
                  {statusNames[territory.status]}
                </span>
              </div>
              <div className="status-item">
                <span
                  className="terrain-badge"
                  style={{ color: terrainColors[territory.terrain] }}
                >
                  {terrainIcons[territory.terrain]} {terrainNames[territory.terrain]}
                </span>
              </div>
              <div className="status-item">
                <span className="population-badge">
                  👥 {territory.population.toLocaleString()}
                </span>
              </div>
              <div className="status-item">
                <span className="defense-badge">
                  🛡️ 防御 {territory.defenses}
                </span>
              </div>
            </div>

            {/* 描述 */}
            <p className="province-description">{territory.description}</p>

            {/* 历史信息 */}
            {territory.historicalInfo && (
              <div className="historical-info">
                <span className="historical-icon">📜</span>
                <p>{territory.historicalInfo}</p>
              </div>
            )}

            {/* 资源产出 */}
            <div className="province-section">
              <h3 className="section-title">
                <span className="title-icon">📊</span>
                资源产出
              </h3>
              <div className="resource-grid">
                {Object.entries(totalResources).map(([key, value]) => (
                  <div key={key} className="resource-item">
                    <span className="resource-icon">{resourceIcons[key]}</span>
                    <span className="resource-name">{resourceNames[key]}</span>
                    <span className="resource-value">+{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 建筑列表 */}
            <div className="province-section">
              <h3 className="section-title">
                <span className="title-icon">🏛️</span>
                建筑 ({territory.buildings.length})
              </h3>
              {territory.buildings.length > 0 ? (
                <div className="buildings-list">
                  {Object.entries(groupedBuildings).map(([type, buildings]) => (
                    <div key={type} className="building-group">
                      {buildings.map((building) => (
                        <BuildingCard key={building.id} building={building} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-buildings">
                  <span className="empty-icon">🏗️</span>
                  <p>暂无建筑</p>
                </div>
              )}
            </div>

            {/* 可建造建筑 */}
            {isOwned && (
              <div className="province-section">
                <h3 className="section-title">
                  <span className="title-icon">🔨</span>
                  建造
                </h3>
                <div className="build-options">
                  {BUILDING_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      className="build-option"
                      onClick={() => onBuild?.(option.type)}
                    >
                      <span className="option-icon">{buildingTypeIcons[option.type]}</span>
                      <span className="option-name">{buildingTypeNames[option.type]}</span>
                      <span className="option-desc">{option.description}</span>
                      <div className="option-cost">
                        {Object.entries(option.cost).map(([res, amount]) => (
                          <span key={res} className="cost-item">
                            {resourceIcons[res]} {amount}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 本地军队 */}
            {localArmies.length > 0 && (
              <div className="province-section">
                <h3 className="section-title">
                  <span className="title-icon">⚔️</span>
                  驻军 ({localArmies.length})
                </h3>
                <div className="local-armies">
                  {localArmies.map((army) => (
                    <div key={army.id} className="army-item">
                      <span className="army-name">{army.name}</span>
                      <span className="army-troops">
                        👥 {army.totalSoldiers.toLocaleString()}
                      </span>
                      <span className="army-morale">
                        💪 {army.morale}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 行动按钮 */}
            {isOwned && (
              <div className="province-actions">
                <button className="action-button recruit" onClick={onRecruit}>
                  <span className="button-icon">⚔️</span>
                  招募军队
                </button>
                <button className="action-button manage" onClick={onManage}>
                  <span className="button-icon">⚙️</span>
                  管理领地
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Province.displayName = 'Province';

export { Province };
export default Province;
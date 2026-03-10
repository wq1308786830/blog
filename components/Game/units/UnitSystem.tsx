/**
 * 单位系统组件
 * 管理军队招募、训练和配置
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Army, Unit, UnitType } from '../types/gameTypes';
import { UnitType as UnitTypeEnum } from '../types/gameTypes';
import './unitSystem.css';

// 招募成本配置
const recruitmentCosts: Record<UnitType, { population: number; gold: number; wood: number; iron: number }> = {
  [UnitTypeEnum.INFANTRY]: { population: 1, gold: 10, wood: 0, iron: 5 },
  [UnitTypeEnum.CAVALRY]: { population: 1, gold: 30, wood: 0, iron: 10 },
  [UnitTypeEnum.ARCHER]: { population: 1, gold: 15, wood: 10, iron: 2 },
  [UnitTypeEnum.CHARIOT]: { population: 2, gold: 50, wood: 20, iron: 15 },
  [UnitTypeEnum.SIEGE]: { population: 3, gold: 80, wood: 30, iron: 25 },
};

// 单位属性
const unitStats: Record<UnitType, { attack: number; defense: number; speed: number; description: string }> = {
  [UnitTypeEnum.INFANTRY]: {
    attack: 10,
    defense: 15,
    speed: 5,
    description: '基础兵种，攻守兼备，成本低廉',
  },
  [UnitTypeEnum.CAVALRY]: {
    attack: 20,
    defense: 10,
    speed: 10,
    description: '机动性强，适合快速突击和追击',
  },
  [UnitTypeEnum.ARCHER]: {
    attack: 15,
    defense: 5,
    speed: 6,
    description: '远程攻击，克制步兵，惧怕骑兵',
  },
  [UnitTypeEnum.CHARIOT]: {
    attack: 25,
    defense: 20,
    speed: 8,
    description: '春秋特色，冲锋威力巨大',
  },
  [UnitTypeEnum.SIEGE]: {
    attack: 30,
    defense: 8,
    speed: 2,
    description: '攻城专用，对城墙伤害加成',
  },
};

// 兵种名称
const unitNames: Record<UnitType, string> = {
  [UnitTypeEnum.INFANTRY]: '步兵',
  [UnitTypeEnum.CAVALRY]: '骑兵',
  [UnitTypeEnum.ARCHER]: '弓兵',
  [UnitTypeEnum.CHARIOT]: '战车',
  [UnitTypeEnum.SIEGE]: '攻城器械',
};

// 兵种图标
const unitIcons: Record<UnitType, string> = {
  [UnitTypeEnum.INFANTRY]: '⚔️',
  [UnitTypeEnum.CAVALRY]: '🐴',
  [UnitTypeEnum.ARCHER]: '🏹',
  [UnitTypeEnum.CHARIOT]: '🛡️',
  [UnitTypeEnum.SIEGE]: '🏛️',
};

interface UnitRecruitmentProps {
  availableResources: {
    population: number;
    gold: number;
    wood: number;
    iron: number;
  };
  onRecruit: (unitType: UnitType, count: number) => void;
  maxRecruitment?: number;
}

export function UnitRecruitment({
  availableResources,
  onRecruit,
  maxRecruitment = 1000,
}: UnitRecruitmentProps) {
  const [selectedType, setSelectedType] = useState<UnitType>(UnitTypeEnum.INFANTRY);
  const [count, setCount] = useState(100);

  // 计算可招募数量
  const maxAffordable = useMemo(() => {
    const costs = recruitmentCosts[selectedType];
    return Math.floor(Math.min(
      availableResources.population / costs.population,
      availableResources.gold / costs.gold,
      costs.wood > 0 ? availableResources.wood / costs.wood : Infinity,
      costs.iron > 0 ? availableResources.iron / costs.iron : Infinity,
      maxRecruitment
    ));
  }, [selectedType, availableResources, maxRecruitment]);

  // 计算总成本
  const totalCost = useMemo(() => {
    const costs = recruitmentCosts[selectedType];
    return {
      population: costs.population * count,
      gold: costs.gold * count,
      wood: costs.wood * count,
      iron: costs.iron * count,
    };
  }, [selectedType, count]);

  // 检查资源是否足够
  const canAfford = useMemo(() => {
    return (
      availableResources.population >= totalCost.population &&
      availableResources.gold >= totalCost.gold &&
      availableResources.wood >= totalCost.wood &&
      availableResources.iron >= totalCost.iron &&
      count <= maxRecruitment
    );
  }, [availableResources, totalCost, count, maxRecruitment]);

  const handleRecruit = useCallback(() => {
    if (canAfford && count > 0) {
      onRecruit(selectedType, count);
      setCount(100);
    }
  }, [canAfford, count, onRecruit, selectedType]);

  const unitTypes = Object.values(UnitTypeEnum);

  return (
    <div className="unit-recruitment">
      <h3 className="recruitment-title">🏛️ 招募军队</h3>

      {/* 兵种选择 */}
      <div className="unit-type-selection">
        {unitTypes.map((type) => (
          <button
            key={type}
            className={`unit-type-btn ${selectedType === type ? 'selected' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            <span className="unit-icon-large">{unitIcons[type]}</span>
            <span className="unit-name">{unitNames[type]}</span>
            <span className="unit-cost">
              💰{recruitmentCosts[type].gold} 👤{recruitmentCosts[type].population}
            </span>
          </button>
        ))}
      </div>

      {/* 选中兵种详情 */}
      <div className="unit-details">
        <h4>
          {unitIcons[selectedType]} {unitNames[selectedType]}
        </h4>
        <p className="unit-description">{unitStats[selectedType].description}</p>
        <div className="unit-stats-grid">
          <div className="unit-stat">
            <span className="stat-label">攻击</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${unitStats[selectedType].attack * 3}%` }} />
            </div>
            <span className="stat-value">{unitStats[selectedType].attack}</span>
          </div>
          <div className="unit-stat">
            <span className="stat-label">防御</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${unitStats[selectedType].defense * 3}%` }} />
            </div>
            <span className="stat-value">{unitStats[selectedType].defense}</span>
          </div>
          <div className="unit-stat">
            <span className="stat-label">速度</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${unitStats[selectedType].speed * 10}%` }} />
            </div>
            <span className="stat-value">{unitStats[selectedType].speed}</span>
          </div>
        </div>
      </div>

      {/* 招募数量 */}
      <div className="recruitment-count">
        <label>招募数量</label>
        <div className="count-input-group">
          <input
            type="range"
            min="1"
            max={maxAffordable}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="count-slider"
          />
          <input
            type="number"
            min="1"
            max={maxAffordable}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="count-input"
          />
        </div>
        <span className="max-hint">最大可招募: {maxAffordable}</span>
      </div>

      {/* 总成本显示 */}
      <div className="total-cost">
        <h4>💰 总成本</h4>
        <div className="cost-grid">
          <div className={`cost-item ${availableResources.population < totalCost.population ? 'insufficient' : ''}`}>
            <span>👤 人口</span>
            <span>{totalCost.population.toLocaleString()}</span>
          </div>
          <div className={`cost-item ${availableResources.gold < totalCost.gold ? 'insufficient' : ''}`}>
            <span>💰 金钱</span>
            <span>{totalCost.gold.toLocaleString()}</span>
          </div>
          <div className={`cost-item ${availableResources.wood < totalCost.wood ? 'insufficient' : ''}`}>
            <span>🪵 木材</span>
            <span>{totalCost.wood.toLocaleString()}</span>
          </div>
          <div className={`cost-item ${availableResources.iron < totalCost.iron ? 'insufficient' : ''}`}>
            <span>⚙️ 铁矿</span>
            <span>{totalCost.iron.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 招募按钮 */}
      <button
        className="cyber-button recruit-btn"
        onClick={handleRecruit}
        disabled={!canAfford || count <= 0}
      >
        {canAfford ? '⚔️ 开始招募' : '❌ 资源不足'}
      </button>
    </div>
  );
}

// 军队配置组件
interface ArmyConfigProps {
  army: Army;
  availableHeroes: { id: string; name: string }[];
  onUpdateCommander: (heroId: string | undefined) => void;
  onDisband: () => void;
}

export function ArmyConfig({
  army,
  availableHeroes,
  onUpdateCommander,
  onDisband,
}: ArmyConfigProps) {
  return (
    <div className="army-config">
      <h3 className="config-title">⚙️ 军队配置</h3>

      <div className="config-section">
        <label>统帅武将</label>
        <select
          value={army.commanderId || ''}
          onChange={(e) => onUpdateCommander(e.target.value || undefined)}
          className="commander-select"
        >
          <option value="">无统帅</option>
          {availableHeroes.map((hero) => (
            <option key={hero.id} value={hero.id}>
              {hero.name}
            </option>
          ))}
        </select>
        <p className="commander-hint">
          统帅影响军队战斗力和士气
        </p>
      </div>

      <div className="config-section">
        <h4>军队构成</h4>
        <div className="army-composition-detail">
          {army.units.map((unit) => (
            <div key={unit.id} className="composition-item">
              <span className="comp-icon">{unitIcons[unit.type]}</span>
              <span className="comp-name">{unitNames[unit.type]}</span>
              <span className="comp-count">{unit.count.toLocaleString()}</span>
              <span className="comp-exp">Lv.{unit.experience}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="config-actions">
        <button className="cyber-button danger" onClick={onDisband}>
          🗑️ 解散军队
        </button>
      </div>
    </div>
  );
}

export default UnitRecruitment;

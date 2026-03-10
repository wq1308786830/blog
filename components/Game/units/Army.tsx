/**
 * 军队单位组件
 * 显示和管理军队单位
 */

'use client';

import { memo, useMemo } from 'react';
import type { Army, Hero, Unit } from '../types/gameTypes';
import { UnitType } from '../types/gameTypes';
import './army.css';

interface ArmyCardProps {
  army: Army;
  hero?: Hero;
  onSelect?: (armyId: string) => void;
  onMove?: (armyId: string) => void;
  onAttack?: (armyId: string) => void;
  isSelected?: boolean;
}

// 兵种图标映射
const unitTypeIcons: Record<UnitType, string> = {
  [UnitType.INFANTRY]: '⚔️',
  [UnitType.CAVALRY]: '🐴',
  [UnitType.ARCHER]: '🏹',
  [UnitType.CHARIOT]: '🛡️',
  [UnitType.SIEGE]: '🏛️',
};

// 兵种名称映射
const unitTypeNames: Record<UnitType, string> = {
  [UnitType.INFANTRY]: '步兵',
  [UnitType.CAVALRY]: '骑兵',
  [UnitType.ARCHER]: '弓兵',
  [UnitType.CHARIOT]: '战车',
  [UnitType.SIEGE]: '攻城器械',
};

// 军队状态名称映射
const armyStatusNames: Record<string, string> = {
  idle: '待命',
  moving: '移动中',
  fighting: '战斗中',
  garrison: '驻防中',
  retreating: '撤退中',
};

// 军队状态颜色映射
const armyStatusColors: Record<string, string> = {
  idle: '#00ff66',
  moving: '#00f5ff',
  fighting: '#ff0066',
  garrison: '#ffcc00',
  retreating: '#ff0000',
};

const ArmyCard = memo(({
  army,
  hero,
  onSelect,
  onMove,
  onAttack,
  isSelected = false,
}: ArmyCardProps) => {
  // 计算军队总兵力
  const totalTroops = useMemo(() => {
    return army.totalSoldiers;
  }, [army.totalSoldiers]);

  // 计算补给状态（基于士气推断）
  const supplyStatus = useMemo(() => {
    if (army.morale > 70) return { label: '充足', color: '#00ff66' };
    if (army.morale > 30) return { label: '一般', color: '#ffcc00' };
    return { label: '匮乏', color: '#ff0000' };
  }, [army.morale]);

  return (
    <div
      className={`army-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect?.(army.id)}
    >
      {/* 军队头部 */}
      <div className="army-header">
        <div className="army-name">{army.name}</div>
        <div
          className="army-status"
          style={{ color: armyStatusColors[army.status] || '#666' }}
        >
          {armyStatusNames[army.status] || army.status}
        </div>
      </div>

      {/* 武将信息 */}
      {hero && (
        <div className="army-hero">
          <span className="hero-icon">🎖️</span>
          <span className="hero-name">{hero.name}</span>
          <span className="hero-bonus">+{Math.floor((hero.stats.leadership + hero.stats.war) / 2)}%</span>
        </div>
      )}

      {/* 兵种构成 */}
      <div className="army-composition">
        {army.units.map((unit: Unit) => (
          unit.count > 0 && (
            <div key={unit.id} className="unit-type">
              <span className="unit-icon">{unitTypeIcons[unit.type]}</span>
              <span className="unit-name">{unitTypeNames[unit.type]}</span>
              <span className="unit-count">{unit.count.toLocaleString()}</span>
            </div>
          )
        ))}
      </div>

      {/* 军队统计 */}
      <div className="army-stats">
        <div className="stat">
          <span className="stat-label">总兵力</span>
          <span className="stat-value">{totalTroops.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">战斗力</span>
          <span className="stat-value combat">{army.combatPower.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">士气</span>
          <span className={`stat-value morale ${army.morale < 50 ? 'low' : ''}`}>
            {army.morale}%
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">状态</span>
          <span className="stat-value" style={{ color: supplyStatus.color }}>
            {supplyStatus.label}
          </span>
        </div>
      </div>

      {/* 行动按钮 */}
      {isSelected && army.status === 'idle' && (
        <div className="army-actions">
          <button
            className="cyber-button-small move"
            onClick={(e) => {
              e.stopPropagation();
              onMove?.(army.id);
            }}
          >
            移动
          </button>
          <button
            className="cyber-button-small attack"
            onClick={(e) => {
              e.stopPropagation();
              onAttack?.(army.id);
            }}
          >
            攻击
          </button>
        </div>
      )}
    </div>
  );
});

ArmyCard.displayName = 'ArmyCard';

// 军队列表组件
interface ArmyListProps {
  armies: Army[];
  heroes: Hero[];
  selectedArmyId?: string | null;
  onSelectArmy?: (armyId: string) => void;
  onMoveArmy?: (armyId: string) => void;
  onAttack?: (armyId: string) => void;
}

const ArmyList = memo(({
  armies,
  heroes,
  selectedArmyId,
  onSelectArmy,
  onMoveArmy,
  onAttack,
}: ArmyListProps) => {
  const heroesMap = useMemo(() => {
    return new Map(heroes.map(h => [h.id, h]));
  }, [heroes]);

  return (
    <div className="army-list">
      {armies.length === 0 ? (
        <div className="army-empty">
          <div className="empty-icon">⚔️</div>
          <p>暂无军队</p>
          <p className="empty-hint">在领地中招募军队</p>
        </div>
      ) : (
        armies.map(army => (
          <ArmyCard
            key={army.id}
            army={army}
            hero={army.commanderId ? heroesMap.get(army.commanderId) : undefined}
            isSelected={army.id === selectedArmyId}
            onSelect={onSelectArmy}
            onMove={onMoveArmy}
            onAttack={onAttack}
          />
        ))
      )}
    </div>
  );
});

ArmyList.displayName = 'ArmyList';

export { ArmyCard, ArmyList };
export default ArmyCard;

/**
 * 武将组件
 * 显示和管理武将单位
 */
'use client';

import { memo, useMemo } from 'react';
import type { Hero } from '../types/gameTypes';
import './hero.css';

interface HeroCardProps {
  hero: Hero;
  onSelect?: (heroId: string) => void;
  onAssign?: (heroId: string) => void;
  onSkill?: (heroId: string) => void;
  isSelected?: boolean;
}

// 资质颜色映射
const talentColors: Record<string, string> = {
  ss: '#ff6b6b',
  s: '#ffd93d',
  a: '#6bcb77',
  b: '#4d96ff',
  c: '#9b9b9b',
};

// 资质名称映射
const talentNames: Record<string, string> = {
  ss: '绝顶',
  s: '超群',
  a: '优秀',
  b: '普通',
  c: '平庸',
};

// 技能类型图标
const skillTypeIcons: Record<string, string> = {
  attack: '⚔️',
  defense: '🛡️',
  strategy: '📜',
  leadership: '👑',
  special: '⭐',
};

const HeroCard = memo(({ hero, onSelect, onAssign, onSkill, isSelected = false }: HeroCardProps) => {
  // 计算升级所需经验
  const expToNextLevel = useMemo(() => {
    return Math.floor(100 * Math.pow(1.5, hero.level));
  }, [hero.level]);

  // 计算经验进度百分比
  const expProgress = useMemo(() => {
    return Math.min((hero.experience / expToNextLevel) * 100, 100);
  }, [hero.experience, expToNextLevel]);

  // 战斗力计算
  const combatPower = useMemo(() => {
    const baseStats = 
      hero.stats.strength + 
      hero.stats.war + 
      hero.stats.intelligence + 
      hero.stats.leadership;
    const levelBonus = hero.level * 10;
    const skillBonus = hero.skills.reduce((sum, skill) => sum + skill.level * 5, 0);
    return Math.floor(baseStats + levelBonus + skillBonus);
  }, [hero]);

  // 获取已解锁技能
  const unlockedSkills = useMemo(() => {
    return hero.skills.filter(skill => hero.level >= skill.unlockLevel);
  }, [hero.skills, hero.level]);

  return (
    <div 
      className={`hero-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect?.(hero.id)}
    >
      {/* 武将头部 */}
      <div className="hero-header">
        <div className="hero-avatar">
          <span className="avatar-icon">🎖️</span>
          <span className="hero-level">{hero.level}</span>
        </div>
        <div className="hero-info">
          <div className="hero-name">{hero.name}</div>
          <div className="hero-title">{hero.title || '无名将领'}</div>
        </div>
        <div 
          className="hero-talent"
          style={{ color: talentColors[hero.talent] || '#666' }}
          title={`资质: ${talentNames[hero.talent] || hero.talent}`}
        >
          {hero.talent.toUpperCase()}
        </div>
      </div>

      {/* 经验条 */}
      <div className="hero-exp">
        <div className="exp-bar">
          <div 
            className="exp-fill" 
            style={{ width: `${expProgress}%` }}
          />
        </div>
        <div className="exp-text">
          经验 {hero.experience}/{expToNextLevel}
        </div>
      </div>

      {/* 属性面板 */}
      <div className="hero-stats">
        <div className="stat-row">
          <span className="stat-icon">💪</span>
          <span className="stat-label">武力</span>
          <span className="stat-value">{hero.stats.strength}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">🧠</span>
          <span className="stat-label">智力</span>
          <span className="stat-value">{hero.stats.intelligence}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">👑</span>
          <span className="stat-label">统率</span>
          <span className="stat-value">{hero.stats.leadership}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">⚔️</span>
          <span className="stat-label">武力</span>
          <span className="stat-value">{hero.stats.war}</span>
        </div>
      </div>

      {/* 战斗力 */}
      <div className="hero-combat">
        <span className="combat-label">战斗力</span>
        <span className="combat-value">{combatPower.toLocaleString()}</span>
      </div>

      {/* 技能栏 */}
      <div className="hero-skills">
        <div className="skills-header">
          <span className="skills-title">技能</span>
          <span className="skills-count">{unlockedSkills.length}/{hero.skills.length}</span>
        </div>
        <div className="skills-list">
          {hero.skills.map(skill => (
            <div 
              key={skill.id} 
              className={`skill-item ${hero.level >= skill.unlockLevel ? 'unlocked' : 'locked'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (hero.level >= skill.unlockLevel) {
                  onSkill?.(hero.id);
                }
              }}
              title={hero.level >= skill.unlockLevel ? skill.description : `Lv.${skill.unlockLevel}解锁`}
            >
              <span className="skill-icon">{skillTypeIcons[skill.type] || '⭐'}</span>
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">Lv.{skill.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 忠诚度 */}
      <div className="hero-loyalty">
        <span className="loyalty-label">忠诚度</span>
        <span className={`loyalty-value ${hero.loyalty < 50 ? 'low' : ''}`}>
          {hero.loyalty}%
        </span>
      </div>

      {/* 行动按钮 */}
      {isSelected && (
        <div className="hero-actions">
          <button 
            className="cyber-button-small assign"
            onClick={(e) => {
              e.stopPropagation();
              onAssign?.(hero.id);
            }}
          >
            任命
          </button>
          <button 
            className="cyber-button-small skill"
            onClick={(e) => {
              e.stopPropagation();
              onSkill?.(hero.id);
            }}
          >
            技能
          </button>
        </div>
      )}
    </div>
  );
});

HeroCard.displayName = 'HeroCard';

// 武将列表组件
interface HeroListProps {
  heroes: Hero[];
  selectedHeroId?: string | null;
  onSelectHero?: (heroId: string) => void;
  onAssignHero?: (heroId: string) => void;
  onUseSkill?: (heroId: string) => void;
}

const HeroList = memo(({ 
  heroes, 
  selectedHeroId, 
  onSelectHero, 
  onAssignHero,
  onUseSkill 
}: HeroListProps) => {
  return (
    <div className="hero-list">
      {heroes.length === 0 ? (
        <div className="hero-empty">
          <div className="empty-icon">🎖️</div>
          <p>暂无武将</p>
          <p className="empty-hint">通过招募或事件获得武将</p>
        </div>
      ) : (
        heroes.map(hero => (
          <HeroCard
            key={hero.id}
            hero={hero}
            isSelected={hero.id === selectedHeroId}
            onSelect={onSelectHero}
            onAssign={onAssignHero}
            onSkill={onUseSkill}
          />
        ))
      )}
    </div>
  );
});

HeroList.displayName = 'HeroList';

export { HeroCard, HeroList };
export default HeroCard;
/**
 * 武将招募界面
 * 显示可招募武将列表和处理招募逻辑
 */

'use client';

import type { Hero, Resources } from '../types/gameTypes';
import './heroRecruit.css';

interface HeroRecruitProps {
  heroes: Hero[];
  playerResources: Resources;
  recruitedHeroIds: string[];
  onRecruit: (heroId: string, cost: Resources) => void;
  onClose: () => void;
}

// 计算招募费用
function calculateRecruitCost(hero: Hero): Resources {
  return {
    gold: hero.stats.leadership * 10 + hero.stats.war * 5,
    food: hero.stats.charm * 2,
    population: 0,
    wood: 0,
    iron: 0,
    prestige: 0,
  };
}

// 检查资源是否足够
function hasEnoughResources(playerResources: Resources, cost: Resources): boolean {
  return (
    playerResources.gold >= cost.gold &&
    playerResources.food >= cost.food &&
    playerResources.population >= cost.population &&
    playerResources.wood >= cost.wood &&
    playerResources.iron >= cost.iron
  );
}

// 获取属性评级
function getStatGrade(stat: number): string {
  if (stat >= 95) return 'S';
  if (stat >= 85) return 'A';
  if (stat >= 70) return 'B';
  if (stat >= 50) return 'C';
  return 'D';
}

// 获取技能类型图标
function getSkillTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    combat: '⚔️',
    strategy: '📜',
    governance: '🏛️',
    diplomacy: '🤝',
  };
  return icons[type] || '✨';
}

export function HeroRecruit({
  heroes,
  playerResources,
  recruitedHeroIds,
  onRecruit,
  onClose,
}: HeroRecruitProps) {
  // 过滤出可招募的武将（未被招募的）
  const availableHeroes = heroes.filter(
    (hero) => !recruitedHeroIds.includes(hero.id) && !hero.isRecruited
  );

  return (
    <div className="hero-recruit-overlay" onClick={onClose}>
      <div className="hero-recruit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hero-recruit-header">
          <h2>武将招募</h2>
          <button className="hero-recruit-close" onClick={onClose}>×</button>
        </div>

        <div className="hero-recruit-resources">
          <span>金币: {Math.floor(playerResources.gold)}</span>
          <span>粮食: {Math.floor(playerResources.food)}</span>
          <span>人口: {Math.floor(playerResources.population)}</span>
        </div>

        <div className="hero-recruit-list">
          {availableHeroes.length === 0 ? (
            <div className="hero-recruit-empty">暂无可招募的武将</div>
          ) : (
            availableHeroes.map((hero) => {
              const cost = calculateRecruitCost(hero);
              const canRecruit = hasEnoughResources(playerResources, cost);

              return (
                <div key={hero.id} className={`hero-card ${canRecruit ? 'available' : 'unavailable'}`}>
                  <div className="hero-card-header">
                    <div className="hero-portrait">
                      <div className="hero-portrait-placeholder">{hero.name[0]}</div>
                    </div>
                    <div className="hero-basic-info">
                      <h3 className="hero-name">{hero.name}</h3>
                      {hero.courtesyName && <span className="hero-courtesy">字 {hero.courtesyName}</span>}
                    </div>
                  </div>

                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-label">武力</span>
                      <span className={`stat-value grade-${getStatGrade(hero.stats.war).toLowerCase()}`}>
                        {hero.stats.war}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">智力</span>
                      <span className={`stat-value grade-${getStatGrade(hero.stats.intelligence).toLowerCase()}`}>
                        {hero.stats.intelligence}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">政治</span>
                      <span className={`stat-value grade-${getStatGrade(hero.stats.politics).toLowerCase()}`}>
                        {hero.stats.politics}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">魅力</span>
                      <span className={`stat-value grade-${getStatGrade(hero.stats.charm).toLowerCase()}`}>
                        {hero.stats.charm}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">统率</span>
                      <span className={`stat-value grade-${getStatGrade(hero.stats.leadership).toLowerCase()}`}>
                        {hero.stats.leadership}
                      </span>
                    </div>
                  </div>

                  {hero.skills.length > 0 && (
                    <div className="hero-skills">
                      {hero.skills.map((skill) => (
                        <div key={skill.id} className="skill-item">
                          <span className="skill-icon">{getSkillTypeIcon(skill.type)}</span>
                          <span className="skill-name">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="hero-biography">{hero.biography}</div>

                  <div className="hero-recruit-footer">
                    <div className="recruit-cost">
                      <span>招募费用:</span>
                      {cost.gold > 0 && <span className="cost-gold">金币 {cost.gold}</span>}
                      {cost.food > 0 && <span className="cost-food">粮食 {cost.food}</span>}
                    </div>
                    <button
                      className={`recruit-button ${canRecruit ? 'can-recruit' : 'cannot-recruit'}`}
                      disabled={!canRecruit}
                      onClick={() => onRecruit(hero.id, cost)}
                    >
                      {canRecruit ? '招募' : '资源不足'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroRecruit;
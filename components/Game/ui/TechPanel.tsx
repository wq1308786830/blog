/**
 * 科技面板
 * 发展科技树，解锁新能力
 */
'use client';

import { useState, useMemo } from 'react';
import { useGame } from '../GameProvider';
import './techPanel.css';

interface TechPanelProps {
  onClose: () => void;
}

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  techs: Tech[];
}

interface Tech {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  unlocked: boolean;
}

export function TechPanel({ onClose }: TechPanelProps) {
  const { playerState, playerDispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('military');

  const techCategories: TechCategory[] = useMemo(() => [
    {
      id: 'military',
      name: '军事科技',
      icon: '⚔️',
      description: '提升军队战斗力',
      techs: [
        { id: 'iron_weapons', name: '铁器', description: '解锁铁制武器', cost: 500, effect: '攻击力+10%', unlocked: false },
        { id: 'crossbow', name: '弩箭', description: '解锁强弩兵', cost: 800, effect: '弓兵射程+20%', unlocked: false },
        { id: 'cavalry_tactics', name: '骑战', description: '解锁骑兵战术', cost: 1200, effect: '骑兵冲锋伤害+15%', unlocked: false },
        { id: 'siege_engineering', name: '攻城', description: '解锁攻城器械', cost: 2000, effect: '攻城效率+25%', unlocked: false },
        { id: 'military_doctrine', name: '军制', description: '优化军事编制', cost: 3000, effect: '部队上限+1', unlocked: false },
      ]
    },
    {
      id: 'economy',
      name: '经济科技',
      icon: '💰',
      description: '发展国民经济',
      techs: [
        { id: 'agriculture', name: '农业', description: '改进耕作技术', cost: 400, effect: '粮食产出+15%', unlocked: false },
        { id: 'coinage', name: '铸币', description: '发行货币', cost: 600, effect: '税收+10%', unlocked: false },
        { id: 'trade_routes', name: '商道', description: '开辟贸易路线', cost: 1000, effect: '贸易收入+20%', unlocked: false },
        { id: 'craftsmanship', name: '工艺', description: '提升工艺水平', cost: 1500, effect: '生产效率+15%', unlocked: false },
        { id: 'banking', name: '金融', description: '发展金融业', cost: 2500, effect: '所有收入+10%', unlocked: false },
      ]
    },
    {
      id: 'governance',
      name: '内政科技',
      icon: '🏛️',
      description: '强化行政管理',
      techs: [
        { id: 'legalism', name: '法治', description: '完善法律制度', cost: 500, effect: '民心+10', unlocked: false },
        { id: 'bureaucracy', name: '官僚', description: '建立官僚体系', cost: 900, effect: '行政效率+15%', unlocked: false },
        { id: 'fortification', name: '城防', description: '加强防御工事', cost: 1400, effect: '城防值+20%', unlocked: false },
        { id: 'education', name: '教育', description: '推广教育', cost: 2200, effect: '人才出现率+25%', unlocked: false },
        { id: 'centralization', name: '中央集权', description: '加强中央权威', cost: 3500, effect: '领地忠诚度+15', unlocked: false },
      ]
    },
    {
      id: 'strategy',
      name: '谋略科技',
      icon: '🎯',
      description: '提升战略智慧',
      techs: [
        { id: 'espionage', name: '间谍', description: '建立情报网', cost: 700, effect: '情报获取+30%', unlocked: false },
        { id: 'propaganda', name: '宣传', description: '舆论控制', cost: 1100, effect: '敌人民心-10', unlocked: false },
        { id: 'psychological_warfare', name: '心理战', description: '瓦解敌军士气', cost: 1800, effect: '战场恐惧效果+20%', unlocked: false },
        { id: 'diplomacy', name: '外交', description: '优化外交策略', cost: 2400, effect: '外交成功率+15%', unlocked: false },
        { id: 'grand_strategy', name: '战略', description: '天下大势', cost: 4000, effect: '全局视野+25%', unlocked: false },
      ]
    }
  ], []);

  const selectedTechCategory = techCategories.find(c => c.id === selectedCategory);
  const canAfford = (cost: number) => playerState.resources.gold >= cost;

  const handleResearch = (tech: Tech) => {
    if (!canAfford(tech.cost)) return;
    playerDispatch({
      type: 'UPDATE_RESOURCES',
      payload: { population: 0, food: 0, gold: -tech.cost, wood: 0, iron: 0, prestige: 10 }
    });
  };

  return (
    <div className="tech-panel">
      <div className="tech-header">
        <h2>科技发展</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="tech-content">
        <div className="tech-categories">
          {techCategories.map(category => (
            <button
              key={category.id}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
        <div className="tech-list">
          <div className="tech-category-info">
            <h3>{selectedTechCategory?.name}</h3>
            <p>{selectedTechCategory?.description}</p>
          </div>
          {selectedTechCategory?.techs.map(tech => (
            <div key={tech.id} className={`tech-item ${canAfford(tech.cost) ? '' : 'disabled'}`}>
              <div className="tech-info">
                <h4>{tech.name}</h4>
                <p>{tech.description}</p>
                <span className="tech-effect">{tech.effect}</span>
              </div>
              <div className="tech-cost">
                <span className="cost-label">研究费用</span>
                <span className="cost-value">{tech.cost} 金</span>
                <button className="research-button" disabled={!canAfford(tech.cost)} onClick={() => handleResearch(tech)}>研究</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
/**
 * 资源面板组件
 * 显示玩家资源信息
 */

'use client';

import { memo } from 'react';
import type { Resources } from '../types/gameTypes';
import './resourcePanel.css';

interface ResourcePanelProps {
  resources: Resources;
  territoryCount: number;
}

const ResourcePanel = memo(({ resources, territoryCount }: ResourcePanelProps) => {
  const resourceItems = [
    { key: 'population', label: '人口', icon: '👥', color: '#00f5ff' },
    { key: 'food', label: '粮食', icon: '🌾', color: '#00ff66' },
    { key: 'gold', label: '金钱', icon: '💰', color: '#ffd700' },
    { key: 'wood', label: '木材', icon: '🪵', color: '#8b4513' },
    { key: 'iron', label: '铁矿', icon: '⛏️', color: '#a0a0a0' },
    { key: 'prestige', label: '声望', icon: '👑', color: '#ff00ff' },
  ] as const;

  return (
    <div className="resource-panel">
      <h2 className="resource-panel-title">资源状况</h2>

      <div className="resource-list">
        {resourceItems.map((item) => (
          <div
            key={item.key}
            className="resource-item"
            style={{ '--resource-color': item.color } as React.CSSProperties}
          >
            <span className="resource-icon">{item.icon}</span>
            <div className="resource-info">
              <span className="resource-value">
                {Math.floor(resources[item.key]).toLocaleString()}
              </span>
              <span className="resource-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="territory-count">
        <div className="territory-count-item">
          <span className="territory-icon">🏛️</span>
          <div className="territory-info">
            <span className="territory-value">{territoryCount}</span>
            <span className="territory-label">领地数量</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ResourcePanel.displayName = 'ResourcePanel';

export { ResourcePanel };
export default ResourcePanel;

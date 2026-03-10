/**
 * 领地信息组件
 */

'use client';

import { memo } from 'react';
import type { Territory } from '../types/gameTypes';
import './territoryInfo.css';

interface TerritoryInfoProps {
  territory: Territory | null;
  onConquer: (territoryId: string) => void;
  playerFactionId: string;
}

const TerritoryInfo = memo(({ territory, onConquer, playerFactionId }: TerritoryInfoProps) => {
  if (!territory) {
    return (
      <div className="territory-info-panel empty">
        <div className="empty-state">
          <span className="empty-icon">🗺️</span>
          <p>选择一个领地查看详情</p>
        </div>
      </div>
    );
  }

  const isOwned = territory.ownerId === playerFactionId;
  const isEnemy = territory.ownerId && territory.ownerId !== playerFactionId;
  const isNeutral = !territory.ownerId;

  const terrainNames: Record<string, string> = {
    plain: '平原',
    mountain: '山地',
    river: '河流',
    forest: '森林',
    desert: '沙漠',
    swamp: '沼泽',
  };

  const statusNames: Record<string, string> = {
    neutral: '中立',
    owned: '己方',
    occupied: '占领',
    contested: '争夺中',
    devastated: '荒废',
  };

  return (
    <div className="territory-info-panel">
      <div className="territory-header">
        <h2 className="territory-name">{territory.name}</h2>
        <span className={`territory-status ${territory.status}`}>
          {statusNames[territory.status] || territory.status}
        </span>
      </div>

      <p className="territory-description">{territory.description}</p>

      <div className="territory-details">
        <div className="detail-item">
          <span className="detail-label">地形</span>
          <span className="detail-value">{terrainNames[territory.terrain] || territory.terrain}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">人口</span>
          <span className="detail-value">{territory.population.toLocaleString()}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">防御等级</span>
          <span className="detail-value">{territory.defenses}</span>
        </div>

        {territory.historicalInfo && (
          <div className="detail-item historical">
            <span className="detail-label">历史</span>
            <span className="detail-value">{territory.historicalInfo}</span>
          </div>
        )}
      </div>

      <div className="territory-resources">
        <h3>资源产出</h3>
        <div className="resource-grid">
          <div className="resource-item">
            <span className="resource-icon">👥</span>
            <span className="resource-value">+{territory.resources.population}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">🌾</span>
            <span className="resource-value">+{territory.resources.food}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">💰</span>
            <span className="resource-value">+{territory.resources.gold}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">🪵</span>
            <span className="resource-value">+{territory.resources.wood}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">⛏️</span>
            <span className="resource-value">+{territory.resources.iron}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon">👑</span>
            <span className="resource-value">+{territory.resources.prestige}</span>
          </div>
        </div>
      </div>

      <div className="territory-actions">
        {isNeutral && (
          <button
            className="cyber-button conquer-button"
            onClick={() => onConquer(territory.id)}
          >
            征服领地
          </button>
        )}

        {isEnemy && (
          <button
            className="cyber-button attack-button"
            onClick={() => onConquer(territory.id)}
          >
            发动进攻
          </button>
        )}

        {isOwned && (
          <div className="owned-message">
            <span>✓ 已占领</span>
          </div>
        )}
      </div>
    </div>
  );
});

TerritoryInfo.displayName = 'TerritoryInfo';

export { TerritoryInfo };
export default TerritoryInfo;

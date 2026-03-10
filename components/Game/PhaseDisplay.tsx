/**
 * 阶段显示组件
 * 根据当前年份和阶段显示对应的阶段信息
 */

'use client';

import { GamePhase } from './types/gameTypes';
import { getPhaseName, getPhaseDescription } from '../../services/game/gameEngine';
import './phaseDisplay.css';

interface PhaseDisplayProps {
  phase: GamePhase;
  year: number;
  turn: number;
  isTransitioning?: boolean;
}

// 阶段颜色配置
const PHASE_COLORS: Record<GamePhase, { primary: string; secondary: string; accent: string }> = {
  early_zhou: {
    primary: '#8B4513',
    secondary: '#D2691E',
    accent: '#FFD700',
  },
  spring_autumn: {
    primary: '#228B22',
    secondary: '#32CD32',
    accent: '#98FB98',
  },
  warring_states: {
    primary: '#8B0000',
    secondary: '#DC143C',
    accent: '#FF6347',
  },
  unification: {
    primary: '#4B0082',
    secondary: '#8A2BE2',
    accent: '#DA70D6',
  },
};

// 阶段图标
const PHASE_ICONS: Record<GamePhase, string> = {
  early_zhou: '🏛️',
  spring_autumn: '🌸',
  warring_states: '⚔️',
  unification: '👑',
};

export function PhaseDisplay({ phase, year, turn, isTransitioning }: PhaseDisplayProps) {
  const colors = PHASE_COLORS[phase] || PHASE_COLORS.spring_autumn;
  const icon = PHASE_ICONS[phase] || '📜';
  const name = getPhaseName(phase);
  const description = getPhaseDescription(phase);

  return (
    <div
      className={`phase-display ${isTransitioning ? 'transitioning' : ''}`}
      style={{
        '--phase-primary': colors.primary,
        '--phase-secondary': colors.secondary,
        '--phase-accent': colors.accent,
      } as React.CSSProperties}
    >
      <div className="phase-icon">{icon}</div>
      <div className="phase-info">
        <h3 className="phase-name">{name}</h3>
        <p className="phase-year">{year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`}</p>
        <p className="phase-description">{description}</p>
      </div>
      <div className="phase-turn">第 {turn} 回合</div>
    </div>
  );
}

// 阶段转换通知组件
interface PhaseTransitionProps {
  oldPhase: GamePhase;
  newPhase: GamePhase;
  onClose: () => void;
}

export function PhaseTransition({ oldPhase, newPhase, onClose }: PhaseTransitionProps) {
  const oldName = getPhaseName(oldPhase);
  const newName = getPhaseName(newPhase);
  const newColors = PHASE_COLORS[newPhase];

  return (
    <div className="phase-transition-overlay" onClick={onClose}>
      <div
        className="phase-transition-modal"
        style={{
          '--phase-primary': newColors.primary,
          '--phase-secondary': newColors.secondary,
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="transition-icon">{PHASE_ICONS[newPhase]}</div>
        <h2>时代变迁</h2>
        <div className="transition-text">
          <span className="old-phase">{oldName}</span>
          <span className="arrow">→</span>
          <span className="new-phase">{newName}</span>
        </div>
        <p className="transition-description">{getPhaseDescription(newPhase)}</p>
        <button className="transition-close" onClick={onClose}>
          开始新征程
        </button>
      </div>
    </div>
  );
}

export default PhaseDisplay;
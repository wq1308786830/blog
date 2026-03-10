/**
 * 历史时间线组件
 */

'use client';

import { memo } from 'react';
import type { GamePhase } from '../types/gameTypes';
import './timeline.css';

interface TimelineProps {
  phase: GamePhase;
  year: number;
  turn: number;
}

const Timeline = memo(({ phase, year, turn }: TimelineProps) => {
  const phaseNames: Record<GamePhase, string> = {
    early_zhou: '周朝后期',
    spring_autumn: '春秋时期',
    warring_states: '战国时期',
    unification: '秦统一天下',
  };

  const phaseProgress: Record<GamePhase, number> = {
    early_zhou: 0,
    spring_autumn: 33,
    warring_states: 66,
    unification: 100,
  };

  const formatYear = (y: number) => {
    if (y < 0) {
      return `公元前${Math.abs(Math.floor(y))}年`;
    }
    return `公元${Math.floor(y)}年`;
  };

  return (
    <div className="timeline">
      <div className="timeline-info">
        <div className="timeline-phase">{phaseNames[phase]}</div>
        <div className="timeline-year">{formatYear(year)}</div>
        <div className="timeline-turn">第 {turn} 回合</div>
      </div>

      <div className="timeline-progress">
        <div
          className="timeline-progress-bar"
          style={{ width: `${phaseProgress[phase]}%` }}
        />
        <div className="timeline-markers">
          <span className={phase === 'early_zhou' ? 'active' : ''}>周</span>
          <span className={phase === 'spring_autumn' ? 'active' : ''}>春秋</span>
          <span className={phase === 'warring_states' ? 'active' : ''}>战国</span>
          <span className={phase === 'unification' ? 'active' : ''}>统一</span>
        </div>
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';

export { Timeline };
export default Timeline;

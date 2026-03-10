/**
 * 春秋战国阶段组件
 * 春秋时期 (Spring and Autumn Period): 公元前770-476年
 */
'use client';

import { memo } from 'react';
import './phase.css';

interface Spring春秋PhaseProps {
  year: number;
  onAdvance?: () => void;
}

const Spring春秋Phase = memo(({ year, onAdvance }: Spring春秋PhaseProps) => {
  const isSpring春秋 = year >= -770 && year < -476;

  if (!isSpring春秋) {
    return null;
  }

  // 春秋时期诸侯国
  const states = [
    { name: '齐', color: '#1e90ff' },
    { name: '楚', color: '#dc143c' },
    { name: '秦', color: '#ffd700' },
    { name: '晋', color: '#32cd32' },
    { name: '燕', color: '#9370db' },
    { name: '韩', color: '#ff69b4' },
    { name: '赵', color: '#00ced1' },
    { name: '魏', color: '#ff4500' },
  ];

  // 春秋霸主
  const hegemon = [
    { name: '齐桓公', state: '齐', year: -685 },
    { name: '晋文公', state: '晋', year: -636 },
    { name: '秦穆公', state: '秦', year: -659 },
    { name: '楚庄王', state: '楚', year: -613 },
    { name: '吴王夫差', state: '吴', year: -495 },
    { name: '越王勾践', state: '越', year: -496 },
  ];

  // 获取当前霸主
  const currentHegemon = hegemon.find((h, i) => {
    const nextHegemon = hegemon[i + 1];
    return year >= h.year && (!nextHegemon || year < nextHegemon.year);
  });

  return (
    <div className="phase-container spring-autumn">
      <div className="phase-header">
        <h2>🏯 春秋时期</h2>
        <span className="phase-year">公元前 {Math.abs(year)} 年</span>
      </div>

      <div className="phase-description">
        <p>礼乐征伐自天子出 → 礼乐征伐自诸侯出</p>
        <p className="phase-era">春秋争霸，诸侯林立</p>
      </div>

      {/* 霸主展示 */}
      {currentHegemon && (
        <div className="hegemon-display">
          <div className="hegemon-label">当前霸主</div>
          <div className="hegemon-name">
            {currentHegemon.name}
            <span 
              className="hegemon-state"
              style={{ color: states.find(s => s.name === currentHegemon.state)?.color }}
            >
              ({currentHegemon.state}国)
            </span>
          </div>
        </div>
      )}

      {/* 诸侯国列表 */}
      <div className="states-grid">
        {states.map(state => (
          <div 
            key={state.name} 
            className="state-card"
            style={{ borderColor: state.color }}
          >
            <span className="state-name" style={{ color: state.color }}>
              {state.name}
            </span>
          </div>
        ))}
      </div>

      {/* 阶段特征 */}
      <div className="phase-features">
        <h3>时代特征</h3>
        <ul>
          <li>⭐ 诸侯争霸，尊王攘夷</li>
          <li>📜 礼乐制度逐渐崩坏</li>
          <li>⚔️ 兼并战争开始频繁</li>
          <li>🎓 百家争鸣思想活跃</li>
        </ul>
      </div>

      {/* 推进按钮 */}
      {onAdvance && (
        <button className="phase-advance-btn" onClick={onAdvance}>
          进入战国时期 →
        </button>
      )}
    </div>
  );
});

Spring春秋Phase.displayName = 'Spring春秋Phase';

export default Spring春秋Phase;
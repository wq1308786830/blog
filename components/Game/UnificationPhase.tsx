/**
 * 统一阶段组件
 * 秦统一时期 (Qin Unification): 公元前221年-公元前207年
 */
'use client';

import { memo } from 'react';
import './phase.css';

interface UnificationPhaseProps {
  year: number;
  onAdvance?: () => void;
}

const UnificationPhase = memo(({ year, onAdvance }: UnificationPhaseProps) => {
  const isUnification = year >= -221 && year < -207;

  if (!isUnification) {
    return null;
  }

  // 统一措施
  const policies = [
    { icon: '📜', title: '书同文', description: '统一文字' },
    { icon: '💰', title: '车同轨', description: '统一车轴宽度' },
    { icon: '📏', title: '统一度量衡', description: '统一计量标准' },
    { icon: '🛣️', title: '修驰道', description: '修建秦直道' },
    { icon: '🏰', title: '筑长城', description: '连接战国长城' },
    { icon: '⚖️', title: '法同律', description: '统一法律' },
  ];

  // 重要事件
  const events = [
    { year: -221, event: '秦灭六国，统一天下' },
    { year: -220, event: '秦始皇称帝' },
    { year: -215, event: '蒙恬北击匈奴' },
    { year: -214, event: '开始修建长城' },
    { year: -213, event: '焚书坑儒' },
    { year: -212, event: '修建阿房宫' },
  ];

  // 著名人物
  const figures = [
    { name: '秦始皇', role: '始皇帝' },
    { name: '李斯', role: '丞相' },
    { name: '赵高', role: '中车府令' },
    { name: '蒙恬', role: '名将' },
    { name: '王翦', role: '名将' },
  ];

  return (
    <div className="phase-container unification">
      <div className="phase-header">
        <h2>👑 秦朝统一</h2>
        <span className="phase-year">公元前 {Math.abs(year)} 年</span>
      </div>

      <div className="phase-description">
        <p>六王毕，四海一</p>
        <p className="phase-era">千古一帝，，统一宇内</p>
      </div>

      {/* 秦始皇 */}
      <div className="emperor-display">
        <div className="emperor-title">始皇帝</div>
        <div className="emperor-name">秦始皇 嬴政</div>
        <div className="emperor-subtitle">中国历史上第一个大一统王朝</div>
      </div>

      {/* 统一措施 */}
      <div className="policies-grid">
        {policies.map((policy) => (
          <div key={policy.title} className="policy-card">
            <span className="policy-icon">{policy.icon}</span>
            <div className="policy-content">
              <span className="policy-title">{policy.title}</span>
              <span className="policy-desc">{policy.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 重要事件 */}
      <div className="timeline-section">
        <h3>重要事件</h3>
        <div className="timeline">
          {events.map((event) => (
            <div 
              key={event.year} 
              className={`timeline-item ${year === event.year ? 'active' : ''}`}
            >
              <span className="timeline-year">前{Math.abs(event.year)}</span>
              <span className="timeline-event">{event.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 著名人物 */}
      <div className="figures-section">
        <h3>风云人物</h3>
        <div className="figures-list">
          {figures.map((figure) => (
            <div key={figure.name} className="figure-badge">
              <span className="figure-name">{figure.name}</span>
              <span className="figure-role">{figure.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 阶段特征 */}
      <div className="phase-features">
        <h3>历史意义</h3>
        <ul>
          <li>👑 建立中国第一个大一统王朝</li>
          <li>📜 创立郡县制，奠定两千年政治格局</li>
          <li>🛣️ 修筑驰道，统一交通</li>
          <li>🏰 修建万里长城，抵御外敌</li>
          <li>⚔️ 南征百越，拓展疆域</li>
        </ul>
      </div>

      {/* 结束提示 */}
      {year === -207 && (
        <div className="phase-end">
          <h3>秦朝灭亡</h3>
          <p>刘邦攻入咸阳，秦朝灭亡</p>
        </div>
      )}

      {onAdvance && year < -207 && (
        <button className="phase-advance-btn" onClick={onAdvance}>
          继续历史进程 →
        </button>
      )}
    </div>
  );
});

UnificationPhase.displayName = 'UnificationPhase';

export default UnificationPhase;
/**
 * 战国阶段组件
 * 战国时期 (Warring States Period): 公元前475-221年
 */
'use client';

import { memo } from 'react';
import './phase.css';

interface WarringStatesPhaseProps {
  year: number;
  onAdvance?: () => void;
}

const WarringStatesPhase = memo(({ year, onAdvance }: WarringStatesPhaseProps) => {
  const isWarringStates = year >= -475 && year < -221;

  if (!isWarringStates) {
    return null;
  }

  // 战国七雄
  const states = [
    { name: '秦', color: '#ffd700', territory: '关中', strength: 100 },
    { name: '齐', color: '#1e90ff', territory: '山东', strength: 80 },
    { name: '楚', color: '#dc143c', territory: '江汉', strength: 85 },
    { name: '燕', color: '#9370db', territory: '河北', strength: 60 },
    { name: '韩', color: '#ff69b4', territory: '河南', strength: 50 },
    { name: '赵', color: '#00ced1', territory: '山西', strength: 75 },
    { name: '魏', color: '#ff4500', territory: '河南', strength: 70 },
  ];

  // 著名将相
  const famousFigures = [
    { name: '商鞅', role: '改革家', state: '秦' },
    { name: '张仪', role: '纵横家', state: '秦' },
    { name: '苏秦', role: '纵横家', state: '赵' },
    { name: '白起', role: '名将', state: '秦' },
    { name: '廉颇', role: '名将', state: '赵' },
    { name: '蔺相如', role: '相国', state: '赵' },
    { name: '孙膑', role: '军事家', state: '齐' },
    { name: '乐毅', role: '名将', state: '燕' },
  ];

  return (
    <div className="phase-container warring-states">
      <div className="phase-header">
        <h2>⚔️ 战国时期</h2>
        <span className="phase-year">公元前 {Math.abs(year)} 年</span>
      </div>

      <div className="phase-description">
        <p>大争之世，强者生存</p>
        <p className="phase-era">合纵连横，兼并统一</p>
      </div>

      {/* 实力排名 */}
      <div className="strength-ranking">
        <h3>诸侯国实力</h3>
        <div className="states-strength">
          {[...states].sort((a, b) => b.strength - a.strength).map((state) => (
            <div key={state.name} className="strength-bar-container">
              <span className="strength-state" style={{ color: state.color }}>
                {state.name}
              </span>
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ width: `${state.strength}%`, background: state.color }}
                />
              </div>
              <span className="strength-value">{state.strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 著名人物 */}
      <div className="famous-figures">
        <h3>风云人物</h3>
        <div className="figures-grid">
          {famousFigures.map((figure) => (
            <div key={figure.name} className="figure-card">
              <span className="figure-name">{figure.name}</span>
              <span className="figure-role">{figure.role}</span>
              <span className="figure-state">{figure.state}国</span>
            </div>
          ))}
        </div>
      </div>

      {/* 阶段特征 */}
      <div className="phase-features">
        <h3>时代特征</h3>
        <ul>
          <li>⚔️ 兼并战争加剧</li>
          <li>📜 变法图强成为潮流</li>
          <li>🎓 百家争鸣达到高潮</li>
          <li>🏰 城池建设规模宏大</li>
          <li>📚 铁器牛耕广泛应用</li>
        </ul>
      </div>

      {/* 推进按钮 */}
      {onAdvance && (
        <button className="phase-advance-btn" onClick={onAdvance}>
          进入统一时期 →
        </button>
      )}
    </div>
  );
});

WarringStatesPhase.displayName = 'WarringStatesPhase';

export default WarringStatesPhase;
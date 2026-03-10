/**
 * 春秋时期页面
 * 春秋霸主剧情阶段
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../../../components/Game/GameProvider';
import { GamePhase } from '../../../components/Game/types/gameTypes';
import '../game.css';

export default function SpringAutumnPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [objectives, setObjectives] = useState<string[]>([]);

  useEffect(() => {
    // 检查是否满足进入条件
    if (state.phase !== GamePhase.SPRING_AUTUMN && state.phase !== GamePhase.EARLY_ZHOU) {
      router.push('/game');
      return;
    }
    
    // 设置本阶段目标
    setObjectives([
      '成为春秋霸主',
      '控制至少5个领地',
      '招募3名武将',
      '积累5000声望'
    ]);
  }, [state.phase, router]);

  const handleAdvancePhase = () => {
    dispatch({ type: 'CHANGE_PHASE', payload: GamePhase.WARRING_STATES });
    dispatch({ 
      type: 'ADD_LOG', 
      payload: { message: '时代变迁：进入战国时期！', type: 'success' } 
    });
    router.push('/game/warring-states');
  };

  return (
    <main className="phase-page spring-autumn-phase">
      <div className="phase-container">
        <header className="phase-header">
          <h1>📜 春秋时期</h1>
          <p className="phase-description">
            诸侯争霸，礼乐崩坏。齐桓公、晋文公、秦穆公、楚庄王、吴王夫差相继称霸，史称&quot;春秋五霸&quot;。
          </p>
        </header>

        <section className="phase-objectives">
          <h2>📋 当前目标</h2>
          <ul>
            {objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>

        <section className="phase-events">
          <h2>⚡ 历史事件</h2>
          <div className="event-cards">
            <div className="event-card">
              <h3>葵丘会盟</h3>
              <p>齐桓公主持会盟，成为首位霸主</p>
              <span className="event-year">前679年</span>
            </div>
            <div className="event-card">
              <h3>城濮之战</h3>
              <p>晋文公大败楚军，称霸中原</p>
              <span className="event-year">前632年</span>
            </div>
            <div className="event-card">
              <h3>崤山之战</h3>
              <p>秦军被晋军大败，东进受阻</p>
              <span className="event-year">前627年</span>
            </div>
          </div>
        </section>

        <section className="phase-bonuses">
          <h2>🎁 春秋特殊加成</h2>
          <div className="bonus-grid">
            <div className="bonus-item">
              <span className="bonus-icon">⚔️</span>
              <span className="bonus-name">战车战斗力</span>
              <span className="bonus-value">+20%</span>
            </div>
            <div className="bonus-item">
              <span className="bonus-icon">📜</span>
              <span className="bonus-name">声望获取</span>
              <span className="bonus-value">+30%</span>
            </div>
            <div className="bonus-item">
              <span className="bonus-icon">🤝</span>
              <span className="bonus-name">外交成功率</span>
              <span className="bonus-value">+15%</span>
            </div>
          </div>
        </section>

        <footer className="phase-footer">
          <button className="phase-button" onClick={handleAdvancePhase}>
            进入战国时期 →
          </button>
        </footer>
      </div>
    </main>
  );
}
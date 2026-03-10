/**
 * 战国时期页面
 * 七雄并立，合纵连横
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../../../components/Game/GameProvider';
import { GamePhase } from '../../../components/Game/types/gameTypes';
import '../game.css';

export default function WarringStatesPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [objectives, setObjectives] = useState<string[]>([]);

  useEffect(() => {
    if (state.phase !== GamePhase.WARRING_STATES && state.phase !== GamePhase.SPRING_AUTUMN) {
      if (state.phase === GamePhase.UNIFICATION) {
        router.push('/game/unification');
      } else {
        router.push('/game');
      }
      return;
    }
    
    setObjectives([
      '消灭至少一个诸侯国',
      '建立自己的名将阵容',
      '完成连横或合纵',
      '积累10000声望'
    ]);
  }, [state.phase, router]);

  const handleAdvancePhase = () => {
    dispatch({ type: 'CHANGE_PHASE', payload: GamePhase.UNIFICATION });
    dispatch({ 
      type: 'ADD_LOG', 
      payload: { message: '时代变迁：秦朝统一天下！', type: 'success' } 
    });
    router.push('/game/unification');
  };

  return (
    <main className="phase-page warring-states-phase">
      <div className="phase-container">
        <header className="phase-header">
          <h1>⚔️ 战国时期</h1>
          <p className="phase-description">
            战国七雄并立：齐、楚、燕、韩、赵、魏、秦。合纵连横，纵横捭阖，兼并战争空前残酷。
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

        <section className="phase-factions">
          <h2>🏰 战国七雄</h2>
          <div className="factions-grid">
            <div className="faction-card" style={{borderColor: '#e74c3c'}}>
              <h3>秦国</h3>
              <p>商鞅变法，国力最强</p>
            </div>
            <div className="faction-card" style={{borderColor: '#3498db'}}>
              <h3>赵国</h3>
              <p>胡服骑射，军事强国</p>
            </div>
            <div className="faction-card" style={{borderColor: '#2ecc71'}}>
              <h3>楚国</h3>
              <p>地大物博，资源丰富</p>
            </div>
            <div className="faction-card" style={{borderColor: '#9b59b6'}}>
              <h3>齐国</h3>
              <p>渔盐之利，经济发达</p>
            </div>
            <div className="faction-card" style={{borderColor: '#f39c12'}}>
              <h3>魏国</h3>
              <p>魏武卒，战斗力强</p>
            </div>
            <div className="faction-card" style={{borderColor: '#1abc9c'}}>
              <h3>韩国</h3>
              <p>冶铁发达，兵器锐利</p>
            </div>
            <div className="faction-card" style={{borderColor: '#ecf0f1'}}>
              <h3>燕国</h3>
              <p>偏远苦寒，但有韧性</p>
            </div>
          </div>
        </section>

        <section className="phase-bonuses">
          <h2>🎁 战国特殊加成</h2>
          <div className="bonus-grid">
            <div className="bonus-item">
              <span className="bonus-icon">🛡️</span>
              <span className="bonus-name">城防建设</span>
              <span className="bonus-value">+25%</span>
            </div>
            <div className="bonus-item">
              <span className="bonus-icon">⚔️</span>
              <span className="bonus-name">攻击力</span>
              <span className="bonus-value">+15%</span>
            </div>
            <div className="bonus-item">
              <span className="bonus-icon">📊</span>
              <span className="bonus-name">资源生产</span>
              <span className="bonus-value">+20%</span>
            </div>
            <div className="bonus-item">
              <span className="bonus-icon">🎭</span>
              <span className="bonus-name">谋略成功率</span>
              <span className="bonus-value">+20%</span>
            </div>
          </div>
        </section>

        <footer className="phase-footer">
          <button className="phase-button" onClick={handleAdvancePhase}>
            开启统一之战 →
          </button>
        </footer>
      </div>
    </main>
  );
}
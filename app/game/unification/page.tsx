/**
 * 统一天下页面
 * 秦灭六国，一统天下
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../../../components/Game/GameProvider';
import { GamePhase } from '../../../components/Game/types/gameTypes';
import '../game.css';

export default function UnificationPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [territories, setTerritories] = useState(0);
  const [heroes, setHeroes] = useState(0);

  useEffect(() => {
    if (state.phase !== GamePhase.UNIFICATION) {
      router.push('/game');
      return;
    }
    
    setTerritories(state.territories.filter(t => t.ownerId === state.playerId).length);
    setHeroes(state.heroes.filter(h => h.isRecruited).length);
  }, [state, router]);

  const handleWin = () => {
    dispatch({ 
      type: 'ADD_LOG', 
      payload: { message: '恭喜！您完成了统一天下的大业！成为始皇帝！', type: 'success' } 
    });
  };

  return (
    <main className="phase-page unification-phase">
      <div className="phase-container">
        <header className="phase-header victory-header">
          <h1>👑 统一天下</h1>
          <p className="phase-description">
            秦皇扫六合，虎视何雄哉！挥剑决浮云，诸侯尽西来。
          </p>
        </header>

        <section className="victory-stats">
          <h2>📊 成就统计</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{state.turn}</span>
              <span className="stat-label">回合数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.floor(state.year)}</span>
              <span className="stat-label">年份</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{territories}</span>
              <span className="stat-label">控制领地</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{heroes}</span>
              <span className="stat-label">招募名将</span>
            </div>
          </div>
        </section>

        <section className="victory-achievements">
          <h2>🏆 达成成就</h2>
          <div className="achievements-list">
            <div className="achievement unlocked">
              <span className="achievement-icon">🎖️</span>
              <span className="achievement-name">小试牛刀</span>
              <span className="achievement-desc">完成第一场战斗</span>
            </div>
            <div className="achievement unlocked">
              <span className="achievement-icon">🏰</span>
              <span className="achievement-name">开疆拓土</span>
              <span className="achievement-desc">占领第一个领地</span>
            </div>
            {heroes >= 3 && (
              <div className="achievement unlocked">
                <span className="achievement-icon">🎭</span>
                <span className="achievement-name">人才济济</span>
                <span className="achievement-desc">招募3名武将</span>
              </div>
            )}
            {territories >= 10 && (
              <div className="achievement unlocked">
                <span className="achievement-icon">👑</span>
                <span className="achievement-name">战国霸主</span>
                <span className="achievement-desc">控制10个领地</span>
              </div>
            )}
          </div>
        </section>

        <section className="victory-congrats">
          <div className="congrats-box">
            <h2>🎉 大功告成！</h2>
            <p>您完成了统一天下的大业，结束了数百年的战国乱世</p>
            <p>您的名字将永远载入史册！</p>
            <button className="victory-button" onClick={handleWin}>
              载入史册
            </button>
          </div>
        </section>

        <footer className="phase-footer">
          <button className="phase-button secondary" onClick={() => router.push('/game')}>
            ← 返回游戏
          </button>
        </footer>
      </div>
    </main>
  );
}
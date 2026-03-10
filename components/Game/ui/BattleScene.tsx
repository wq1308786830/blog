/**
 * 战斗场景组件
 * 展示战斗动画和结果
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './battleScene.css';

// 战斗单位类型
interface BattleUnit {
  id: string;
  name: string;
  icon: string;
  count: number;
  maxCount: number;
  attack: number;
  defense: number;
}

// 战斗日志类型
interface BattleLog {
  id: string;
  message: string;
  type: 'attack' | 'defense' | 'damage' | 'victory' | 'defeat';
  timestamp: number;
}

// 战斗结果类型
interface BattleResult {
  winner: 'attacker' | 'defender';
  attackerLosses: number;
  defenderLosses: number;
  territoryCaptured?: boolean;
}

interface BattleSceneProps {
  isOpen: boolean;
  attacker: {
    name: string;
    faction: string;
    units: BattleUnit[];
    commander?: string;
  };
  defender: {
    name: string;
    faction: string;
    units: BattleUnit[];
    commander?: string;
  };
  territoryName: string;
  onClose: () => void;
  onComplete: (result: BattleResult) => void;
}

// 战斗动画组件
function BattleAnimation({ phase }: { phase: 'start' | 'combat' | 'end' }) {
  return (
    <div className="battle-animation">
      {phase === 'start' && (
        <motion.div
          className="battle-start-text"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="vs-text">VS</span>
        </motion.div>
      )}
      {phase === 'combat' && (
        <div className="combat-effects">
          <motion.div
            className="effect clash"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            ⚔️
          </motion.div>
          <motion.div
            className="effect spark"
            animate={{ opacity: [0, 1, 0], x: [-50, 50] }}
            transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
          >
            ✨
          </motion.div>
        </div>
      )}
    </div>
  );
}

// 单位卡片组件
function BattleUnitCard({
  unit,
  isAttacker,
  isAnimating,
}: {
  unit: BattleUnit;
  isAttacker: boolean;
  isAnimating: boolean;
}) {
  const healthPercent = (unit.count / unit.maxCount) * 100;

  return (
    <motion.div
      className={`battle-unit-card ${isAttacker ? 'attacker' : 'defender'}`}
      animate={isAnimating ? { x: isAttacker ? [0, 20, 0] : [0, -20, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="unit-icon-large">{unit.icon}</div>
      <div className="unit-info">
        <div className="unit-name">{unit.name}</div>
        <div className="unit-count">
          {unit.count.toLocaleString()} / {unit.maxCount.toLocaleString()}
        </div>
        <div className="health-bar">
          <motion.div
            className="health-fill"
            style={{
              backgroundColor:
                healthPercent > 50 ? '#00ff66' : healthPercent > 25 ? '#ffcc00' : '#ff0000',
            }}
            initial={{ width: `${healthPercent}%` }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// 主组件
export function BattleScene({
  isOpen,
  attacker,
  defender,
  territoryName,
  onClose,
  onComplete,
}: BattleSceneProps) {
  const [phase, setPhase] = useState<'start' | 'combat' | 'end'>('start');
  const [attackerUnits, setAttackerUnits] = useState<BattleUnit[]>(attacker.units);
  const [defenderUnits, setDefenderUnits] = useState<BattleUnit[]>(defender.units);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [round, setRound] = useState(1);
  const [result, setResult] = useState<BattleResult | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // 添加战斗日志
  const addLog = useCallback((message: string, type: BattleLog['type']) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        message,
        type,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // 自动滚动日志
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // 开始战斗
  useEffect(() => {
    if (!isOpen) return;

    const startBattle = async () => {
      // 开场动画
      setPhase('start');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 进入战斗阶段
      setPhase('combat');
      setIsAnimating(true);

      // 模拟战斗回合
      const maxRounds = 10;
      let currentRound = 1;

      while (currentRound <= maxRounds) {
        setRound(currentRound);

        // 攻击方造成伤害
        const attackerDamage = Math.floor(
          attackerUnits.reduce((sum, u) => sum + u.attack * (u.count / u.maxCount), 0) *
            (0.8 + Math.random() * 0.4)
        );

        // 防御方造成伤害
        const defenderDamage = Math.floor(
          defenderUnits.reduce((sum, u) => sum + u.attack * (u.count / u.maxCount), 0) *
            (0.8 + Math.random() * 0.4)
        );

        // 应用伤害
        setDefenderUnits((prev) => {
          const newUnits = [...prev];
          let remainingDamage = defenderDamage;

          for (let i = 0; i < newUnits.length && remainingDamage > 0; i++) {
            const damage = Math.min(remainingDamage, newUnits[i].count);
            newUnits[i] = { ...newUnits[i], count: Math.max(0, newUnits[i].count - damage) };
            remainingDamage -= damage;
          }

          return newUnits;
        });

        setAttackerUnits((prev) => {
          const newUnits = [...prev];
          let remainingDamage = attackerDamage;

          for (let i = 0; i < newUnits.length && remainingDamage > 0; i++) {
            const damage = Math.min(remainingDamage, newUnits[i].count);
            newUnits[i] = { ...newUnits[i], count: Math.max(0, newUnits[i].count - damage) };
            remainingDamage -= damage;
          }

          return newUnits;
        });

        addLog(`第 ${currentRound} 回合`, 'attack');
        addLog(`${attacker.name} 造成 ${attackerDamage} 点伤害`, 'attack');
        addLog(`${defender.name} 造成 ${defenderDamage} 点伤害`, 'defense');

        // 检查战斗是否结束
        const attackerTotal = attackerUnits.reduce((sum, u) => sum + u.count, 0);
        const defenderTotal = defenderUnits.reduce((sum, u) => sum + u.count, 0);

        if (attackerTotal <= 0 || defenderTotal <= 0 || currentRound >= maxRounds) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        currentRound++;
      }

      // 战斗结束
      setIsAnimating(false);
      setPhase('end');

      const finalAttackerCount = attackerUnits.reduce((sum, u) => sum + u.count, 0);
      const finalDefenderCount = defenderUnits.reduce((sum, u) => sum + u.count, 0);
      const initialAttackerCount = attacker.units.reduce((sum, u) => sum + u.maxCount, 0);
      const initialDefenderCount = defender.units.reduce((sum, u) => sum + u.maxCount, 0);

      const battleResult: BattleResult = {
        winner: finalAttackerCount > finalDefenderCount ? 'attacker' : 'defender',
        attackerLosses: initialAttackerCount - finalAttackerCount,
        defenderLosses: initialDefenderCount - finalDefenderCount,
        territoryCaptured: finalAttackerCount > finalDefenderCount,
      };

      setResult(battleResult);

      if (battleResult.winner === 'attacker') {
        addLog(`🏆 ${attacker.name} 获得胜利！`, 'victory');
        addLog(`领地 ${territoryName} 被攻占`, 'victory');
      } else {
        addLog(`🛡️ ${defender.name} 防守成功！`, 'defense');
      }
    };

    startBattle();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="battle-scene-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="battle-scene"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* 战斗标题 */}
          <div className="battle-header">
            <h2 className="battle-title">
              <span className="swords">⚔️</span>
              战斗进行中
              <span className="swords">⚔️</span>
            </h2>
            <div className="battle-location">📍 {territoryName}</div>
          </div>

          {/* 战斗主体 */}
          <div className="battle-body">
            {/* 攻击方 */}
            <div className="battle-side attacker">
              <div className="side-header">
                <div className="faction-badge attacker">攻</div>
                <div className="faction-info">
                  <div className="faction-name">{attacker.name}</div>
                  <div className="commander">
                    {attacker.commander ? `👤 ${attacker.commander}` : '无统帅'}
                  </div>
                </div>
              </div>
              <div className="units-list">
                {attackerUnits.map((unit) => (
                  <BattleUnitCard
                    key={unit.id}
                    unit={unit}
                    isAttacker={true}
                    isAnimating={isAnimating}
                  />
                ))}
              </div>
            </div>

            {/* 中央动画区域 */}
            <div className="battle-center">
              <BattleAnimation phase={phase} />
              {phase === 'combat' && (
                <div className="round-counter">第 {round} 回合</div>
              )}
              {phase === 'end' && result && (
                <motion.div
                  className={`battle-result ${result.winner}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="result-icon">
                    {result.winner === 'attacker' ? '🏆' : '🛡️'}
                  </div>
                  <div className="result-text">
                    {result.winner === 'attacker' ? '进攻方胜利' : '防守方胜利'}
                  </div>
                </motion.div>
              )}
            </div>

            {/* 防守方 */}
            <div className="battle-side defender">
              <div className="side-header">
                <div className="faction-badge defender">守</div>
                <div className="faction-info">
                  <div className="faction-name">{defender.name}</div>
                  <div className="commander">
                    {defender.commander ? `👤 ${defender.commander}` : '无统帅'}
                  </div>
                </div>
              </div>
              <div className="units-list">
                {defenderUnits.map((unit) => (
                  <BattleUnitCard
                    key={unit.id}
                    unit={unit}
                    isAttacker={false}
                    isAnimating={isAnimating}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 战斗日志 */}
          <div className="battle-logs">
            <h4 className="logs-title">📜 战斗日志</h4>
            <div className="logs-content">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  className={`log-entry ${log.type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {log.message}
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* 底部按钮 */}
          {phase === 'end' && result && (
            <div className="battle-footer">
              <div className="casualties-report">
                <div className="casualty">
                  <span>⚔️ {attacker.name} 损失:</span>
                  <span className="loss">{result.attackerLosses.toLocaleString()}</span>
                </div>
                <div className="casualty">
                  <span>🛡️ {defender.name} 损失:</span>
                  <span className="loss">{result.defenderLosses.toLocaleString()}</span>
                </div>
              </div>
              <button
                className="cyber-button close-btn"
                onClick={() => {
                  onComplete(result);
                  onClose();
                }}
              >
                确认
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BattleScene;

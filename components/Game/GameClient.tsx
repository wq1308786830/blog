/**
 * 游戏客户端主组件
 * 管理游戏状态和渲染
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { GameProvider, useGame } from './GameProvider';
import { GameScene } from './GameScene';
import { ResourcePanel } from './ui/ResourcePanel';
import { ActionMenu } from './ui/ActionMenu';
import { TerritoryInfo } from './ui/TerritoryInfo';
import { Timeline } from './ui/Timeline';
import { GameMenu } from './ui/GameMenu';
import { DiplomacyPanel } from './ui/DiplomacyPanel';
import { TechPanel } from './ui/TechPanel';
import { TerritoryMap } from './map/TerritoryMap';
import { HeroRecruit } from './ui/HeroRecruit';
import { PhaseDisplay, PhaseTransition } from './PhaseDisplay';
import { INITIAL_TERRITORIES } from './data/territories';
import { INITIAL_HEROES } from './data/heroes';
import type { Territory, Resources } from './types/gameTypes';
import { GamePhase } from './types/gameTypes';
import { simulateAIFactions, type AIDecision, checkPhaseTransition, getPhaseName } from '../../services/game/gameEngine';
import { executeBattle, createArmy, UNIT_STATS, type BattleResult } from '../../services/game/battleSystem';
import { getInitialArmyByFaction, createTemporaryArmy } from './data/armies';
import type { Army } from './types/gameTypes';
import './gameClient.css';

// 势力名称映射
const FACTION_NAMES: Record<string, string> = {
  'faction-qin': '秦国',
  'faction-qi': '齐国',
  'faction-chu': '楚国',
  'faction-zhao': '赵国',
  'faction-wei': '魏国',
  'faction-han': '韩国',
  'faction-yan': '燕国',
  'faction-jin': '晋国',
  'faction-zhou': '周王室',
  'faction-song': '宋国',
  'faction-lu': '鲁国',
  'faction-wu': '吴国',
  'faction-yue': '越国',
  'faction-ba': '巴国',
  'faction-shu': '蜀国',
};

function getFactionName(factionId: string): string {
  return FACTION_NAMES[factionId] || factionId.replace('faction-', '');
}

// 游戏内容组件
function GameContent() {
  const { state, dispatch, playerState, playerDispatch } = useGame();
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'diplomacy' | 'heroes' | 'tech'>('map');
  const [showDiplomacy, setShowDiplomacy] = useState(false);
  const [showTech, setShowTech] = useState(false);
  const [showHeroRecruit, setShowHeroRecruit] = useState(false);
  const [phaseTransition, setPhaseTransition] = useState<{ oldPhase: GamePhase; newPhase: GamePhase } | null>(null);

  // 初始化游戏
  useEffect(() => {
    if (state.territories.length === 0) {
      // 初始化领地
      dispatch({
        type: 'INIT_GAME',
        payload: {
          territories: INITIAL_TERRITORIES,
          heroes: INITIAL_HEROES,
        },
      });

      // 初始化玩家
      playerDispatch({
        type: 'INIT_PLAYER',
        payload: {
          factionId: 'faction-qin',
          controlledTerritories: ['qin-yong'],
        },
      });
    }
  }, [state.territories.length, dispatch, playerDispatch]);

  // 获取选中的领地
  const selectedTerritory = useMemo(() => {
    if (!selectedTerritoryId) return null;
    return state.territories.find((t) => t.id === selectedTerritoryId) || null;
  }, [selectedTerritoryId, state.territories]);

  // 处理领地选择
  const handleTerritorySelect = useCallback((territoryId: string) => {
    setSelectedTerritoryId(territoryId);
  }, []);

  // 获取或创建军队数据
  const getOrCreateArmy = useCallback((factionId: string, territoryId: string, isPlayer: boolean): Army => {
    // 尝试从预设军队获取
    const presetArmy = getInitialArmyByFaction(factionId);
    if (presetArmy) {
      return { ...presetArmy, currentTerritoryId: territoryId };
    }
    // 创建临时军队
    return createTemporaryArmy(factionId, territoryId, isPlayer ? 150 : 100);
  }, []);

  // 获取或创建军队数据（AI使用）
  const getOrCreateAIArmy = useCallback((factionId: string, territoryId: string): Army => {
    const presetArmy = getInitialArmyByFaction(factionId);
    if (presetArmy) {
      return { ...presetArmy, currentTerritoryId: territoryId };
    }
    return createTemporaryArmy(factionId, territoryId, 80);
  }, []);

  // 处理 AI 势力决策
  const processAIDecisions = useCallback(() => {
    const aiDecisions = simulateAIFactions(state, playerState.factionId);

    for (const decision of aiDecisions) {
      if (decision.action === 'attack' && decision.targetId) {
        const target = state.territories.find((t: Territory) => t.id === decision.targetId);

        if (target) {
          // 目标是中立领地（无所有者或所有者不在游戏中）
          if (!target.ownerId || !FACTION_NAMES[target.ownerId]) {
            // AI 征服中立领地
            dispatch({
              type: 'CONQUER_TERRITORY',
              payload: { territoryId: decision.targetId, conquerorId: decision.factionId }
            });
            dispatch({
              type: 'ADD_LOG',
              payload: {
                message: `${getFactionName(decision.factionId)} 占领了 ${target.name}`,
                type: 'info'
              }
            });
          }
          // 目标是玩家领地
          else if (target.ownerId === playerState.factionId) {
            // 使用战斗系统进行战斗
            const attackerArmy = getOrCreateAIArmy(decision.factionId, decision.targetId);
            const defenderArmy = getOrCreateArmy(playerState.factionId, decision.targetId, true);

            const battleResult = executeBattle(
              attackerArmy,
              defenderArmy,
              undefined,
              undefined,
              target.terrain,
              'sunny'
            );

            if (battleResult.winner === 'attacker') {
              // AI 攻击成功，玩家失去领地
              dispatch({
                type: 'CONQUER_TERRITORY',
                payload: { territoryId: decision.targetId, conquerorId: decision.factionId }
              });
              playerDispatch({
                type: 'REMOVE_TERRITORY',
                payload: decision.targetId
              });
              dispatch({
                type: 'ADD_LOG',
                payload: {
                  message: `⚠️ ${getFactionName(decision.factionId)} 攻占了你的领地 ${target.name}！损失 ${battleResult.defenderLosses} 人`,
                  type: 'error'
                }
              });
            } else {
              // AI 攻击失败
              dispatch({
                type: 'ADD_LOG',
                payload: {
                  message: `🛡️ ${getFactionName(decision.factionId)} 进攻 ${target.name} 被击退，敌军损失 ${battleResult.attackerLosses} 人`,
                  type: 'success'
                }
              });
            }
          }
        }
      } else if (decision.action === 'defend') {
        dispatch({
          type: 'ADD_LOG',
          payload: {
            message: `${getFactionName(decision.factionId)} 巩固防守`,
            type: 'info'
          }
        });
      }
    }

    return aiDecisions;
  }, [state, playerState.factionId, dispatch, playerDispatch, getOrCreateAIArmy, getOrCreateArmy]);

  // 处理下一回合
  const handleNextTurn = useCallback(() => {
    dispatch({ type: 'NEXT_TURN' });

    // 增加资源
    const controlledTerritories = state.territories.filter(
      (t: Territory) => t.ownerId === playerState.factionId
    );

    const resourceGain = controlledTerritories.reduce(
      (acc: { population: number; food: number; gold: number; wood: number; iron: number; prestige: number }, t: Territory) => ({
        population: acc.population + t.resources.population * 0.1,
        food: acc.food + t.resources.food * 0.1,
        gold: acc.gold + t.resources.gold * 0.1,
        wood: acc.wood + t.resources.wood * 0.05,
        iron: acc.iron + t.resources.iron * 0.05,
        prestige: acc.prestige + 1,
      }),
      { population: 0, food: 0, gold: 0, wood: 0, iron: 0, prestige: 0 }
    );

    playerDispatch({
      type: 'UPDATE_RESOURCES',
      payload: resourceGain,
    });

    // 添加回合开始日志
    dispatch({
      type: 'ADD_LOG',
      payload: {
        message: `第 ${state.turn + 1} 回合开始 - ${Math.floor(state.year + (state.phase === GamePhase.EARLY_ZHOU ? 1 : 0.5))}年`,
        type: 'info',
      },
    });

    // 检查阶段转换
    const currentPhase = state.phase;
    const newPhase = checkPhaseTransition(
      currentPhase,
      state.turn + 1,
      playerState.controlledTerritories.length
    );

    if (newPhase && newPhase !== currentPhase) {
      dispatch({ type: 'CHANGE_PHASE', payload: newPhase });
      setPhaseTransition({ oldPhase: currentPhase, newPhase });
      dispatch({
        type: 'ADD_LOG',
        payload: {
          message: `历史进入新纪元：${getPhaseName(newPhase)}`,
          type: 'success',
        },
      });
    }

    // 处理 AI 势力决策
    processAIDecisions();

  }, [dispatch, playerDispatch, state.territories, state.turn, state.year, state.phase, playerState.factionId, playerState.controlledTerritories.length, processAIDecisions]);

  // 处理征服领地
  const handleConquerTerritory = useCallback((territoryId: string) => {
    dispatch({
      type: 'CONQUER_TERRITORY',
      payload: { territoryId, conquerorId: playerState.factionId },
    });

    playerDispatch({
      type: 'ADD_TERRITORY',
      payload: territoryId,
    });

    dispatch({
      type: 'ADD_LOG',
      payload: {
        message: `成功征服领地：${state.territories.find((t: Territory) => t.id === territoryId)?.name}`,
        type: 'success',
      },
    });
  }, [dispatch, playerDispatch, playerState.factionId, state.territories]);


  const handleBattle = useCallback((fromId: string, toId: string) => {
    const source = state.territories.find((t: Territory) => t.id === fromId);
    const target = state.territories.find((t: Territory) => t.id === toId);

    // 验证来源领地存在且属于玩家
    if (!source || source.ownerId !== playerState.factionId) {
      dispatch({
        type: 'ADD_LOG',
        payload: { message: '无法发起攻击：来源领地不属于你', type: 'error' }
      });
      return;
    }

    // 验证目标领地存在且有所有者（非中立）
    if (!target || !target.ownerId) {
      dispatch({
        type: 'ADD_LOG',
        payload: { message: '无法攻击：目标领地不存在或为中立', type: 'error' }
      });
      return;
    }

    // 验证两个领地是否相邻
    if (!source.connectedTo.includes(toId)) {
      dispatch({
        type: 'ADD_LOG',
        payload: { message: '无法攻击：目标领地不相邻', type: 'error' }
      });
      return;
    }

    // 使用战斗系统进行战斗计算
    const attackerArmy = getOrCreateArmy(playerState.factionId, fromId, true);
    const defenderArmy = getOrCreateArmy(target.ownerId, toId, false);

    // 查找可能的武将（如果已招募）
    const attackerHero = state.heroes.find((h) =>
      playerState.recruitedHeroes.includes(h.id) && h.assignedArmyId === attackerArmy.id
    );
    const defenderHero = state.heroes.find((h) =>
      h.factionId === target.ownerId && h.assignedArmyId === defenderArmy.id
    );

    // 执行战斗
    const battleResult = executeBattle(
      attackerArmy,
      defenderArmy,
      attackerHero,
      defenderHero,
      target.terrain,
      'sunny'
    );

    // 添加战斗详细日志
    dispatch({
      type: 'ADD_LOG',
      payload: {
        message: `⚔️ 战斗开始：进攻 ${target.name}`,
        type: 'battle'
      }
    });

    battleResult.details.forEach((detail) => {
      dispatch({
        type: 'ADD_LOG',
        payload: { message: `  ${detail}`, type: 'battle' }
      });
    });

    if (battleResult.winner === 'attacker') {
      dispatch({ type: "CONQUER_TERRITORY", payload: { territoryId: toId, conquerorId: playerState.factionId } });
      playerDispatch({ type: "ADD_TERRITORY", payload: toId });
      dispatch({
        type: "ADD_LOG",
        payload: {
          message: `✅ 战斗胜利！成功攻占 ${target.name}，我方损失 ${battleResult.attackerLosses} 人`,
          type: "success"
        }
      });
    } else {
      dispatch({
        type: "ADD_LOG",
        payload: {
          message: `❌ 战斗失败！无法攻占 ${target.name}，我方损失 ${battleResult.attackerLosses} 人`,
          type: "error"
        }
      });
    }
  }, [dispatch, playerDispatch, playerState.factionId, playerState.recruitedHeroes, state.territories, state.heroes, getOrCreateArmy]);

  // 处理武将招募
  const handleRecruitHero = useCallback((heroId: string, cost: Resources) => {
    // 检查资源是否足够
    if (
      playerState.resources.gold < cost.gold ||
      playerState.resources.food < cost.food ||
      playerState.resources.population < cost.population ||
      playerState.resources.wood < cost.wood ||
      playerState.resources.iron < cost.iron
    ) {
      dispatch({
        type: 'ADD_LOG',
        payload: { message: '资源不足，无法招募武将', type: 'error' }
      });
      return;
    }

    // 扣除资源
    const newResources: Partial<Resources> = {
      gold: playerState.resources.gold - cost.gold,
      food: playerState.resources.food - cost.food,
      population: playerState.resources.population - cost.population,
      wood: playerState.resources.wood - cost.wood,
      iron: playerState.resources.iron - cost.iron,
    };
    playerDispatch({ type: 'UPDATE_RESOURCES', payload: newResources });

    // 添加武将到已招募列表
    playerDispatch({ type: 'RECRUIT_HERO', payload: heroId });

    // 更新武将状态
    dispatch({
      type: 'RECRUIT_HERO',
      payload: {
        hero: state.heroes.find((h) => h.id === heroId)!,
        territoryId: playerState.controlledTerritories[0] || ''
      }
    });

    const hero = state.heroes.find((h) => h.id === heroId);
    dispatch({
      type: 'ADD_LOG',
      payload: {
        message: `武将 ${hero?.name || heroId} 已加入你的阵营！`,
        type: 'success'
      }
    });

    setShowHeroRecruit(false);
  }, [dispatch, playerDispatch, playerState.resources, playerState.controlledTerritories, state.heroes]);

  return (
    <div className="game-container">
      {/* 游戏头部 */}
      <header className="game-header">
        <div className="game-header-left">
          <button
            className="game-menu-button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="打开菜单"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="game-title">春秋战国</h1>
        </div>

        <Timeline
          phase={state.phase}
          year={state.year}
          turn={state.turn}
        />

        <div className="game-header-right">
          <button
            className="cyber-button hero-recruit-button"
            onClick={() => setShowHeroRecruit(true)}
          >
            招募武将
          </button>
          <button
            className="cyber-button next-turn-button"
            onClick={handleNextTurn}
          >
            下一回合
          </button>
        </div>
      </header>

      {/* 游戏主体 */}
      <div className="game-body">
        {/* 左侧面板 - 资源面板 */}
        <aside className="game-left-panel">
          <ResourcePanel
            resources={playerState.resources}
            territoryCount={playerState.controlledTerritories.length}
          />

          <ActionMenu
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </aside>

        {/* 地图容器 */}
        <main className="game-map-container">
          <TerritoryMap
            territories={state.territories}
            selectedTerritoryId={selectedTerritoryId}
            onTerritorySelect={handleTerritorySelect}
            playerFactionId={playerState.factionId}
          onBattle={handleBattle}
          />

          {/* Three.js 场景背景 */}
          <GameScene
            territories={state.territories}
            selectedTerritoryId={selectedTerritoryId}
          />
        </main>

        {/* 右侧面板 - 领地信息 */}
        <aside className="game-right-panel">
          <PhaseDisplay
            phase={state.phase}
            year={state.year}
            turn={state.turn}
          />
          <TerritoryInfo
            territory={selectedTerritory}
            onConquer={handleConquerTerritory}
            playerFactionId={playerState.factionId}
          />
        </aside>
      </div>

      {/* 游戏菜单 */}
      <GameMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSave={() => {
          localStorage.setItem('warringStatesGame_save', JSON.stringify(state));
          dispatch({ type: 'ADD_LOG', payload: { message: '游戏已保存', type: 'success' } });
        }}
        onLoad={() => {
          const saved = localStorage.getItem('warringStatesGame_save');
          if (saved) {
            dispatch({ type: 'LOAD_GAME', payload: JSON.parse(saved) });
            dispatch({ type: 'ADD_LOG', payload: { message: '游戏已加载', type: 'success' } });
          }
        }}
        onReset={() => {
          dispatch({ type: 'RESET_GAME' });
          playerDispatch({ type: 'RESET_PLAYER' });
          dispatch({ type: 'ADD_LOG', payload: { message: '游戏已重置', type: 'warning' } });
        }}
      />

      {/* 武将招募模态框 */}
      {showHeroRecruit && (
        <HeroRecruit
          heroes={state.heroes}
          playerResources={playerState.resources}
          recruitedHeroIds={playerState.recruitedHeroes}
          onRecruit={handleRecruitHero}
          onClose={() => setShowHeroRecruit(false)}
        />
      )}

      {/* 阶段转换通知 */}
      {phaseTransition && (
        <PhaseTransition
          oldPhase={phaseTransition.oldPhase}
          newPhase={phaseTransition.newPhase}
          onClose={() => setPhaseTransition(null)}
        />
      )}
    </div>
  );
}

// 主组件
export default function GameClient() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export { GameClient };

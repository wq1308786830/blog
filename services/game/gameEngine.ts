/**
 * 游戏引擎
 * 核心游戏逻辑和循环
 */

import type {
  GameState,
  Territory,
  Resources,
  GamePhase,
  Faction,
} from '../../components/Game/types/gameTypes';
import { ArmyStatus, TerrainType } from '../../components/Game/types/gameTypes';

// 回合配置
export interface TurnConfig {
  baseResourceGrowth: Resources;
  populationGrowthRate: number;
  moraleDecayRate: number;
  maxMorale: number;
}

// 默认配置
export const DEFAULT_TURN_CONFIG: TurnConfig = {
  baseResourceGrowth: {
    population: 50,
    food: 30,
    gold: 20,
    wood: 10,
    iron: 5,
    prestige: 1,
  },
  populationGrowthRate: 0.02,
  moraleDecayRate: 2,
  maxMorale: 100,
};

// 计算领地资源产出
export function calculateTerritoryResources(territory: Territory): Resources {
  // 使用建筑数量来估算发展水平
  const developmentMultiplier = Math.max(1, (territory.buildings?.length || 0) * 0.2);

  return {
    population: Math.floor(territory.resources.population * 0.05 * developmentMultiplier),
    food: Math.floor(territory.resources.food * 0.1 * developmentMultiplier),
    gold: Math.floor(territory.resources.gold * 0.08 * developmentMultiplier),
    wood: Math.floor(territory.resources.wood * 0.05 * developmentMultiplier),
    iron: Math.floor(territory.resources.iron * 0.03 * developmentMultiplier),
    prestige: territory.isCapital ? 5 : 1,
  };
}

// 计算势力总资源产出
export function calculateFactionResources(
  factionId: string,
  territories: Territory[]
): Resources {
  const controlledTerritories = territories.filter((t) => t.ownerId === factionId);

  return controlledTerritories.reduce(
    (total, territory) => {
      const territoryResources = calculateTerritoryResources(territory);
      return {
        population: total.population + territoryResources.population,
        food: total.food + territoryResources.food,
        gold: total.gold + territoryResources.gold,
        wood: total.wood + territoryResources.wood,
        iron: total.iron + territoryResources.iron,
        prestige: total.prestige + territoryResources.prestige,
      };
    },
    {
      population: 0,
      food: 0,
      gold: 0,
      wood: 0,
      iron: 0,
      prestige: 0,
    }
  );
}

// 检查阶段过渡条件
export function checkPhaseTransition(
  currentPhase: GamePhase,
  turn: number,
  controlledTerritoryCount: number
): GamePhase | null {
  const phaseTransitions: Record<GamePhase, { minTurn: number; minTerritories: number; next: GamePhase }> = {
    early_zhou: {
      minTurn: 10,
      minTerritories: 3,
      next: 'spring_autumn' as GamePhase,
    },
    spring_autumn: {
      minTurn: 30,
      minTerritories: 8,
      next: 'warring_states' as GamePhase,
    },
    warring_states: {
      minTurn: 60,
      minTerritories: 15,
      next: 'unification' as GamePhase,
    },
    unification: {
      minTurn: Infinity,
      minTerritories: Infinity,
      next: 'unification' as GamePhase,
    },
  };

  const transition = phaseTransitions[currentPhase];
  if (!transition) return null;

  if (turn >= transition.minTurn && controlledTerritoryCount >= transition.minTerritories) {
    return transition.next;
  }

  return null;
}

// 计算年份
export function calculateYear(phase: GamePhase, turn: number): number {
  const phaseStartYears: Record<GamePhase, number> = {
    early_zhou: -770,
    spring_autumn: -770,
    warring_states: -475,
    unification: -221,
  };

  const startYear = phaseStartYears[phase] || -770;
  return startYear + Math.floor(turn / 4); // 每4回合1年
}

// 处理回合结束
export interface TurnResult {
  newState: Partial<GameState>;
  resourceGains: Resources;
  phaseChanged: boolean;
  newPhase?: GamePhase;
  events: string[];
}

export function processTurn(
  state: GameState,
  factionId: string,
  config: TurnConfig = DEFAULT_TURN_CONFIG
): TurnResult {
  const events: string[] = [];

  // 计算资源增长
  const resourceGains = calculateFactionResources(factionId, state.territories);

  // 检查阶段过渡
  const controlledTerritories = state.territories.filter((t) => t.ownerId === factionId).length;
  const newPhase = checkPhaseTransition(state.phase, state.turn + 1, controlledTerritories);
  const phaseChanged = newPhase !== null;

  if (phaseChanged && newPhase) {
    events.push(`历史进入新阶段: ${getPhaseName(newPhase)}`);
  }

  // 更新军队士气
  const updatedArmies = state.armies.map((army) => ({
    ...army,
    morale: Math.max(0, army.morale - config.moraleDecayRate),
    movementPoints: 100, // 恢复移动力
  }));

  // 更新年份
  const newYear = calculateYear(newPhase || state.phase, state.turn + 1);

  return {
    newState: {
      turn: state.turn + 1,
      year: newYear,
      phase: newPhase || state.phase,
      armies: updatedArmies,
    },
    resourceGains,
    phaseChanged,
    newPhase: newPhase || undefined,
    events,
  };
}

// 获取阶段名称
export function getPhaseName(phase: GamePhase): string {
  const phaseNames: Record<GamePhase, string> = {
    early_zhou: '周朝后期',
    spring_autumn: '春秋时期',
    warring_states: '战国时期',
    unification: '秦统一天下',
  };
  return phaseNames[phase] || '未知时期';
}

// 获取阶段描述
export function getPhaseDescription(phase: GamePhase): string {
  const descriptions: Record<GamePhase, string> = {
    early_zhou: '周王室衰微，诸侯开始割据，你需要建立自己的势力',
    spring_autumn: '诸侯争霸，五霸相继崛起，你能否成为一方霸主？',
    warring_states: '七雄并立，战火纷飞，统一天下的时刻即将到来',
    unification: '最后的决战，消灭六国，建立统一帝国',
  };
  return descriptions[phase] || '';
}

// AI 行为模拟
export interface AIDecision {
  factionId: string;
  action: 'attack' | 'defend' | 'expand' | 'ally' | 'none';
  targetId?: string;
  reason: string;
}

// AI 势力性格配置
const AI_PERSONALITIES: Record<string, { aggression: number; expansion: number; diplomacy: number }> = {
  'faction-qin': { aggression: 0.8, expansion: 0.9, diplomacy: 0.3 },    // 秦国：激进扩张
  'faction-qi': { aggression: 0.4, expansion: 0.5, diplomacy: 0.7 },     // 齐国：经济发展
  'faction-chu': { aggression: 0.5, expansion: 0.6, diplomacy: 0.5 },    // 楚国：平衡发展
  'faction-zhao': { aggression: 0.7, expansion: 0.7, diplomacy: 0.4 },   // 赵国：军事优先
  'faction-wei': { aggression: 0.6, expansion: 0.6, diplomacy: 0.5 },    // 魏国：平衡
  'faction-han': { aggression: 0.3, expansion: 0.4, diplomacy: 0.6 },    // 韩国：防御为主
  'faction-yan': { aggression: 0.4, expansion: 0.5, diplomacy: 0.5 },    // 燕国：北方防御
  'faction-jin': { aggression: 0.6, expansion: 0.7, diplomacy: 0.5 },    // 晋国：霸主
  'faction-zhou': { aggression: 0.1, expansion: 0.2, diplomacy: 0.9 },   // 周王室：外交优先
  'faction-wu': { aggression: 0.6, expansion: 0.7, diplomacy: 0.4 },     // 吴国：扩张
  'faction-yue': { aggression: 0.5, expansion: 0.6, diplomacy: 0.5 },    // 越国：平衡
};

// 评估领地价值
export function evaluateTerritoryValue(territory: Territory): number {
  let value = 0;

  // 资源价值
  value += territory.resources.gold * 2;
  value += territory.resources.food * 1.5;
  value += territory.resources.iron * 1.8;
  value += territory.resources.wood * 1.2;
  value += territory.resources.population * 0.5;

  // 战略价值
  if (territory.isCapital) value += 100;
  if (territory.defenses > 5) value += 30;

  // 人口价值
  value += territory.population * 0.001;

  return value;
}

// 评估军事力量对比
export function evaluateMilitaryStrength(
  attackerFactionId: string,
  defenderFactionId: string,
  territories: Territory[]
): { attackerStrength: number; defenderStrength: number; ratio: number } {
  const attackerTerritories = territories.filter(t => t.ownerId === attackerFactionId);
  const defenderTerritories = territories.filter(t => t.ownerId === defenderFactionId);

  const calculateStrength = (factionTerritories: Territory[]): number => {
    return factionTerritories.reduce((sum, t) => {
      // 基于人口、防御、资源计算军事实力
      const baseStrength = t.population * 0.01;
      const defenseBonus = t.defenses * 20;
      const resourceBonus = (t.resources.gold + t.resources.iron) * 0.5;
      return sum + baseStrength + defenseBonus + resourceBonus;
    }, 0);
  };

  const attackerStrength = calculateStrength(attackerTerritories);
  const defenderStrength = calculateStrength(defenderTerritories);

  return {
    attackerStrength,
    defenderStrength,
    ratio: defenderStrength > 0 ? attackerStrength / defenderStrength : 10,
  };
}

// AI 决策：选择最佳攻击目标
function selectBestTarget(
  factionId: string,
  borderTerritories: Territory[],
  territories: Territory[],
  personality: { aggression: number; expansion: number }
): Territory | null {
  if (borderTerritories.length === 0) return null;

  // 计算每个目标的价值和风险评估
  const targetScores = borderTerritories.map(target => {
    // 目标价值
    const territoryValue = evaluateTerritoryValue(target);

    // 如果目标是玩家或其他势力，评估军事对比
    let riskFactor = 1;
    if (target.ownerId && target.ownerId !== factionId) {
      const military = evaluateMilitaryStrength(factionId, target.ownerId, territories);
      // 军事比例越低，风险越高
      riskFactor = Math.min(1, military.ratio * 0.5);
    }

    // 防御评估
    const defensePenalty = target.defenses * 5;

    // 最终得分 = 价值 * 风险因子 - 防御惩罚
    const score = territoryValue * riskFactor * personality.aggression - defensePenalty;

    return { target, score };
  });

  // 按得分排序
  targetScores.sort((a, b) => b.score - a.score);

  // 根据侵略性决定是否进攻
  const bestTarget = targetScores[0];
  if (bestTarget && bestTarget.score > 0) {
    // 侵略性越高，越可能选择高价值目标
    if (Math.random() < personality.aggression + personality.expansion * 0.5) {
      return bestTarget.target;
    }
  }

  return null;
}

export function simulateAIFactions(
  state: GameState,
  playerFactionId: string
): AIDecision[] {
  const decisions: AIDecision[] = [];
  const aiFactions = Array.from(new Set(state.territories.map((t) => t.ownerId).filter(Boolean)))
    .filter((id) => id !== playerFactionId);

  for (const factionId of aiFactions) {
    if (!factionId) continue;

    const factionTerritories = state.territories.filter((t) => t.ownerId === factionId);
    if (factionTerritories.length === 0) continue;

    // 获取势力性格
    const personality = AI_PERSONALITIES[factionId] || { aggression: 0.5, expansion: 0.5, diplomacy: 0.5 };

    // 获取相邻的敌方/中立领地
    const borderTerritories = factionTerritories.flatMap((t) =>
      t.connectedTo
        .map((id) => state.territories.find((ter) => ter.id === id))
        .filter((ter): ter is Territory => ter !== undefined && ter.ownerId !== factionId)
    );

    // 决策逻辑
    const territoryCount = factionTerritories.length;

    // 1. 优先扩张决策
    if (borderTerritories.length > 0) {
      const bestTarget = selectBestTarget(factionId, borderTerritories, state.territories, personality);

      if (bestTarget) {
        // 检查是否是玩家领地
        if (bestTarget.ownerId === playerFactionId) {
          // 评估对玩家的军事对比
          const military = evaluateMilitaryStrength(factionId, playerFactionId, state.territories);
          // 只有在军事优势时才攻击玩家
          if (military.ratio > 0.8 || personality.aggression > 0.7) {
            decisions.push({
              factionId,
              action: 'attack',
              targetId: bestTarget.id,
              reason: `进攻玩家领地 ${bestTarget.name}（军事对比: ${military.ratio.toFixed(2)}）`,
            });
            continue;
          }
        } else {
          // 攻击中立或其他AI势力
          decisions.push({
            factionId,
            action: 'attack',
            targetId: bestTarget.id,
            reason: `扩张领土：${bestTarget.name}`,
          });
          continue;
        }
      }
    }

    // 2. 防守决策
    // 如果势力较小，更倾向于防守
    if (territoryCount <= 2 || Math.random() > personality.aggression) {
      decisions.push({
        factionId,
        action: 'defend',
        reason: '巩固防守，积蓄力量',
      });
      continue;
    }

    // 3. 默认：随机行动
    if (borderTerritories.length > 0 && Math.random() > 0.5) {
      const target = borderTerritories[Math.floor(Math.random() * borderTerritories.length)];
      decisions.push({
        factionId,
        action: 'attack',
        targetId: target.id,
        reason: '随机扩张',
      });
    } else {
      decisions.push({
        factionId,
        action: 'defend',
        reason: '巩固防守',
      });
    }
  }

  return decisions;
}

// 应用AI决策
export function applyAIDecisions(
  state: GameState,
  decisions: AIDecision[],
  playerFactionId: string
): GameState {
  let newState = { ...state };

  for (const decision of decisions) {
    if (decision.action === 'attack' && decision.targetId) {
      const target = newState.territories.find((t) => t.id === decision.targetId);
      if (target && !target.ownerId) {
        // 征服中立领地
        newState.territories = newState.territories.map((t) =>
          t.id === decision.targetId ? { ...t, ownerId: decision.factionId } : t
        );
      }
    }
  }

  return newState;
}

// 初始化新游戏
export function initializeGame(): Partial<GameState> {
  return {
    turn: 1,
    year: -770,
    phase: 'early_zhou' as GamePhase,
    territories: [],
    armies: [],
    heroes: [],
    diplomaticRelations: [],
    gameLog: [],
  };
}

// 计算胜利条件
export function checkVictoryCondition(
  state: GameState,
  factionId: string
): { achieved: boolean; type?: 'domination' | 'diplomatic' | 'prestige'; message: string } {
  const controlledTerritories = state.territories.filter((t) => t.ownerId === factionId);
  const totalTerritories = state.territories.length;

  // 征服胜利
  if (controlledTerritories.length >= totalTerritories * 0.8) {
    return {
      achieved: true,
      type: 'domination',
      message: '恭喜！你统一了天下，建立了不朽的功业！',
    };
  }

  // 声望胜利
  // 这里需要计算总声望，暂时简化
  // if (totalPrestige >= 1000) {
  //   return { achieved: true, type: 'prestige', message: '你的威望传遍四海，天下归心！' };
  // }

  return {
    achieved: false,
    message: `已控制 ${controlledTerritories.length}/${totalTerritories} 领地，继续扩张你的势力吧！`,
  };
}

export default {
  calculateTerritoryResources,
  calculateFactionResources,
  processTurn,
  checkPhaseTransition,
  calculateYear,
  getPhaseName,
  getPhaseDescription,
  simulateAIFactions,
  applyAIDecisions,
  initializeGame,
  checkVictoryCondition,
};

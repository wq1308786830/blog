/**
 * 战斗系统
 * 处理战斗计算和逻辑
 */

import type {
  Army,
  Hero,
  Territory,
  Unit,
  UnitType,
} from '../../components/Game/types/gameTypes';
import { ArmyStatus } from '../../components/Game/types/gameTypes';

// 战斗配置
export interface BattleConfig {
  baseAttackPower: number;
  baseDefensePower: number;
  moraleBonusMultiplier: number;
  terrainBonus: Record<string, number>;
  weatherBonus: Record<string, number>;
  randomFactorRange: [number, number];
}

// 默认战斗配置
export const DEFAULT_BATTLE_CONFIG: BattleConfig = {
  baseAttackPower: 10,
  baseDefensePower: 8,
  moraleBonusMultiplier: 0.5,
  terrainBonus: {
    plain: 1,
    mountain: 1.3,
    river: 0.8,
    forest: 1.1,
    city: 1.5,
  },
  weatherBonus: {
    sunny: 1,
    rainy: 0.7,
    snowy: 0.6,
    foggy: 0.8,
  },
  randomFactorRange: [0.85, 1.15],
};

// 单位属性
export interface UnitStats {
  attack: number;
  defense: number;
  speed: number;
  cost: { gold: number; population: number };
}

// 单位属性配置
export const UNIT_STATS: Record<UnitType, UnitStats> = {
  infantry: {
    attack: 10,
    defense: 15,
    speed: 5,
    cost: { gold: 10, population: 1 },
  },
  cavalry: {
    attack: 20,
    defense: 8,
    speed: 10,
    cost: { gold: 30, population: 1 },
  },
  archer: {
    attack: 15,
    defense: 5,
    speed: 6,
    cost: { gold: 15, population: 1 },
  },
  chariot: {
    attack: 25,
    defense: 12,
    speed: 8,
    cost: { gold: 50, population: 2 },
  },
  siege: {
    attack: 30,
    defense: 5,
    speed: 2,
    cost: { gold: 80, population: 3 },
  },
};

// 兵种克制关系
export const UNIT_ADVANTAGE: Record<UnitType, Partial<Record<UnitType, number>>> = {
  infantry: {
    cavalry: 1.2,
    siege: 1.3,
  },
  cavalry: {
    archer: 1.5,
    infantry: 0.9,
  },
  archer: {
    infantry: 1.3,
    chariot: 1.2,
  },
  chariot: {
    cavalry: 1.2,
    archer: 0.9,
  },
  siege: {
    chariot: 1.4,
    cavalry: 0.7,
  },
};

// 计算军队战斗力
export function calculateArmyPower(
  army: Army,
  commander?: Hero,
  isAttacking: boolean = true,
  config: BattleConfig = DEFAULT_BATTLE_CONFIG
): number {
  let basePower = 0;

  // 计算基础战斗力
  for (const unit of army.units) {
    const stats = UNIT_STATS[unit.type];
    if (!stats) continue;

    const unitPower = isAttacking
      ? stats.attack * unit.count
      : stats.defense * unit.count;
    basePower += unitPower;
  }

  // 士气加成
  const moraleBonus = 1 + (army.morale / 100) * config.moraleBonusMultiplier;

  // 统帅加成
  let commanderBonus = 1;
  if (commander) {
    const leadershipBonus = commander.stats.leadership / 100;
    const warBonus = commander.stats.war / 200;
    commanderBonus = 1 + leadershipBonus + warBonus;
  }

  return Math.floor(basePower * moraleBonus * commanderBonus);
}

// 战斗结果
export interface BattleResult {
  winner: 'attacker' | 'defender';
  attackerLosses: number;
  defenderLosses: number;
  attackerMoraleChange: number;
  defenderMoraleChange: number;
  rounds: number;
  details: string[];
}

// 执行战斗
export function executeBattle(
  attacker: Army,
  defender: Army,
  attackerCommander?: Hero,
  defenderCommander?: Hero,
  terrain: string = 'plain',
  weather: string = 'sunny',
  config: BattleConfig = DEFAULT_BATTLE_CONFIG
): BattleResult {
  const details: string[] = [];

  // 计算初始战斗力
  let attackerPower = calculateArmyPower(attacker, attackerCommander, true, config);
  let defenderPower = calculateArmyPower(defender, defenderCommander, false, config);

  // 地形加成
  const terrainMultiplier = config.terrainBonus[terrain] || 1;
  defenderPower *= terrainMultiplier;

  // 天气加成
  const weatherMultiplier = config.weatherBonus[weather] || 1;
  attackerPower *= weatherMultiplier;
  defenderPower *= weatherMultiplier;

  // 兵种克制
  for (const attUnit of attacker.units) {
    for (const defUnit of defender.units) {
      const advantage = UNIT_ADVANTAGE[attUnit.type]?.[defUnit.type];
      if (advantage) {
        attackerPower *= (1 + (advantage - 1) * 0.1);
        if (advantage > 1) {
          details.push(`${attUnit.type} 克制 ${defUnit.type}`);
        }
      }
    }
  }

  details.push(`进攻方战力: ${Math.floor(attackerPower)}`);
  details.push(`防守方战力: ${Math.floor(defenderPower)}`);

  // 模拟战斗回合
  let attackerTroops = attacker.totalSoldiers;
  let defenderTroops = defender.totalSoldiers;
  let rounds = 0;
  const maxRounds = 10;

  while (attackerTroops > 0 && defenderTroops > 0 && rounds < maxRounds) {
    rounds++;

    // 随机因子
    const attackerRandom =
      config.randomFactorRange[0] +
      Math.random() * (config.randomFactorRange[1] - config.randomFactorRange[0]);
    const defenderRandom =
      config.randomFactorRange[0] +
      Math.random() * (config.randomFactorRange[1] - config.randomFactorRange[0]);

    // 计算伤害
    const attackerDamage = Math.floor(
      (attackerPower / defenderPower) * defenderTroops * 0.1 * attackerRandom
    );
    const defenderDamage = Math.floor(
      (defenderPower / attackerPower) * attackerTroops * 0.1 * defenderRandom
    );

    defenderTroops = Math.max(0, defenderTroops - attackerDamage);
    attackerTroops = Math.max(0, attackerTroops - defenderDamage);

    details.push(`第 ${rounds} 回合: 攻方损失 ${defenderDamage}, 守方损失 ${attackerDamage}`);
  }

  // 判断胜负
  const attackerWins = attackerTroops > defenderTroops;
  const winner: 'attacker' | 'defender' = attackerWins ? 'attacker' : 'defender';

  // 计算损失
  const attackerLosses = attacker.totalSoldiers - attackerTroops;
  const defenderLosses = defender.totalSoldiers - defenderTroops;

  // 士气变化
  const attackerMoraleChange = attackerWins ? 10 : -15;
  const defenderMoraleChange = attackerWins ? -20 : 10;

  details.push(`战斗结束! ${attackerWins ? '进攻方' : '防守方'}获胜`);

  return {
    winner,
    attackerLosses,
    defenderLosses,
    attackerMoraleChange,
    defenderMoraleChange,
    rounds,
    details,
  };
}

// 围城战斗
export interface SiegeResult extends BattleResult {
  wallDamage: number;
  siegeProgress: number;
}

export function executeSiege(
  attacker: Army,
  defender: Army,
  wallStrength: number,
  attackerCommander?: Hero,
  defenderCommander?: Hero,
  config: BattleConfig = DEFAULT_BATTLE_CONFIG
): SiegeResult {
  const baseResult = executeBattle(
    attacker,
    defender,
    attackerCommander,
    defenderCommander,
    'city',
    'sunny',
    config
  );

  // 攻城器械加成
  let siegeBonus = 0;
  for (const unit of attacker.units) {
    if (unit.type === 'siege') {
      siegeBonus += unit.count * 0.1;
    }
  }

  // 城墙损伤
  const wallDamage = Math.min(
    wallStrength,
    Math.floor(
      (baseResult.winner === 'attacker' ? 20 : 5) * (1 + siegeBonus)
    )
  );

  const siegeProgress = wallDamage / wallStrength;

  return {
    ...baseResult,
    wallDamage,
    siegeProgress,
  };
}

// 应用战斗结果到军队
export function applyBattleResultToArmy(
  army: Army,
  losses: number,
  moraleChange: number
): Army {
  const lossRatio = (army.totalSoldiers - losses) / army.totalSoldiers;

  return {
    ...army,
    totalSoldiers: Math.max(0, army.totalSoldiers - losses),
    units: army.units.map((unit) => ({
      ...unit,
      count: Math.floor(unit.count * lossRatio),
    })),
    morale: Math.max(0, Math.min(100, army.morale + moraleChange)),
  };
}

// 创建新军队
export function createArmy(
  name: string,
  factionId: string,
  territoryId: string,
  units: Unit[]
): Army {
  const totalSoldiers = units.reduce((sum, u) => sum + u.count, 0);

  return {
    id: `army-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    factionId,
    units,
    totalSoldiers,
    morale: 100,
    status: ArmyStatus.IDLE,
    currentTerritoryId: territoryId,
    heroIds: [],
    movementPoints: 100,
    combatPower: 0,
  };
}

// 招募单位
export function recruitUnits(
  existingUnits: Unit[],
  unitType: UnitType,
  count: number
): Unit[] {
  const existingUnit = existingUnits.find((u) => u.type === unitType);

  if (existingUnit) {
    return existingUnits.map((u) =>
      u.type === unitType
        ? { ...u, count: u.count + count }
        : u
    );
  }

  return [
    ...existingUnits,
    {
      id: `unit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: unitType,
      count,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'sword', armor: 'light', quality: 50 },
    },
  ];
}

// 计算行军时间
export function calculateMarchTime(
  fromTerritory: Territory,
  toTerritory: Territory,
  army: Army
): number {
  const distance = Math.sqrt(
    Math.pow(toTerritory.position.x - fromTerritory.position.x, 2) +
      Math.pow(toTerritory.position.y - fromTerritory.position.y, 2)
  );

  // 计算平均速度
  let totalSpeed = 0;
  let unitCount = 0;
  for (const unit of army.units) {
    const stats = UNIT_STATS[unit.type];
    if (stats) {
      totalSpeed += stats.speed * unit.count;
      unitCount += unit.count;
    }
  }

  const averageSpeed = unitCount > 0 ? totalSpeed / unitCount : 5;

  // 基础时间 + 距离/速度
  return Math.max(1, Math.floor(distance / averageSpeed));
}

export default {
  calculateArmyPower,
  executeBattle,
  executeSiege,
  applyBattleResultToArmy,
  createArmy,
  recruitUnits,
  calculateMarchTime,
  UNIT_STATS,
  UNIT_ADVANTAGE,
};

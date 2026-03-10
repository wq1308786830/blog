/**
 * 初始军队数据
 * 为每个势力创建初始军队
 */

import type { Army, Unit } from '../types/gameTypes';
import { ArmyStatus, UnitType } from '../types/gameTypes';
import { createArmy } from '../../../services/game/battleSystem';

// 势力初始军队配置
interface FactionArmyConfig {
  factionId: string;
  armyName: string;
  territoryId: string;
  units: {
    infantry: number;
    cavalry: number;
    archer: number;
    chariot: number;
    siege: number;
  };
}

// 各势力初始军队配置
export const FACTION_ARMY_CONFIGS: FactionArmyConfig[] = [
  // 秦国 - 军事强国，骑兵和战车较多
  {
    factionId: 'faction-qin',
    armyName: '秦军锐士',
    territoryId: 'qin-yong',
    units: { infantry: 150, cavalry: 50, archer: 80, chariot: 30, siege: 10 },
  },
  // 齐国 - 富庶国家，军队装备精良
  {
    factionId: 'faction-qi',
    armyName: '齐军技击',
    territoryId: 'qi-linzi',
    units: { infantry: 120, cavalry: 40, archer: 100, chariot: 25, siege: 15 },
  },
  // 楚国 - 地广人多，兵力充沛
  {
    factionId: 'faction-chu',
    armyName: '楚军',
    territoryId: 'chu-ying',
    units: { infantry: 200, cavalry: 30, archer: 60, chariot: 20, siege: 5 },
  },
  // 赵国 - 胡服骑射，骑兵强大
  {
    factionId: 'faction-zhao',
    armyName: '赵军边骑',
    territoryId: 'zhao-jinyang',
    units: { infantry: 100, cavalry: 80, archer: 70, chariot: 15, siege: 10 },
  },
  // 魏国 - 魏武卒，精锐步兵
  {
    factionId: 'faction-wei',
    armyName: '魏武卒',
    territoryId: 'wei-anyi',
    units: { infantry: 180, cavalry: 30, archer: 50, chariot: 20, siege: 10 },
  },
  // 韩国 - 强弓劲弩，弓兵优势
  {
    factionId: 'faction-han',
    armyName: '韩军劲弩',
    territoryId: 'han-xinzheng',
    units: { infantry: 80, cavalry: 20, archer: 120, chariot: 10, siege: 5 },
  },
  // 燕国 - 北方边境，防御为主
  {
    factionId: 'faction-yan',
    armyName: '燕军',
    territoryId: 'yan-ji',
    units: { infantry: 100, cavalry: 40, archer: 60, chariot: 10, siege: 5 },
  },
  // 晋国 - 春秋霸主
  {
    factionId: 'faction-jin',
    armyName: '晋军',
    territoryId: 'jin-jiang',
    units: { infantry: 150, cavalry: 50, archer: 80, chariot: 30, siege: 10 },
  },
  // 周王室 - 名义共主
  {
    factionId: 'faction-zhou',
    armyName: '王室禁卫',
    territoryId: 'zhou-luoyi',
    units: { infantry: 60, cavalry: 20, archer: 30, chariot: 10, siege: 0 },
  },
  // 宋国
  {
    factionId: 'faction-song',
    armyName: '宋军',
    territoryId: 'song-shangqiu',
    units: { infantry: 80, cavalry: 20, archer: 40, chariot: 15, siege: 5 },
  },
  // 鲁国
  {
    factionId: 'faction-lu',
    armyName: '鲁军',
    territoryId: 'lu-qufu',
    units: { infantry: 60, cavalry: 10, archer: 50, chariot: 10, siege: 0 },
  },
  // 吴国
  {
    factionId: 'faction-wu',
    armyName: '吴军',
    territoryId: 'wu-suzhou',
    units: { infantry: 80, cavalry: 20, archer: 60, chariot: 10, siege: 5 },
  },
  // 越国
  {
    factionId: 'faction-yue',
    armyName: '越军',
    territoryId: 'yue-kuaiji',
    units: { infantry: 70, cavalry: 10, archer: 80, chariot: 5, siege: 0 },
  },
  // 巴国
  {
    factionId: 'faction-ba',
    armyName: '巴军',
    territoryId: 'ba-jiangzhou',
    units: { infantry: 60, cavalry: 20, archer: 30, chariot: 5, siege: 0 },
  },
  // 蜀国
  {
    factionId: 'faction-shu',
    armyName: '蜀军',
    territoryId: 'shu-chengdu',
    units: { infantry: 70, cavalry: 15, archer: 40, chariot: 5, siege: 0 },
  },
];

// 创建初始单位列表
function createUnits(config: FactionArmyConfig['units']): Unit[] {
  const units: Unit[] = [];
  let unitIndex = 0;

  if (config.infantry > 0) {
    units.push({
      id: `unit-infantry-${unitIndex++}`,
      type: UnitType.INFANTRY,
      count: config.infantry,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'sword', armor: 'light', quality: 50 },
    });
  }

  if (config.cavalry > 0) {
    units.push({
      id: `unit-cavalry-${unitIndex++}`,
      type: UnitType.CAVALRY,
      count: config.cavalry,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'spear', armor: 'medium', quality: 50 },
    });
  }

  if (config.archer > 0) {
    units.push({
      id: `unit-archer-${unitIndex++}`,
      type: UnitType.ARCHER,
      count: config.archer,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'bow', armor: 'light', quality: 50 },
    });
  }

  if (config.chariot > 0) {
    units.push({
      id: `unit-chariot-${unitIndex++}`,
      type: UnitType.CHARIOT,
      count: config.chariot,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'halberd', armor: 'heavy', quality: 60 },
    });
  }

  if (config.siege > 0) {
    units.push({
      id: `unit-siege-${unitIndex++}`,
      type: UnitType.SIEGE,
      count: config.siege,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'catapult', armor: 'none', quality: 40 },
    });
  }

  return units;
}

// 创建势力初始军队
export function createFactionArmy(config: FactionArmyConfig): Army {
  const units = createUnits(config.units);
  return createArmy(
    config.armyName,
    config.factionId,
    config.territoryId,
    units
  );
}

// 生成所有势力的初始军队
export function createInitialArmies(): Army[] {
  return FACTION_ARMY_CONFIGS.map(createFactionArmy);
}

// 根据势力ID获取初始军队
export function getInitialArmyByFaction(factionId: string): Army | undefined {
  const config = FACTION_ARMY_CONFIGS.find((c) => c.factionId === factionId);
  if (!config) return undefined;
  return createFactionArmy(config);
}

// 创建临时军队用于战斗（用于没有预设军队的势力）
export function createTemporaryArmy(
  factionId: string,
  territoryId: string,
  soldierCount: number = 100
): Army {
  const infantryCount = Math.floor(soldierCount * 0.5);
  const archerCount = Math.floor(soldierCount * 0.3);
  const cavalryCount = Math.floor(soldierCount * 0.2);

  const units: Unit[] = [
    {
      id: 'temp-infantry-0',
      type: UnitType.INFANTRY,
      count: infantryCount,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'sword', armor: 'light', quality: 40 },
    },
    {
      id: 'temp-archer-0',
      type: UnitType.ARCHER,
      count: archerCount,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'bow', armor: 'light', quality: 40 },
    },
    {
      id: 'temp-cavalry-0',
      type: UnitType.CAVALRY,
      count: cavalryCount,
      experience: 0,
      morale: 100,
      equipment: { weapon: 'spear', armor: 'medium', quality: 40 },
    },
  ];

  return createArmy(`${factionId}临时军`, factionId, territoryId, units);
}

// 势力军队数量估算（用于AI决策）
export function estimateFactionMilitaryStrength(
  factionId: string,
  territories: { ownerId: string; defenses: number; population: number }[]
): number {
  const factionTerritories = territories.filter((t) => t.ownerId === factionId);
  if (factionTerritories.length === 0) return 0;

  // 基于领地数量和防御计算军事力量
  const baseStrength = factionTerritories.length * 100;
  const defenseBonus = factionTerritories.reduce((sum, t) => sum + t.defenses * 10, 0);
  const populationBonus = factionTerritories.reduce((sum, t) => sum + t.population * 0.001, 0);

  return Math.floor(baseStrength + defenseBonus + populationBonus);
}

export default {
  FACTION_ARMY_CONFIGS,
  createInitialArmies,
  createFactionArmy,
  getInitialArmyByFaction,
  createTemporaryArmy,
  estimateFactionMilitaryStrength,
};
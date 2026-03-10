/**
 * 外交系统
 * 处理势力间的外交关系
 */

import type {
  DiplomaticRelation,
  DiplomaticStatus,
  Faction,
} from '../../components/Game/types/gameTypes';

// 外交行动类型
export type DiplomaticAction =
  | 'propose_alliance'
  | 'break_alliance'
  | 'declare_war'
  | 'sue_for_peace'
  | 'demand_tribute'
  | 'offer_tribute'
  | 'propose_trade'
  | 'cancel_trade'
  | 'insult'
  | 'compliment';

// 外交行动配置
interface DiplomaticActionConfig {
  minRelation: number;
  maxRelation: number;
  prestigeCost: number;
  goldCost: number;
  relationChange: number;
  description: string;
}

// 外交行动配置表
export const DIPLOMATIC_ACTIONS: Record<DiplomaticAction, DiplomaticActionConfig> = {
  propose_alliance: {
    minRelation: 50,
    maxRelation: 100,
    prestigeCost: 50,
    goldCost: 100,
    relationChange: 10,
    description: '提议结盟，共同对抗敌人',
  },
  break_alliance: {
    minRelation: -100,
    maxRelation: 100,
    prestigeCost: -30,
    goldCost: 0,
    relationChange: -50,
    description: '背弃盟约，关系将大幅恶化',
  },
  declare_war: {
    minRelation: -100,
    maxRelation: 50,
    prestigeCost: -20,
    goldCost: 50,
    relationChange: -80,
    description: '正式宣战，开始军事行动',
  },
  sue_for_peace: {
    minRelation: -100,
    maxRelation: 0,
    prestigeCost: -40,
    goldCost: 200,
    relationChange: 20,
    description: '请求停战，需要支付赔款',
  },
  demand_tribute: {
    minRelation: -50,
    maxRelation: 100,
    prestigeCost: 20,
    goldCost: 0,
    relationChange: -30,
    description: '要求对方进贡',
  },
  offer_tribute: {
    minRelation: -100,
    maxRelation: 50,
    prestigeCost: 10,
    goldCost: 150,
    relationChange: 25,
    description: '向对方进贡，改善关系',
  },
  propose_trade: {
    minRelation: 0,
    maxRelation: 100,
    prestigeCost: 10,
    goldCost: 50,
    relationChange: 5,
    description: '提议建立贸易关系',
  },
  cancel_trade: {
    minRelation: -100,
    maxRelation: 100,
    prestigeCost: -10,
    goldCost: 0,
    relationChange: -15,
    description: '取消贸易协定',
  },
  insult: {
    minRelation: -100,
    maxRelation: 100,
    prestigeCost: 5,
    goldCost: 0,
    relationChange: -25,
    description: '侮辱对方领袖',
  },
  compliment: {
    minRelation: -100,
    maxRelation: 100,
    prestigeCost: 5,
    goldCost: 20,
    relationChange: 10,
    description: '称赞对方领袖',
  },
};

// 获取初始外交关系
export function getInitialDiplomaticStatus(
  factionA: string,
  factionB: string
): DiplomaticStatus {
  // 预设的历史敌对关系
  const historicalRivals: Record<string, string[]> = {
    'faction-qin': ['faction-zhao', 'faction-chu', 'faction-wei'],
    'faction-zhao': ['faction-qin'],
    'faction-chu': ['faction-qin'],
    'faction-wei': ['faction-qin', 'faction-han'],
    'faction-han': ['faction-wei'],
  };

  const rivalsA = historicalRivals[factionA] || [];
  const rivalsB = historicalRivals[factionB] || [];

  if (rivalsA.includes(factionB) || rivalsB.includes(factionA)) {
    return 'hostile';
  }

  return 'neutral';
}

// 创建外交关系
export function createDiplomaticRelation(
  factionA: string,
  factionB: string,
  initialStatus?: DiplomaticStatus
): DiplomaticRelation {
  const status = initialStatus || getInitialDiplomaticStatus(factionA, factionB);

  const baseRelation: Record<DiplomaticStatus, number> = {
    allied: 80,
    friendly: 40,
    neutral: 0,
    hostile: -40,
  };

  return {
    id: `relation-${factionA}-${factionB}-${Date.now()}`,
    factionA,
    factionB,
    status,
    relationValue: baseRelation[status],
    startDate: Date.now(),
    tradeAgreement: false,
    nonAggressionPact: status === 'allied',
    warStartDate: status === 'hostile' ? Date.now() : undefined,
  };
}

// 检查是否可以执行外交行动
export function canExecuteDiplomaticAction(
  relation: DiplomaticRelation,
  action: DiplomaticAction,
  availablePrestige: number,
  availableGold: number
): { canExecute: boolean; reason?: string } {
  const config = DIPLOMATIC_ACTIONS[action];

  if (config.prestigeCost > 0 && availablePrestige < config.prestigeCost) {
    return { canExecute: false, reason: '声望不足' };
  }

  if (config.goldCost > 0 && availableGold < config.goldCost) {
    return { canExecute: false, reason: '金钱不足' };
  }

  if (relation.relationValue < config.minRelation) {
    return { canExecute: false, reason: '关系值过低' };
  }

  if (relation.relationValue > config.maxRelation) {
    return { canExecute: false, reason: '关系值过高' };
  }

  // 特定行动的限制
  if (action === 'break_alliance' && relation.status !== 'allied') {
    return { canExecute: false, reason: '没有结盟关系' };
  }

  if (action === 'declare_war' && relation.status === 'allied') {
    return { canExecute: false, reason: '不能向盟友宣战' };
  }

  if (action === 'sue_for_peace' && relation.status !== 'hostile') {
    return { canExecute: false, reason: '当前不在战争状态' };
  }

  return { canExecute: true };
}

// 执行外交行动
export function executeDiplomaticAction(
  relation: DiplomaticRelation,
  action: DiplomaticAction,
  initiator: string
): {
  newRelation: DiplomaticRelation;
  success: boolean;
  message: string;
} {
  const config = DIPLOMATIC_ACTIONS[action];
  let newRelation = { ...relation };
  let success = true;
  let message = '';

  // 更新关系值
  newRelation.relationValue = Math.max(
    -100,
    Math.min(100, relation.relationValue + config.relationChange)
  );

  switch (action) {
    case 'propose_alliance':
      if (newRelation.relationValue >= 60) {
        newRelation.status = 'allied';
        newRelation.nonAggressionPact = true;
        message = '结盟提议被接受！';
      } else {
        success = false;
        message = '结盟提议被拒绝';
      }
      break;

    case 'break_alliance':
      newRelation.status = 'neutral';
      newRelation.nonAggressionPact = false;
      message = '盟约已解除';
      break;

    case 'declare_war':
      newRelation.status = 'hostile';
      newRelation.warStartDate = Date.now();
      newRelation.nonAggressionPact = false;
      message = '战争宣言已发布';
      break;

    case 'sue_for_peace':
      if (newRelation.relationValue >= -20 || Math.random() > 0.5) {
        newRelation.status = 'neutral';
        newRelation.warStartDate = undefined;
        message = '停战协议已达成';
      } else {
        success = false;
        message = '停战请求被拒绝';
      }
      break;

    case 'propose_trade':
      newRelation.tradeAgreement = true;
      message = '贸易协定已建立';
      break;

    case 'cancel_trade':
      newRelation.tradeAgreement = false;
      message = '贸易协定已取消';
      break;

    default:
      message = config.description;
  }

  return { newRelation, success, message };
}

// 获取关系描述
export function getRelationDescription(value: number): string {
  if (value >= 80) return '亲密无间';
  if (value >= 60) return '友好';
  if (value >= 40) return '和善';
  if (value >= 10) return '中立偏善';
  if (value >= -10) return '中立';
  if (value >= -40) return '中立偏恶';
  if (value >= -60) return '敌对';
  if (value >= -80) return '仇恨';
  return '死敌';
}

// 获取关系颜色
export function getRelationColor(value: number): string {
  if (value >= 60) return '#00ff66';
  if (value >= 20) return '#99ff99';
  if (value >= -20) return '#cccccc';
  if (value >= -60) return '#ff9999';
  return '#ff0000';
}

// 查找外交关系
export function findDiplomaticRelation(
  relations: DiplomaticRelation[],
  factionA: string,
  factionB: string
): DiplomaticRelation | undefined {
  return relations.find(
    (r) =>
      (r.factionA === factionA && r.factionB === factionB) ||
      (r.factionA === factionB && r.factionB === factionA)
  );
}

// 获取贸易收益
export function calculateTradeIncome(
  relation: DiplomaticRelation,
  factionTerritoryCount: number
): number {
  if (!relation.tradeAgreement || relation.status === 'hostile') {
    return 0;
  }

  const baseIncome = 10;
  const relationBonus = Math.max(0, relation.relationValue / 10);
  const sizeBonus = factionTerritoryCount * 2;

  return Math.floor(baseIncome + relationBonus + sizeBonus);
}

// AI 外交决策
export interface AIDiplomaticDecision {
  action: DiplomaticAction;
  targetFactionId: string;
  reason: string;
}

export function simulateAIDiplomacy(
  factionId: string,
  relations: DiplomaticRelation[],
  factionPower: number,
  otherFactions: { id: string; power: number }[]
): AIDiplomaticDecision[] {
  const decisions: AIDiplomaticDecision[] = [];

  for (const other of otherFactions) {
    const relation = findDiplomaticRelation(relations, factionId, other.id);
    if (!relation) continue;

    // 简单的AI逻辑
    if (relation.status === 'hostile') {
      // 如果比对方强很多，继续战争
      if (factionPower > other.power * 1.5) {
        continue;
      }
      // 否则求和
      if (factionPower < other.power && Math.random() > 0.7) {
        decisions.push({
          action: 'sue_for_peace',
          targetFactionId: other.id,
          reason: '实力不足，寻求和平',
        });
      }
    } else if (relation.status === 'neutral') {
      // 如果关系好且对方强，提议结盟
      if (relation.relationValue > 40 && other.power > factionPower && Math.random() > 0.8) {
        decisions.push({
          action: 'propose_alliance',
          targetFactionId: other.id,
          reason: '联合对抗强敌',
        });
      }
      // 如果比对方强很多且关系差，宣战
      else if (
        factionPower > other.power * 2 &&
        relation.relationValue < -20 &&
        Math.random() > 0.7
      ) {
        decisions.push({
          action: 'declare_war',
          targetFactionId: other.id,
          reason: '趁虚而入',
        });
      }
    }
  }

  return decisions;
}

export default {
  getInitialDiplomaticStatus,
  createDiplomaticRelation,
  canExecuteDiplomaticAction,
  executeDiplomaticAction,
  getRelationDescription,
  getRelationColor,
  findDiplomaticRelation,
  calculateTradeIncome,
  simulateAIDiplomacy,
  DIPLOMATIC_ACTIONS,
};

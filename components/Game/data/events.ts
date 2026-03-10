/**
 * 历史事件数据
 * 春秋战国重大历史事件
 */

import { GamePhase } from '../types/gameTypes';

// 事件类型
export type EventType =
  | 'political'    // 政治事件
  | 'military'     // 军事事件
  | 'economic'     // 经济事件
  | 'diplomatic'   // 外交事件
  | 'natural'      // 自然灾害
  | 'hero'         // 武将事件
  | 'historic';    // 固定历史事件

// 事件影响
export interface EventEffect {
  type: 'resources' | 'prestige' | 'territory' | 'hero' | 'relation' | 'phase';
  target: string;
  value: number;
  duration?: number;  // 持续回合数，-1表示永久
}

// 事件选择
export interface EventChoice {
  id: string;
  text: string;
  description: string;
  requirements?: {
    resources?: Record<string, number>;
    prestige?: number;
    territories?: number;
  };
  effects: EventEffect[];
  nextEventId?: string;  // 连锁事件
}

// 历史事件
export interface HistoricEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  phase: GamePhase[];  // 可发生的阶段
  triggerYear?: number; // 特定年份触发
  triggerTurn?: number; // 特定回合触发
  probability: number;  // 触发概率 0-1
  requirements?: {
    minTerritories?: number;
    minPrestige?: number;
    maxTurn?: number;
    factions?: string[];  // 特定势力才能触发
  };
  choices: EventChoice[];
  isRepeatable: boolean;
  isHistoric: boolean;  // 是否真实历史事件
}

// 春秋战国时期重大历史事件
export const HISTORIC_EVENTS: HistoricEvent[] = [
  // ==================== 周朝后期 ====================
  {
    id: 'event-zhou-declining',
    title: '周室衰微',
    description: '周王室日渐衰微，诸侯开始不再朝贡。天下大乱将至，你需要尽快建立自己的势力。',
    type: 'political',
    phase: [GamePhase.EARLY_ZHOU],
    triggerTurn: 1,
    probability: 1,
    choices: [
      {
        id: 'choice-1',
        text: '趁机扩张',
        description: '周室无力约束，正是扩张的好时机',
        effects: [
          { type: 'prestige', target: 'self', value: 20 },
          { type: 'resources', target: 'gold', value: 100 },
        ],
      },
      {
        id: 'choice-2',
        text: '勤王护驾',
        description: '表示忠诚，获取周室名义上的支持',
        effects: [
          { type: 'prestige', target: 'self', value: 50 },
          { type: 'resources', target: 'gold', value: -50 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },

  // ==================== 春秋时期 ====================
  {
    id: 'event-hegemony-race',
    title: '霸主之争',
    description: '齐桓公提出"尊王攘夷"，诸侯争霸的时代正式开启。你是否也要争夺霸主之位？',
    type: 'political',
    phase: [GamePhase.SPRING_AUTUMN],
    triggerYear: -679,
    probability: 1,
    choices: [
      {
        id: 'choice-1',
        text: '参与争霸',
        description: '挑战霸主地位，扩大影响力',
        effects: [
          { type: 'prestige', target: 'self', value: 100 },
          { type: 'resources', target: 'gold', value: -200 },
        ],
      },
      {
        id: 'choice-2',
        text: '韬光养晦',
        description: '暂时隐忍，积蓄实力',
        effects: [
          { type: 'resources', target: 'food', value: 500 },
          { type: 'resources', target: 'gold', value: 200 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },
  {
    id: 'event-spring-autumn-war',
    title: '城濮之战',
    description: '晋楚两国即将在城濮展开决战！你可以选择支持一方，或者保持中立。',
    type: 'military',
    phase: [GamePhase.SPRING_AUTUMN],
    triggerYear: -632,
    probability: 0.8,
    choices: [
      {
        id: 'choice-1',
        text: '支持晋国',
        description: '晋文公重耳是贤明君主',
        effects: [
          { type: 'relation', target: 'faction-jin', value: 30 },
          { type: 'relation', target: 'faction-chu', value: -20 },
        ],
      },
      {
        id: 'choice-2',
        text: '支持楚国',
        description: '楚国地大物博，实力强大',
        effects: [
          { type: 'relation', target: 'faction-chu', value: 30 },
          { type: 'relation', target: 'faction-jin', value: -20 },
        ],
      },
      {
        id: 'choice-3',
        text: '保持中立',
        description: '两不相帮，专注自身发展',
        effects: [
          { type: 'resources', target: 'gold', value: 100 },
          { type: 'prestige', target: 'self', value: -10 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },
  {
    id: 'event-guan-zhong',
    title: '管仲拜相',
    description: '管仲被齐桓公重用，提出"富国强兵"之策。你可以效仿此法发展势力。',
    type: 'hero',
    phase: [GamePhase.SPRING_AUTUMN],
    triggerYear: -685,
    probability: 0.7,
    choices: [
      {
        id: 'choice-1',
        text: '学习变法',
        description: '推行改革，提升经济',
        effects: [
          { type: 'resources', target: 'gold', value: 300, duration: 5 },
          { type: 'prestige', target: 'self', value: 30 },
        ],
      },
      {
        id: 'choice-2',
        text: '招揽人才',
        description: '效仿鲍叔牙举荐贤才',
        effects: [
          { type: 'prestige', target: 'self', value: 50 },
          { type: 'resources', target: 'population', value: 200 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },

  // ==================== 战国时期 ====================
  {
    id: 'event-warring-states-begin',
    title: '战国七雄',
    description: '三家分晋，战国时代正式开启。韩赵魏三家崛起，天下格局剧变！',
    type: 'political',
    phase: [GamePhase.WARRING_STATES],
    triggerYear: -475,
    probability: 1,
    choices: [
      {
        id: 'choice-1',
        text: '联合抗秦',
        description: '与其他六国结盟对抗强秦',
        effects: [
          { type: 'relation', target: 'all', value: 20 },
          { type: 'prestige', target: 'self', value: 50 },
        ],
      },
      {
        id: 'choice-2',
        text: '独立发展',
        description: '不参与合纵连横，专注内政',
        effects: [
          { type: 'resources', target: 'gold', value: 500 },
          { type: 'resources', target: 'food', value: 500 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },
  {
    id: 'event-shangyang-reform',
    title: '商鞅变法',
    description: '秦国推行商鞅变法，国力大增。你也可以选择是否进行变法图强。',
    type: 'political',
    phase: [GamePhase.WARRING_STATES],
    triggerYear: -356,
    probability: 0.9,
    choices: [
      {
        id: 'choice-1',
        text: '激进变法',
        description: '彻底改革，但可能遇到阻力',
        effects: [
          { type: 'resources', target: 'gold', value: 500, duration: 10 },
          { type: 'resources', target: 'population', value: 300 },
          { type: 'prestige', target: 'self', value: -20 },
        ],
      },
      {
        id: 'choice-2',
        text: '渐进改革',
        description: '稳步推行，风险较小',
        effects: [
          { type: 'resources', target: 'gold', value: 200, duration: 10 },
          { type: 'prestige', target: 'self', value: 10 },
        ],
      },
      {
        id: 'choice-3',
        text: '维持现状',
        description: '不变应万变',
        effects: [
          { type: 'prestige', target: 'self', value: -10 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },
  {
    id: 'event-changping',
    title: '长平之战',
    description: '秦赵两国在长平展开生死决战。赵括代替廉颇为将，战局扑朔迷离。',
    type: 'military',
    phase: [GamePhase.WARRING_STATES],
    triggerYear: -260,
    probability: 0.9,
    choices: [
      {
        id: 'choice-1',
        text: '支援赵国',
        description: '赵国若亡，下一个就是我们',
        effects: [
          { type: 'relation', target: 'faction-zhao', value: 40 },
          { type: 'relation', target: 'faction-qin', value: -30 },
          { type: 'resources', target: 'gold', value: -300 },
        ],
      },
      {
        id: 'choice-2',
        text: '趁机攻秦',
        description: '秦军主力在长平，后方空虚',
        effects: [
          { type: 'territory', target: 'qin', value: 1 },
          { type: 'relation', target: 'faction-qin', value: -50 },
          { type: 'resources', target: 'gold', value: -200 },
        ],
      },
      {
        id: 'choice-3',
        text: '按兵不动',
        description: '静观其变，保存实力',
        effects: [
          { type: 'resources', target: 'gold', value: 200 },
          { type: 'prestige', target: 'self', value: -20 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },
  {
    id: 'event-vertical-horizontal',
    title: '合纵连横',
    description: '苏秦倡导合纵，张仪推行连横。你选择加入哪一阵营？',
    type: 'diplomatic',
    phase: [GamePhase.WARRING_STATES],
    triggerYear: -300,
    probability: 0.8,
    choices: [
      {
        id: 'choice-1',
        text: '加入合纵',
        description: '联合六国抗秦',
        effects: [
          { type: 'relation', target: 'all-except-qin', value: 30 },
          { type: 'relation', target: 'faction-qin', value: -40 },
          { type: 'prestige', target: 'self', value: 40 },
        ],
      },
      {
        id: 'choice-2',
        text: '加入连横',
        description: '与强秦结盟',
        effects: [
          { type: 'relation', target: 'faction-qin', value: 40 },
          { type: 'relation', target: 'all-except-qin', value: -20 },
          { type: 'prestige', target: 'self', value: -20 },
        ],
      },
      {
        id: 'choice-3',
        text: '保持中立',
        description: '左右逢源，两边讨好',
        effects: [
          { type: 'resources', target: 'gold', value: 300 },
          { type: 'prestige', target: 'self', value: -30 },
        ],
      },
    ],
    isRepeatable: false,
    isHistoric: true,
  },

  // ==================== 随机事件 ====================
  {
    id: 'event-harvest',
    title: '丰收之年',
    description: '今年风调雨顺，粮食产量大增！',
    type: 'economic',
    phase: [GamePhase.EARLY_ZHOU, GamePhase.SPRING_AUTUMN, GamePhase.WARRING_STATES],
    probability: 0.3,
    choices: [
      {
        id: 'choice-1',
        text: '储备粮食',
        description: '为战争做准备',
        effects: [
          { type: 'resources', target: 'food', value: 1000 },
        ],
      },
      {
        id: 'choice-2',
        text: '出售获利',
        description: '换取金钱发展经济',
        effects: [
          { type: 'resources', target: 'gold', value: 500 },
          { type: 'resources', target: 'food', value: 300 },
        ],
      },
    ],
    isRepeatable: true,
    isHistoric: false,
  },
  {
    id: 'event-flood',
    title: '洪水泛滥',
    description: '天降暴雨，河水泛滥，农田被淹。',
    type: 'natural',
    phase: [GamePhase.EARLY_ZHOU, GamePhase.SPRING_AUTUMN, GamePhase.WARRING_STATES],
    probability: 0.2,
    choices: [
      {
        id: 'choice-1',
        text: '赈灾救济',
        description: '拨款救灾，安抚民心',
        effects: [
          { type: 'resources', target: 'gold', value: -300 },
          { type: 'prestige', target: 'self', value: 20 },
        ],
      },
      {
        id: 'choice-2',
        text: '兴修水利',
        description: '借机修建水利工程',
        effects: [
          { type: 'resources', target: 'gold', value: -500 },
          { type: 'resources', target: 'food', value: 200, duration: 10 },
        ],
      },
    ],
    isRepeatable: true,
    isHistoric: false,
  },
  {
    id: 'event-hero-arrival',
    title: '贤才来访',
    description: '一位著名武将听说了你的名声，前来投奔。',
    type: 'hero',
    phase: [GamePhase.EARLY_ZHOU, GamePhase.SPRING_AUTUMN, GamePhase.WARRING_STATES],
    probability: 0.25,
    requirements: {
      minPrestige: 50,
    },
    choices: [
      {
        id: 'choice-1',
        text: '热情接纳',
        description: '厚礼相待，委以重任',
        effects: [
          { type: 'hero', target: 'random', value: 1 },
          { type: 'resources', target: 'gold', value: -200 },
          { type: 'prestige', target: 'self', value: 30 },
        ],
      },
      {
        id: 'choice-2',
        text: '考察试用',
        description: '先观察一段时间',
        effects: [
          { type: 'hero', target: 'random', value: 1 },
          { type: 'prestige', target: 'self', value: 10 },
        ],
      },
    ],
    isRepeatable: true,
    isHistoric: false,
  },
];

// 根据条件获取可触发的事件
export function getTriggerableEvents(
  currentPhase: GamePhase,
  currentYear: number,
  currentTurn: number,
  playerPrestige: number,
  playerTerritoryCount: number,
  playerFactionId: string
): HistoricEvent[] {
  return HISTORIC_EVENTS.filter((event) => {
    // 检查阶段
    if (!event.phase.includes(currentPhase)) {
      return false;
    }

    // 检查年份或回合
    if (event.triggerYear && Math.abs(currentYear - event.triggerYear) > 5) {
      return false;
    }
    if (event.triggerTurn && currentTurn !== event.triggerTurn) {
      return false;
    }

    // 检查概率
    if (Math.random() > event.probability) {
      return false;
    }

    // 检查需求
    if (event.requirements) {
      if (event.requirements.minPrestige && playerPrestige < event.requirements.minPrestige) {
        return false;
      }
      if (event.requirements.minTerritories && playerTerritoryCount < event.requirements.minTerritories) {
        return false;
      }
      if (event.requirements.factions && !event.requirements.factions.includes(playerFactionId)) {
        return false;
      }
    }

    return true;
  });
}

// 获取事件详情
export function getEventById(eventId: string): HistoricEvent | undefined {
  return HISTORIC_EVENTS.find((e) => e.id === eventId);
}

export default HISTORIC_EVENTS;

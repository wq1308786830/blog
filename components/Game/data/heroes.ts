/**
 * 武将数据
 * 春秋战国名将
 */

import type { Hero } from '../types/gameTypes';
import { HeroRole, SkillType } from '../types/gameTypes';

export const INITIAL_HEROES: Hero[] = [
  // ========== 春秋时期 ==========
  {
    id: 'hero-sunwu',
    name: '孙武',
    courtesyName: '长卿',
    portrait: '/heroes/sunwu.png',
    stats: {
      war: 75,
      intelligence: 95,
      politics: 80,
      charm: 85,
      leadership: 98,
    },
    skills: [
      {
        id: 'skill-art-of-war',
        name: '孙子兵法',
        description: '全军攻击力提升30%，士气不会下降',
        type: SkillType.STRATEGY,
        effect: {
          target: 'self',
          attribute: 'attack',
          value: 30,
          duration: -1,
        },
        cooldown: 5,
      },
    ],
    biography: '春秋末期齐国军事家，被誉为"兵圣"，著有《孙子兵法》',
    birthYear: -545,
    deathYear: -470,
    loyalty: 90,
    isRecruited: false,
    historicalFactions: ['faction-wu'],
  },
  {
    id: 'hero-wuqi',
    name: '吴起',
    courtesyName: '',
    portrait: '/heroes/wuqi.png',
    stats: {
      war: 85,
      intelligence: 92,
      politics: 88,
      charm: 80,
      leadership: 95,
    },
    skills: [
      {
        id: 'skill-wuqi-reform',
        name: '吴起变法',
        description: '领地资源产出提升50%，军队战斗力提升20%',
        type: SkillType.GOVERNANCE,
        effect: {
          target: 'self',
          attribute: 'resources',
          value: 50,
          duration: 3,
        },
        cooldown: 8,
      },
    ],
    biography: '战国时期卫国人，兵家代表人物，与孙子并称"孙吴"',
    birthYear: -440,
    deathYear: -381,
    loyalty: 70,
    isRecruited: false,
    historicalFactions: ['faction-lu', 'faction-wei', 'faction-chu'],
  },

  // ========== 战国时期 ==========
  {
    id: 'hero-baiqi',
    name: '白起',
    courtesyName: '',
    portrait: '/heroes/baiqi.png',
    stats: {
      war: 95,
      intelligence: 85,
      politics: 60,
      charm: 50,
      leadership: 96,
    },
    skills: [
      {
        id: 'skill-human-butcher',
        name: '人屠',
        description: '战斗中敌军伤亡增加50%，战后俘虏翻倍',
        type: SkillType.COMBAT,
        effect: {
          target: 'enemy',
          attribute: 'casualties',
          value: 50,
          duration: 1,
        },
        cooldown: 6,
      },
    ],
    biography: '秦国名将，战国四大名将之首，人称"人屠"',
    birthYear: -332,
    deathYear: -257,
    loyalty: 95,
    isRecruited: false,
    historicalFactions: ['faction-qin'],
  },
  {
    id: 'hero-lianpo',
    name: '廉颇',
    courtesyName: '',
    portrait: '/heroes/lianpo.png',
    stats: {
      war: 92,
      intelligence: 75,
      politics: 60,
      charm: 80,
      leadership: 90,
    },
    skills: [
      {
        id: 'skill-iron-wall',
        name: '固若金汤',
        description: '防御时部队防御力提升100%，不会溃退',
        type: SkillType.COMBAT,
        effect: {
          target: 'self',
          attribute: 'defense',
          value: 100,
          duration: 2,
        },
        cooldown: 5,
      },
    ],
    biography: '赵国名将，战国四大名将之一，以勇猛果敢闻名',
    birthYear: -327,
    deathYear: -243,
    loyalty: 90,
    isRecruited: false,
    historicalFactions: ['faction-zhao', 'faction-wei', 'faction-chu'],
  },
  {
    id: 'hero-limu',
    name: '李牧',
    courtesyName: '',
    portrait: '/heroes/limu.png',
    stats: {
      war: 88,
      intelligence: 90,
      politics: 65,
      charm: 85,
      leadership: 94,
    },
    skills: [
      {
        id: 'skill-defend-north',
        name: '守边名将',
        description: '防御匈奴时战斗力提升80%，敌军无法劫掠',
        type: SkillType.COMBAT,
        effect: {
          target: 'self',
          attribute: 'attack',
          value: 80,
          duration: -1,
        },
        cooldown: 4,
      },
    ],
    biography: '赵国名将，战国四大名将之一，擅长防守反击',
    birthYear: -305,
    deathYear: -229,
    loyalty: 95,
    isRecruited: false,
    historicalFactions: ['faction-zhao'],
  },
  {
    id: 'hero-wangjian',
    name: '王翦',
    courtesyName: '',
    portrait: '/heroes/wangjian.png',
    stats: {
      war: 88,
      intelligence: 88,
      politics: 75,
      charm: 85,
      leadership: 93,
    },
    skills: [
      {
        id: 'skill-conquer-six',
        name: '灭六国',
        description: '攻城时成功率提升40%，敌军士气下降更快',
        type: SkillType.COMBAT,
        effect: {
          target: 'self',
          attribute: 'siege',
          value: 40,
          duration: 3,
        },
        cooldown: 6,
      },
    ],
    biography: '秦国名将，战国四大名将之一，率军灭五国',
    birthYear: -303,
    deathYear: -214,
    loyalty: 95,
    isRecruited: false,
    historicalFactions: ['faction-qin'],
  },

  // ========== 谋士 ==========
  {
    id: 'hero-shangyang',
    name: '商鞅',
    courtesyName: '公孙鞅',
    portrait: '/heroes/shangyang.png',
    stats: {
      war: 50,
      intelligence: 95,
      politics: 98,
      charm: 60,
      leadership: 70,
    },
    skills: [
      {
        id: 'skill-reform',
        name: '商鞅变法',
        description: '所有领地资源产出翻倍，法律效果提升',
        type: SkillType.GOVERNANCE,
        effect: {
          target: 'self',
          attribute: 'resources',
          value: 100,
          duration: 5,
        },
        cooldown: 10,
      },
    ],
    biography: '卫国公子，入秦变法，使秦国富强',
    birthYear: -390,
    deathYear: -338,
    loyalty: 90,
    isRecruited: false,
    historicalFactions: ['faction-wei', 'faction-qin'],
  },
  {
    id: 'hero-zhangyi',
    name: '张仪',
    courtesyName: '',
    portrait: '/heroes/zhangyi.png',
    stats: {
      war: 40,
      intelligence: 96,
      politics: 92,
      charm: 88,
      leadership: 65,
    },
    skills: [
      {
        id: 'skill-horizontal',
        name: '连横之策',
        description: '外交成功率提升80%，可破坏敌方同盟',
        type: SkillType.DIPLOMACY,
        effect: {
          target: 'enemy',
          attribute: 'diplomacy',
          value: 80,
          duration: 3,
        },
        cooldown: 6,
      },
    ],
    biography: '魏国贵族，纵横家代表人物，倡导连横',
    birthYear: -350,
    deathYear: -310,
    loyalty: 70,
    isRecruited: false,
    historicalFactions: ['faction-wei', 'faction-qin'],
  },
  {
    id: 'hero-suqin',
    name: '苏秦',
    courtesyName: '季子',
    portrait: '/heroes/suqin.png',
    stats: {
      war: 35,
      intelligence: 95,
      politics: 90,
      charm: 90,
      leadership: 70,
    },
    skills: [
      {
        id: 'skill-vertical',
        name: '合纵之策',
        description: '可同时与多个势力结盟，联军战斗力提升30%',
        type: SkillType.DIPLOMACY,
        effect: {
          target: 'self',
          attribute: 'alliance',
          value: 30,
          duration: 5,
        },
        cooldown: 8,
      },
    ],
    biography: '东周洛阳人，纵横家代表人物，倡导合纵',
    birthYear: -337,
    deathYear: -284,
    loyalty: 75,
    isRecruited: false,
    historicalFactions: ['faction-zhou', 'faction-wei', 'faction-qi', 'faction-chu'],
  },
  {
    id: 'hero-fanjuji',
    name: '范雎',
    courtesyName: '叔',
    portrait: '/heroes/fanjuji.png',
    stats: {
      war: 40,
      intelligence: 92,
      politics: 90,
      charm: 70,
      leadership: 60,
    },
    skills: [
      {
        id: 'skill-distance',
        name: '远交近攻',
        description: '与远方势力外交关系提升，近邻战斗优势',
        type: SkillType.DIPLOMACY,
        effect: {
          target: 'self',
          attribute: 'diplomacy',
          value: 50,
          duration: 4,
        },
        cooldown: 6,
      },
    ],
    biography: '魏国人，入秦为相，提出远交近攻策略',
    birthYear: -305,
    deathYear: -255,
    loyalty: 85,
    isRecruited: false,
    historicalFactions: ['faction-wei', 'faction-qin'],
  },
  {
    id: 'hero-lisi',
    name: '李斯',
    courtesyName: '通古',
    portrait: '/heroes/lisi.png',
    stats: {
      war: 35,
      intelligence: 94,
      politics: 96,
      charm: 75,
      leadership: 70,
    },
    skills: [
      {
        id: 'skill-unify',
        name: '书同文车同轨',
        description: '统一后治理效率提升100%，叛乱几率降低',
        type: SkillType.GOVERNANCE,
        effect: {
          target: 'self',
          attribute: 'governance',
          value: 100,
          duration: -1,
        },
        cooldown: 10,
      },
    ],
    biography: '楚国人，秦国丞相，辅佐秦始皇统一天下',
    birthYear: -284,
    deathYear: -208,
    loyalty: 90,
    isRecruited: false,
    historicalFactions: ['faction-chu', 'faction-qin'],
  },

  // ========== 春秋五霸相关 ==========
  {
    id: 'hero-guanzhong',
    name: '管仲',
    courtesyName: '夷吾',
    portrait: '/heroes/guanzhong.png',
    stats: {
      war: 60,
      intelligence: 96,
      politics: 98,
      charm: 90,
      leadership: 85,
    },
    skills: [
      {
        id: 'skill-prosperity',
        name: '富国强兵',
        description: '商业收入翻倍，军队装备质量提升',
        type: SkillType.GOVERNANCE,
        effect: {
          target: 'self',
          attribute: 'gold',
          value: 100,
          duration: 5,
        },
        cooldown: 8,
      },
    ],
    biography: '颍上人，齐国相，辅佐齐桓公称霸',
    birthYear: -723,
    deathYear: -645,
    loyalty: 95,
    isRecruited: false,
    historicalFactions: ['faction-qi'],
  },
  {
    id: 'hero-baoshuya',
    name: '鲍叔牙',
    courtesyName: '',
    portrait: '/heroes/baoshuya.png',
    stats: {
      war: 55,
      intelligence: 88,
      politics: 90,
      charm: 95,
      leadership: 80,
    },
    skills: [
      {
        id: 'skill-recommend',
        name: '知人善任',
        description: '招募武将成功率翻倍，武将忠诚度提升',
        type: SkillType.GOVERNANCE,
        effect: {
          target: 'self',
          attribute: 'recruitment',
          value: 100,
          duration: 4,
        },
        cooldown: 6,
      },
    ],
    biography: '齐国大夫，荐管仲于齐桓公',
    birthYear: -730,
    deathYear: -644,
    loyalty: 98,
    isRecruited: false,
    historicalFactions: ['faction-qi'],
  },

  // ========== 赵国名将 ==========
  {
    id: 'hero-linxiangru',
    name: '蔺相如',
    courtesyName: '',
    portrait: '/heroes/linxiangru.png',
    stats: {
      war: 50,
      intelligence: 92,
      politics: 95,
      charm: 90,
      leadership: 75,
    },
    skills: [
      {
        id: 'skill-return-jade',
        name: '完璧归赵',
        description: '外交谈判成功率提升100%，不会被欺骗',
        type: SkillType.DIPLOMACY,
        effect: {
          target: 'self',
          attribute: 'diplomacy',
          value: 100,
          duration: 3,
        },
        cooldown: 5,
      },
    ],
    biography: '赵国上卿，以完璧归赵、负荆请罪闻名',
    birthYear: -329,
    deathYear: -259,
    loyalty: 95,
    isRecruited: false,
    historicalFactions: ['faction-zhao'],
  },
  {
    id: 'hero-zhao-she',
    name: '赵奢',
    courtesyName: '',
    portrait: '/heroes/zhaoshe.png',
    stats: {
      war: 85,
      intelligence: 85,
      politics: 70,
      charm: 80,
      leadership: 88,
    },
    skills: [
      {
        id: 'skill-quick-attack',
        name: '狭路相逢',
        description: '遭遇战攻击力提升60%，先制攻击',
        type: SkillType.COMBAT,
        effect: {
          target: 'self',
          attribute: 'attack',
          value: 60,
          duration: 1,
        },
        cooldown: 4,
      },
    ],
    biography: '赵国名将，赵括之父，阏与之战大破秦军',
    birthYear: -310,
    deathYear: -270,
    loyalty: 90,
    isRecruited: false,
    historicalFactions: ['faction-zhao'],
  },
];

// 根据ID获取武将
export function getHeroById(id: string): Hero | undefined {
  return INITIAL_HEROES.find(hero => hero.id === id);
}

// 根据势力获取武将
export function getHeroesByFaction(factionId: string): Hero[] {
  return INITIAL_HEROES.filter(hero =>
    hero.historicalFactions.includes(factionId)
  );
}

// 获取可招募的武将（未被招募的）
export function getAvailableHeroes(): Hero[] {
  return INITIAL_HEROES.filter(hero => !hero.isRecruited);
}

export default INITIAL_HEROES;

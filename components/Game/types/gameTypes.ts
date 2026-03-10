/**
 * 游戏核心类型定义
 * 春秋战国策略游戏
 */

// ==================== 枚举类型 ====================

export enum GamePhase {
  EARLY_ZHOU = 'early_zhou',       // 周朝后期
  SPRING_AUTUMN = 'spring_autumn', // 春秋时期
  WARRING_STATES = 'warring_states', // 战国时期
  UNIFICATION = 'unification',     // 秦统一天下
}

export enum TerritoryStatus {
  NEUTRAL = 'neutral',         // 中立
  OWNED = 'owned',             // 拥有
  OCCUPIED = 'occupied',       // 占领
  CONTESTED = 'contested',     // 争夺中
  DEVASTATED = 'devastated',   // 荒废
}

export enum ArmyStatus {
  IDLE = 'idle',               // 待机
  MOVING = 'moving',           // 移动中
  FIGHTING = 'fighting',       // 战斗中
  GARRISON = 'garrison',       // 驻防
  RETREATING = 'retreating',   // 撤退
}

export enum UnitType {
  INFANTRY = 'infantry',       // 步兵
  CAVALRY = 'cavalry',         // 骑兵
  ARCHER = 'archer',           // 弓兵
  CHARIOT = 'chariot',         // 战车（春秋特色）
  SIEGE = 'siege',             // 攻城器械
}

export enum HeroRole {
  COMMANDER = 'commander',     // 统帅
  ADVISOR = 'advisor',         // 谋士
  GENERAL = 'general',         // 将军
  GOVERNOR = 'governor',       // 内政
}

export enum DiplomaticStatus {
  ALLIED = 'allied',           // 同盟
  FRIENDLY = 'friendly',       // 友好
  NEUTRAL = 'neutral',         // 中立
  HOSTILE = 'hostile',         // 敌对
  AT_WAR = 'at_war',           // 战争
  VASSAL = 'vassal',           // 附庸
}

export enum ResourceType {
  POPULATION = 'population',   // 人口
  FOOD = 'food',               // 粮食
  GOLD = 'gold',               // 金钱
  WOOD = 'wood',               // 木材
  IRON = 'iron',               // 铁矿
  PRESTIGE = 'prestige',       // 声望
}

export enum TerrainType {
  PLAIN = 'plain',             // 平原
  MOUNTAIN = 'mountain',       // 山地
  RIVER = 'river',             // 河流
  FOREST = 'forest',           // 森林
  DESERT = 'desert',           // 沙漠
  SWAMP = 'swamp',             // 沼泽
}

// ==================== 基础类型 ====================

export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface Resources {
  population: number;
  food: number;
  gold: number;
  wood: number;
  iron: number;
  prestige: number;
}

export interface ResourceProduction {
  population: number;
  food: number;
  gold: number;
  wood: number;
  iron: number;
  prestige: number;
}

// ==================== 游戏实体类型 ====================

export interface Faction {
  id: string;
  name: string;
  leaderName: string;
  color: string;
  emblem: string;
  description: string;
  territoryIds: string[];
  resources: Resources;
  isPlayer: boolean;
  isAI: boolean;
  aiPersonality?: AIPersonality;
  founded: number; // 年份
  defeated?: number; // 灭亡年份
}

export interface AIPersonality {
  aggression: number;      // 侵略性 0-1
  diplomacy: number;       // 外交倾向 0-1
  expansion: number;       // 扩张欲望 0-1
  honor: number;          // 信誉度 0-1
}

export interface Territory {
  id: string;
  name: string;
  description: string;
  position: Position;
  size: number;           // 领地大小
  terrain: TerrainType;
  status: TerritoryStatus;
  ownerId: string | null;
  originalOwnerId: string;
  resources: ResourceProduction;
  population: number;
  defenses: number;       // 防御等级
  buildings: Building[];
  connectedTo: string[];  // 相邻领地ID
  isCapital: boolean;
  conqueredAt?: number;
  historicalInfo?: string;
}

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  name: string;
  effects: BuildingEffect[];
}

export enum BuildingType {
  FARM = 'farm',
  MINE = 'mine',
  BARRACKS = 'barracks',
  MARKET = 'market',
  ACADEMY = 'academy',
  WALL = 'wall',
  TEMPLE = 'temple',
}

export interface BuildingEffect {
  type: ResourceType | 'defense' | 'morale';
  value: number;
}

export interface Army {
  id: string;
  name: string;
  factionId: string;
  units: Unit[];
  totalSoldiers: number;
  morale: number;         // 士气 0-100
  status: ArmyStatus;
  currentTerritoryId: string;
  targetTerritoryId?: string;
  commanderId?: string;
  heroIds: string[];
  movementPoints: number;
  combatPower: number;
}

export interface Unit {
  id: string;
  type: UnitType;
  count: number;
  experience: number;     // 经验等级
  morale: number;
  equipment: Equipment;
}

export interface Equipment {
  weapon: string;
  armor: string;
  quality: number;        // 装备质量 0-100
}

export interface Hero {
  id: string;
  name: string;
  courtesyName?: string;  // 字
  factionId?: string;
  locationId?: string;
  assignedArmyId?: string;
  role?: HeroRole;
  portrait?: string;
  stats: HeroStats;
  skills: Skill[];
  biography: string;
  birthYear: number;
  deathYear?: number;
  loyalty: number;        // 忠诚度 0-100
  isRecruited: boolean;
  recruitedAt?: number;
  historicalFactions: string[]; // 历史上效力的势力
}

export interface HeroStats {
  war: number;           // 武力
  intelligence: number;  // 智力
  politics: number;      // 政治
  charm: number;         // 魅力
  leadership: number;    // 统率
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  effect: SkillEffect;
  cooldown: number;
}

export enum SkillType {
  COMBAT = 'combat',
  STRATEGY = 'strategy',
  GOVERNANCE = 'governance',
  DIPLOMACY = 'diplomacy',
}

export interface SkillEffect {
  target: 'self' | 'enemy' | 'area';
  attribute: string;
  value: number;
  duration: number;
}

// ==================== 游戏系统类型 ====================

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  year: number;
  phase: GamePhase;
  requirements?: EventRequirement[];
  choices: EventChoice[];
  isTriggered: boolean;
  triggeredAt?: number;
  resolved: boolean;
  resolvedAt?: number;
  playerChoice?: number;
  effects?: EventEffect[];
}

export enum EventType {
  HISTORICAL = 'historical',
  RANDOM = 'random',
  DIPLOMATIC = 'diplomatic',
  MILITARY = 'military',
  ECONOMIC = 'economic',
  RECRUITMENT = 'recruitment',
}

export interface EventRequirement {
  type: 'phase' | 'territory' | 'resource' | 'hero' | 'year';
  value: string | number;
  operator?: '>' | '<' | '=' | '>=' | '<=';
}

export interface EventChoice {
  id: number;
  text: string;
  description: string;
  requirements?: EventRequirement[];
  effects: EventEffect[];
}

export interface EventEffect {
  type: 'resource' | 'territory' | 'hero' | 'diplomacy' | 'prestige';
  target: string;
  value: number;
}

export interface DiplomaticRelation {
  id: string;
  faction1Id: string;
  faction2Id: string;
  status: DiplomaticStatus;
  tradeAgreement?: TradeAgreement;
  militaryAlliance?: MilitaryAlliance;
  createdAt: number;
  updatedAt: number;
}

export interface TradeAgreement {
  resourceType: ResourceType;
  amount: number;
  duration: number;
}

export interface MilitaryAlliance {
  targetFactionId?: string;
  duration: number;
  mutualDefense: boolean;
}

// ==================== 战斗系统类型 ====================

export interface Battle {
  id: string;
  attackerId: string;
  defenderId: string;
  territoryId: string;
  attackerArmyIds: string[];
  defenderArmyIds: string[];
  startTime: number;
  endTime?: number;
  rounds: BattleRound[];
  winner?: string;
  attackerCasualties: number;
  defenderCasualties: number;
  isSiege: boolean;
}

export interface BattleRound {
  round: number;
  attackerDamage: number;
  defenderDamage: number;
  attackerTactics?: string;
  defenderTactics?: string;
  events: BattleEvent[];
}

export interface BattleEvent {
  type: 'charge' | 'volley' | 'duel' | 'morale' | 'terrain' | 'hero_skill';
  description: string;
  effect: {
    target: 'attacker' | 'defender';
    damage?: number;
    moraleChange?: number;
  };
}

// ==================== 游戏状态类型 ====================

export interface GameState {
  phase: GamePhase;
  turn: number;
  year: number;
  playerId: string;
  territories: Territory[];
  armies: Army[];
  heroes: Hero[];
  events: GameEvent[];
  diplomaticRelations: DiplomaticRelation[];
  gameLog: GameLogEntry[];
  settings: GameSettings;
  isPaused: boolean;
  lastSavedAt: number | null;
}

export interface GameSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  difficulty: 'easy' | 'normal' | 'hard';
  soundEnabled: boolean;
}

export interface GameLogEntry {
  id: string;
  timestamp: number;
  turn: number;
  year: number;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'battle' | 'diplomacy';
}

// ==================== 玩家状态类型 ====================

export interface PlayerState {
  id: string;
  name: string;
  factionId: string;
  resources: Resources;
  controlledTerritories: string[];
  armies: string[];
  recruitedHeroes: string[];
  achievements: Achievement[];
  totalPlayTime: number;
  currentCampaignProgress: CampaignProgress;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export interface CampaignProgress {
  phase: GamePhase;
  objectives: Objective[];
  completedObjectives: string[];
}

export interface Objective {
  id: string;
  name: string;
  description: string;
  type: 'conquer' | 'recruit' | 'diplomacy' | 'develop';
  target: string;
  required: number;
  current: number;
}

// ==================== 游戏动作类型 ====================

export type GameAction =
  | { type: 'INIT_GAME'; payload: Partial<GameState> }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'SAVE_GAME' }
  | { type: 'NEXT_TURN' }
  | { type: 'UPDATE_PLAYER'; payload: Partial<PlayerState> }
  | { type: 'UPDATE_TERRITORY'; payload: { id: string; data: Partial<Territory> } }
  | { type: 'CONQUER_TERRITORY'; payload: { territoryId: string; conquerorId: string } }
  | { type: 'CREATE_ARMY'; payload: Army }
  | { type: 'UPDATE_ARMY'; payload: { id: string; data: Partial<Army> } }
  | { type: 'DISBAND_ARMY'; payload: string }
  | { type: 'MOVE_ARMY'; payload: { armyId: string; targetTerritoryId: string } }
  | { type: 'RECRUIT_HERO'; payload: { hero: Hero; territoryId: string } }
  | { type: 'ASSIGN_HERO'; payload: { heroId: string; armyId?: string; role?: HeroRole } }
  | { type: 'START_BATTLE'; payload: Battle }
  | { type: 'END_BATTLE'; payload: { battleId: string; winnerId: string } }
  | { type: 'TRIGGER_EVENT'; payload: GameEvent }
  | { type: 'CHOOSE_EVENT_OPTION'; payload: { eventId: string; optionId: number } }
  | { type: 'UPDATE_DIPLOMACY'; payload: { faction1Id: string; faction2Id: string; status: DiplomaticStatus } }
  | { type: 'ADD_LOG'; payload: { message: string; type?: GameLogEntry['type'] } }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'RESET_GAME' }
  // 额外的动作类型
  | { type: 'ADVANCE_TURN' }
  | { type: 'CHANGE_PHASE'; payload: GamePhase }
  | { type: 'RESOLVE_EVENT'; payload: { eventId: string; choice: number } };

// ==================== UI 类型 ====================

export interface MapViewport {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

export interface UIState {
  selectedTerritoryId: string | null;
  selectedArmyId: string | null;
  selectedHeroId: string | null;
  hoveredTerritoryId: string | null;
  currentView: 'map' | 'territory' | 'army' | 'hero' | 'diplomacy' | 'battle';
  viewport: MapViewport;
  isMenuOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  createdAt: number;
  dismissAfter?: number;
}

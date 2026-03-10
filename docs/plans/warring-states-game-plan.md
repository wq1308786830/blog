# 春秋战国策略游戏 - 实施计划

## Context

**目标**: 创建一个基于春秋战国时期历史背景的策略游戏页面，参考《率土之滨》的玩法。

**背景**:
- 项目是一个Next.js 16 + React 19博客，已有赛博朋克天气系统使用Three.js
- 需要创建新的游戏页面 `/game` 或 `/strategy`
- 保持与现有项目风格一致（赛博朋克美学）

**用户需求**:
1. 玩家从个人发展开始
2. 攻打其他玩家或势力
3. 建立/增强自己的势力
4. 势力发展为国家
5. 历史进程：周朝后期 → 春秋战国 → 秦统一天下

---

## Architecture Overview

```
app/
├── game/
│   ├── page.tsx              # 游戏主页面
│   ├── layout.tsx            # 游戏布局
│   ├── game.css              # 游戏样式
│   ├── loading.tsx           # 加载状态
│   └── [phase]/              # 不同历史阶段
│       ├── page.tsx
│       └── phase.css

components/
├── Game/
│   ├── GameClient.tsx        # 游戏客户端主组件
│   ├── GameScene.tsx         # Three.js 游戏场景
│   ├── types/
│   │   └── gameTypes.ts      # 游戏类型定义
│   ├── state/
│   │   ├── GameState.ts      # 游戏状态管理
│   │   └── PlayerState.ts    # 玩家状态
│   ├── map/
│   │   ├── TerritoryMap.tsx  # 领土地图组件
│   │   ├── Province.tsx      # 省份/领地组件
│   │   └── MapControls.tsx   # 地图控制
│   ├── units/
│   │   ├── Army.tsx          # 军队单位
│   │   ├── Hero.tsx          # 武将/英雄
│   │   └── UnitSystem.tsx    # 单位系统
│   ├── ui/
│   │   ├── ResourcePanel.tsx # 资源面板
│   │   ├── ActionMenu.tsx    # 行动菜单
│   │   ├── TerritoryInfo.tsx # 领地信息
│   │   ├── BattleScene.tsx   # 战斗场景
│   │   ├── DiplomacyPanel.tsx# 外交面板
│   │   └── Timeline.tsx      # 历史时间线
│   ├── effects/
│   │   ├── BattleEffect.tsx  # 战斗特效
│   │   ├── ConquestEffect.tsx# 征服特效
│   │   └── WeatherEffect.tsx # 天气影响
│   └── data/
│       ├── territories.ts    # 领地数据（春秋战国各诸侯国）
│       ├── heroes.ts         # 武将数据（春秋战国名将）
│       └── events.ts         # 历史事件

services/
├── game/
│   ├── gameEngine.ts         # 游戏引擎
│   ├── battleSystem.ts       # 战斗系统
│   ├── diplomacySystem.ts    # 外交系统
│   └── saveSystem.ts         # 存档系统
```

---

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **State Management**: React Context + useReducer (复杂状态)
- **3D Rendering**: Three.js + @react-three/fiber (赛博朋克风格地图)
- **Styling**: Tailwind CSS + CSS Modules
- **Animation**: Framer Motion (UI动画)
- **Storage**: localStorage (存档)

---

## Game Design

### 核心玩法循环

```
发展资源 → 招募军队 → 征服领地 → 扩张势力 → 建立国家 → 统一天下
```

### 历史阶段

1. **周朝后期** (初始阶段)
   - 玩家是小型领主/士人
   - 周王室衰微，诸侯割据
   - 目标：建立自己的小势力

2. **春秋时期**
   - 诸侯争霸
   - 五霸崛起
   - 目标：成为一方霸主

3. **战国时期**
   - 七雄并立
   - 合纵连横
   - 目标：建立强大国家

4. **秦统一天下** (最终目标)
   - 消灭六国
   - 统一华夏
   - 目标：统一天下，成为始皇帝

### 游戏机制

#### 资源系统
- **人口**: 发展基础，影响军队规模
- **粮食**: 维持军队和城市
- **金钱**: 招募、建设、外交
- **木材/铁矿**: 建设、武器制造
- **声望**: 吸引人才、结盟

#### 军事系统
- **步兵/骑兵/弓兵**: 基础兵种
- **战车**: 春秋特色
- **将领**: 影响军队战斗力
- **谋略**: 计策、伏击、火攻等

#### 领土系统
- 基于春秋战国真实地图
- 各诸侯国领地
- 要塞、关隘
- 资源点

#### 外交系统
- 结盟
- 朝贡
- 宣战/求和
- 联姻

#### 人才系统
- 招募历史名将（孙武、吴起、白起等）
- 谋士（商鞅、李斯等）
- 内政人才

---

## Implementation Plan

### Phase 1: 基础架构

#### Task 1.1: 创建游戏类型定义
**Files:**
- Create: `components/Game/types/gameTypes.ts`

**内容:**
- Player, Territory, Army, Hero 等类型
- GameState, GamePhase 枚举
- Resource 类型

#### Task 1.2: 创建游戏状态管理
**Files:**
- Create: `components/Game/state/GameState.ts`
- Create: `components/Game/state/PlayerState.ts`

**内容:**
- 使用 useReducer 管理复杂游戏状态
- 状态持久化到 localStorage

#### Task 1.3: 创建游戏主页面
**Files:**
- Create: `app/game/page.tsx`
- Create: `app/game/layout.tsx`
- Create: `app/game/game.css`

**内容:**
- 游戏页面入口
- 加载游戏状态
- 主布局结构

#### Task 1.4: 创建游戏客户端组件
**Files:**
- Create: `components/Game/GameClient.tsx`

**内容:**
- 游戏主组件
- 状态管理集成
- 游戏初始化

---

### Phase 2: 地图系统

#### Task 2.1: 创建领土数据
**Files:**
- Create: `components/Game/data/territories.ts`

**内容:**
- 春秋战国各诸侯国数据
- 领地坐标、资源、人口
- 要塞位置

#### Task 2.2: 创建赛博朋克风格地图
**Files:**
- Create: `components/Game/map/TerritoryMap.tsx`
- Create: `components/Game/GameScene.tsx`

**内容:**
- 使用 Three.js 创建赛博朋克风格地图
- 领地高亮效果
- 军队移动动画
- 参考 WeatherScene 的实现方式

#### Task 2.3: 创建领地组件
**Files:**
- Create: `components/Game/map/Province.tsx`

**内容:**
- 单个领地显示
- 领地信息展示
- 点击交互

#### Task 2.4: 创建地图控制
**Files:**
- Create: `components/Game/map/MapControls.tsx`

**内容:**
- 缩放、平移
- 视角切换
- 快速定位

---

### Phase 3: UI系统

#### Task 3.1: 创建资源面板
**Files:**
- Create: `components/Game/ui/ResourcePanel.tsx`

**内容:**
- 显示各种资源数量
- 资源增长/消耗动画
- 资源警告

#### Task 3.2: 创建行动菜单
**Files:**
- Create: `components/Game/ui/ActionMenu.tsx`

**内容:**
- 发展、军事、外交选项
- 子菜单
- 快捷操作

#### Task 3.3: 创建领地信息面板
**Files:**
- Create: `components/Game/ui/TerritoryInfo.tsx`

**内容:**
- 选中领地详情
- 资源产出
- 驻军信息
- 操作按钮（征税、征兵等）

#### Task 3.4: 创建历史时间线
**Files:**
- Create: `components/Game/ui/Timeline.tsx`

**内容:**
- 显示当前历史时期
- 历史事件提示
- 阶段进度

---

### Phase 4: 军事系统

#### Task 4.1: 创建军队单位
**Files:**
- Create: `components/Game/units/Army.tsx`
- Create: `components/Game/units/UnitSystem.tsx`

**内容:**
- 军队显示（Three.js）
- 兵种类型
- 军队移动

#### Task 4.2: 创建武将数据
**Files:**
- Create: `components/Game/data/heroes.ts`

**内容:**
- 春秋战国名将数据
- 属性、技能
- 招募条件

#### Task 4.3: 创建武将组件
**Files:**
- Create: `components/Game/units/Hero.tsx`

**内容:**
- 武将信息展示
- 技能效果
- 装备系统

#### Task 4.4: 创建战斗场景
**Files:**
- Create: `components/Game/ui/BattleScene.tsx`

**内容:**
- 战斗动画
- 伤害数字
- 战斗结果

---

### Phase 5: 游戏逻辑

#### Task 5.1: 创建游戏引擎
**Files:**
- Create: `services/game/gameEngine.ts`

**内容:**
- 游戏循环
- 时间推进
- 资源计算
- 事件触发

#### Task 5.2: 创建战斗系统
**Files:**
- Create: `services/game/battleSystem.ts`

**内容:**
- 战斗计算
- 兵种克制
- 地形影响
- 将领加成

#### Task 5.3: 创建外交系统
**Files:**
- Create: `services/game/diplomacySystem.ts`
- Create: `components/Game/ui/DiplomacyPanel.tsx`

**内容:**
- 外交关系计算
- 结盟/战争逻辑
- AI行为

#### Task 5.4: 创建存档系统
**Files:**
- Create: `services/game/saveSystem.ts`

**内容:**
- 存档/读档
- 自动存档
- 存档管理

---

### Phase 6: 特效系统

#### Task 6.1: 创建战斗特效
**Files:**
- Create: `components/Game/effects/BattleEffect.tsx`

**内容:**
- 攻击特效
- 技能特效
- 赛博朋克风格粒子效果

#### Task 6.2: 创建征服特效
**Files:**
- Create: `components/Game/effects/ConquestEffect.tsx`

**内容:**
- 领地占领动画
- 势力扩张效果

#### Task 6.3: 整合特效
**Files:**
- Modify: `components/Game/GameScene.tsx`

**内容:**
- 整合所有特效到场景

---

### Phase 7: 历史事件系统

#### Task 7.1: 创建历史事件数据
**Files:**
- Create: `components/Game/data/events.ts`

**内容:**
- 春秋战国重大历史事件
- 事件触发条件
- 事件效果

#### Task 7.2: 创建事件系统
**Files:**
- Create: `components/Game/ui/EventModal.tsx`

**内容:**
- 事件弹窗
- 事件选择
- 事件结果

---

### Phase 8: 历史阶段页面

#### Task 8.1: 创建阶段页面结构
**Files:**
- Create: `app/game/spring-autumn/page.tsx`
- Create: `app/game/warring-states/page.tsx`
- Create: `app/game/unification/page.tsx`

**内容:**
- 不同阶段的游戏内容
- 阶段特定机制
- 阶段过渡

---

## Verification Checklist

### 功能验证
- [ ] 游戏正常加载
- [ ] 地图显示正确
- [ ] 资源系统工作正常
- [ ] 军事系统工作正常
- [ ] 战斗系统计算正确
- [ ] 存档/读档功能正常
- [ ] 历史事件触发正常

### UI验证
- [ ] 赛博朋克风格一致
- [ ] 响应式布局正常
- [ ] 动画流畅
- [ ] 交互反馈及时

### 性能验证
- [ ] Three.js 场景 60fps
- [ ] 状态更新不卡顿
- [ ] 内存占用合理

---

## 预期效果

完成后的游戏将包含:

### 视觉
- 🗺️ 赛博朋克风格的春秋战国地图
- ⚔️ 炫酷的战斗特效
- 🎆 领地征服动画
- 📊 科幻风格UI界面

### 玩法
- 🏛️ 从小领主到统一天下的成长历程
- 💰 深度资源管理系统
- 🎖️ 招募历史名将
- ⚔️ 策略战斗系统
- 🤝 复杂外交关系
- 📜 历史事件互动

这将是一个融合历史文化和赛博朋克美学的独特策略游戏体验!

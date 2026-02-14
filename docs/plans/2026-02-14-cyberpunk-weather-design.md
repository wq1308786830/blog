# 赛博朋克天气系统设计文档

> **设计日期**: 2026-02-14
> **目标**: 创建极致炫酷的赛博朋克风格Three.js天气效果

## 设计目标

### 视觉风格
- **赛博朋克科幻风格**
- 霓虹光效、故障艺术、扫描线
- 强烈对比度、电影感

### 增强方向
- ✅ 粒子发光效果
- ✅ 后期处理特效
- ✅ 交互性效果
- ✅ 天气特效创新

### 性能目标
- **极致视觉优先**
- 粒子数: 10,000-50,000
- 目标FPS: 60fps (高端GPU), 30fps (中端GPU)
- 内存: < 500MB

---

## 整体架构

```
赛博朋克天气系统
├── GPU粒子系统
│   ├── 霓虹粒子材质
│   ├── 数据流动画
│   └── 发光尾迹效果
│
├── 后期处理管线
│   ├── UnrealBloomPass (霓虹光晕)
│   ├── ChromaticAberration (色差)
│   ├── GlitchPass (故障艺术)
│   ├── ScanlinePass (扫描线)
│   └── VignetteEffect (暗角)
│
├── 交互系统
│   ├── 鼠标追踪器
│   ├── 视差摄像机
│   └── 粒子响应系统
│
└── 天气特效层
    ├── CyberRain (全息雨滴+霓虹闪电)
    ├── CyberSnow (数字雪花+故障粒子)
    ├── CyberSunny (能量光束+数字云层)
    ├── CyberCloudy (全息云层+数据雾)
    ├── CyberFoggy (数字雾气+矩阵效果)
    ├── CyberWindy (能量粒子流+风场可视化)
    └── CyberSandstorm (数据沙尘+故障艺术)
```

---

## 一、粒子系统设计

### 1.1 霓虹粒子材质

**自定义Shader特性:**

#### 顶点着色器
- 动态大小脉动 (Pulse Effect)
- 数据流位移 (Data Stream Displacement)
- 距离衰减 (Distance Attenuation)

#### 片段着色器
- 霓虹发光核心 (Neon Glow Core)
- 双色渐变 (Primary + Accent Color)
- 故障闪烁 (Glitch Flicker)
- 扫描线叠加 (Scanline Overlay)

### 1.2 粒子类型

```typescript
enum ParticleType {
  StandardParticle,      // 基础发光粒子
  DataStreamParticle,    // 数据流粒子(带尾迹)
  GlitchParticle,        // 故障粒子(随机位移)
  HologramParticle       // 全息粒子(透明+扫描线)
}
```

### 1.3 GPU粒子系统

**使用 InstancedMesh 优化:**
- 单次绘制调用渲染 10,000+ 粒子
- GPU计算位置更新
- 每个粒子独立属性:
  - 位置、速度、生命周期
  - 颜色、大小、旋转
  - 发光强度、故障参数

**粒子数据结构:**
```typescript
interface ParticleData {
  position: Vector3
  velocity: Vector3
  life: number
  maxLife: number
  color: Color
  size: number
  glowIntensity: number
  glitchIntensity: number
  dataStreamOffset: number
}
```

### 1.4 粒子动画系统

**赛博朋克特效:**
- **数据流效果**: 粒子沿数据流路径移动,留下发光尾迹
- **故障抖动**: 随机位移、颜色闪烁、拉伸变形
- **霓虹脉冲**: 同步发光、呼吸效果
- **扫描线同步**: 所有粒子叠加移动的扫描线

---

## 二、后期处理管线

### 2.1 渲染流程

```
Scene渲染 → Bloom光晕 → 色差效果 → 故障艺术 → 扫描线 → 暗角 → 最终输出
```

### 2.2 效果配置

#### UnrealBloomPass (霓虹光晕)
```typescript
{
  strength: 2.0,        // 光晕强度
  radius: 0.8,          // 光晕半径
  threshold: 0.3,       // 发光阈值
}
```
- 让所有霓虹粒子产生强烈光晕
- 模拟真实霓虹灯的散射效果

#### ChromaticAberration (色差)
```typescript
{
  offset: [0.002, 0.002],  // RGB偏移量
  radialModulation: true,   // 径向调制
  modulationOffset: 0.5
}
```
- RGB通道分离
- 边缘更明显的色差效果

#### GlitchPass (故障艺术)
```typescript
{
  dtSize: 64,
  chunks: 6,
  intensity: 0.5,
  doGlitch: true
}
```
- 随机出现的数字故障
- 水平撕裂效果

#### ScanlinePass (扫描线)
```typescript
{
  density: 1.5,        // 扫描线密度
  speed: 0.05,         // 移动速度
  opacity: 0.15        // 透明度
}
```
- 覆盖全屏的水平扫描线
- CRT显示器效果

#### VignetteEffect (暗角)
```typescript
{
  darkness: 0.8,       // 暗角强度
  offset: 0.3          // 暗角范围
}
```

### 2.3 动态效果控制

**根据天气类型动态调整:**
- **雨天**: 增强故障艺术(模拟信号干扰)
- **雪天**: 增强色差(模拟低温视觉)
- **晴天**: 增强Bloom(强烈光照)
- **沙尘暴**: 增强噪点+故障(数据损坏)

---

## 三、交互系统设计

### 3.1 鼠标追踪系统

```typescript
interface MouseTracker {
  position: Vector2        // 鼠标位置
  normalizedPosition: Vector2  // 归一化 [-1, 1]
  velocity: Vector2        // 移动速度
  worldPosition: Vector3   // 3D世界坐标
}
```

**交互效果:**
- **粒子吸引**: 鼠标附近的粒子被轻微吸引
- **涟漪扩散**: 点击产生数据涟漪
- **能量波动**: 鼠标移动产生能量波

### 3.2 视差摄像机系统

**多层次视差:**
```typescript
ParallaxLayers = [
  { depth: 0.1, particles: 'background' },   // 远景粒子
  { depth: 0.5, particles: 'midground' },    // 中景粒子
  { depth: 1.0, particles: 'foreground' },   // 前景粒子
]
```

### 3.3 粒子响应系统

#### 吸引/排斥场
- 鼠标周围形成力场
- 粒子被吸引或排斥

#### 数据涟漪
```typescript
interface DataRipple {
  position: Vector3      // 涟漪位置
  radius: number         // 当前半径
  maxRadius: number      // 最大半径
  intensity: number      // 强度
  life: number           // 生命周期
}
```

#### 能量波动
- 鼠标快速移动触发
- 粒子颜色/亮度瞬间变化

### 3.4 天气相关交互

- **雨天**: 鼠标移动产生电磁干扰
- **雪天**: 鼠标留下冰霜轨迹
- **晴天**: 鼠标吸引光粒子
- **沙尘暴**: 鼠标推散沙尘粒子

---

## 四、天气特效创新

### 4.1 CyberRain (赛博朋克雨天)
- 全息雨滴 (Hologram Raindrops)
- 霓虹闪电 (Neon Lightning)
- 数据流雨线 (Data Stream Rain)
- 电磁脉冲波 (EMP Waves)

### 4.2 CyberSnow (赛博朋克雪天)
- 数字雪花 (Digital Snowflakes)
- 故障粒子 (Glitch Particles)
- 全息冰晶 (Hologram Ice Crystals)
- 数据冻结效果 (Data Freeze)

### 4.3 CyberSunny (赛博朋克晴天)
- 能量光束 (Energy Beams)
- 数字云层 (Digital Clouds)
- 霓虹太阳 (Neon Sun)
- 光粒子场 (Light Particle Field)

### 4.4 其他天气
- **CyberCloudy**: 全息云层、数据雾
- **CyberFoggy**: 数字雾气、矩阵效果
- **CyberWindy**: 能量粒子流、风场可视化
- **CyberSandstorm**: 数据沙尘、故障艺术

---

## 技术栈

### 核心库
- **React Three Fiber** - 3D渲染框架
- **@react-three/postprocessing** - 后期处理
- **@react-three/drei** - Three.js工具集
- **three** - 3D引擎

### 自定义实现
- **GLSL着色器** - 霓虹粒子、数据流
- **InstancedMesh** - GPU粒子优化
- **EffectComposer** - 后期处理管线

### 开发工具
- **TypeScript** - 类型安全
- **pnpm** - 包管理器

---

## 实施策略

### MVP阶段 (快速演示)
1. 实现赛博朋克雨天效果
2. 包含:霓虹粒子、Bloom光晕、鼠标交互
3. 验证技术可行性和视觉效果

### 完整实施
1. 实现所有粒子材质和动画
2. 完整后期处理管线
3. 所有7种天气特效
4. 完整交互系统
5. 性能优化

---

## 成功标准

### 视觉效果
- ✅ 霓虹发光效果明显
- ✅ 故障艺术真实感
- ✅ 电影级后期处理
- ✅ 交互流畅自然

### 性能指标
- ✅ 高端GPU: 60fps
- ✅ 中端GPU: 30fps
- ✅ 粒子数 > 10,000
- ✅ 内存占用 < 500MB

### 代码质量
- ✅ TypeScript类型完整
- ✅ 模块化设计
- ✅ 可维护性高
- ✅ 文档完善
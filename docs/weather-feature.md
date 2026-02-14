# Weather 3D 天气特效页面

## 概述

`/weather` 页面使用 Three.js 和 React Three Fiber 实现赛博朋克风格的实时天气 3D 粒子特效展示。

## 功能特性

- **实时天气数据**: 支持和风天气和 OpenWeatherMap API
- **7 种天气类型**: 晴天、雨天、雪天、多云、雾霾、大风、沙尘
- **3D 粒子特效**: 每种天气类型独特的 Three.js 粒子动画
- **赛博朋克风格**: 霓虹色彩和发光效果
- **响应式设计**: 移动端适配
- **性能优化**: 动态导入禁用 SSR，BufferGeometry 高效渲染

## 环境配置

在 `.env.local` 文件中配置天气 API Key：

```bash
# 和风天气 API Key (推荐)
NEXT_PUBLIC_QWEATHER_KEY=your_qweather_api_key_here

# OpenWeatherMap API Key (备选)
NEXT_PUBLIC_OPENWEATHER_KEY=your_openweather_api_key_here
```

### 获取 API Key

1. **和风天气**: https://dev.qweather.com/
   - 注册开发者账号
   - 创建应用获取 Key

2. **OpenWeatherMap**: https://openweathermap.org/
   - 注册账号
   - 在 API keys 页面获取 Key

## 文件结构

```
app/weather/
├── page.tsx              # 服务端页面入口
├── loading.tsx           # 加载状态
└── weather.css           # 专用样式

components/Weather/
├── WeatherScene.tsx      # Three.js 场景主组件
├── WeatherClient.tsx     # 客户端包装组件
├── effects/
│   ├── SunnyEffect.tsx   # 晴天效果
│   ├── RainyEffect.tsx   # 雨天效果
│   ├── SnowyEffect.tsx   # 雪天效果
│   ├── CloudyEffect.tsx  # 多云效果
│   ├── FoggyEffect.tsx   # 雾霾效果
│   ├── WindyEffect.tsx   # 大风效果
│   └── SandstormEffect.tsx # 沙尘效果
├── particles/
│   └── ParticleSystem.tsx # 粒子系统基类
├── ui/
│   ├── WeatherInfo.tsx   # 天气信息 HUD
│   └── weatherInfo.css   # HUD 样式
└── utils/
    └── weatherColors.ts  # Cyberpunk 配色方案

services/weather/
├── weatherApi.ts         # 天气 API 封装
├── weatherTypes.ts       # 类型定义
└── weatherMapper.ts      # 天气代码映射
```

## 技术栈

- **Three.js**: 3D 渲染引擎
- **@react-three/fiber**: React Three.js 渲染器
- **@react-three/drei**: 实用工具集
- **Next.js 16**: 服务端渲染框架
- **React 19**: UI 框架

## 天气类型与配色

| 天气 | 主色 | 次色 | 背景 |
|------|------|------|------|
| 晴天 | `#ffaa00` 金色 | `#ff6600` 橙色 | `#1a0f00` |
| 雨天 | `#00f3ff` 青色 | `#0088ff` 蓝色 | `#000a12` |
| 雪天 | `#ffffff` 白色 | `#aaddff` 淡蓝 | `#050510` |
| 多云 | `#8899aa` 灰蓝 | `#667788` 深灰 | `#0a0f14` |
| 雾霾 | `#556677` 雾灰 | `#334455` 深雾 | `#080c10` |
| 大风 | `#00ffaa` 青绿 | `#00ff66` 绿色 | `#001a0f` |
| 沙尘 | `#cc8800` 沙黄 | `#aa6600` 深黄 | `#1a1000` |

## 访问页面

```bash
# 开发环境
pnpm dev

# 访问
http://localhost:3000/weather
```

## 性能优化

1. **动态导入**: 使用 `next/dynamic` 禁用 Three.js SSR
2. **BufferGeometry**: 避免每帧创建对象，使用预分配缓冲区
3. **粒子数量控制**: 根据设备性能动态调整
4. **React.memo**: 所有组件使用 memo 包裹避免重渲染
5. **代码分割**: Three.js 相关代码单独打包

## API 降级策略

1. 优先使用和风天气 API
2. 如果和风天气失败，尝试 OpenWeatherMap
3. 如果都失败，使用默认天气数据（晴天）

## 扩展天气类型

在 `services/weather/weatherTypes.ts` 中添加新类型：

```typescript
export enum WeatherType {
  // ... 现有类型
  THUNDERSTORM = 'thunderstorm',
}
```

在 `components/Weather/utils/weatherColors.ts` 中添加配色：

```typescript
[WeatherType.THUNDERSTORM]: {
  primary: '#9900ff',
  secondary: '#6600cc',
  background: '#0a0014',
  accent: '#cc00ff',
},
```

创建对应的效果组件 `ThunderstormEffect.tsx` 并在 `WeatherScene.tsx` 中注册。
# 赛博朋克天气效果 MVP 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 快速实现赛博朋克雨天效果演示版本,验证视觉冲击力和技术可行性

**Architecture:** 使用自定义GLSL着色器创建霓虹发光粒子,集成Bloom后期处理实现光晕效果,添加鼠标交互增强沉浸感

**Tech Stack:** React Three Fiber, @react-three/postprocessing, Three.js, GLSL Shaders, TypeScript

---

## MVP 范围

### 包含内容
- ✅ 赛博朋克雨天效果 (CyberRain)
- ✅ 霓虹粒子材质 (发光、双色渐变)
- ✅ Bloom光晕后期处理
- ✅ 基础鼠标交互 (粒子吸引)
- ✅ 性能优化 (InstancedMesh)

### 暂不包含
- ❌ 其他天气类型
- ❌ 完整后期处理管线 (色差、故障艺术等)
- ❌ 高级交互 (涟漪、视差)

---

## Task 1: 安装依赖包

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Step 1: 安装后期处理库**

Run:
```bash
pnpm add @react-three/postprocessing postprocessing
```

Expected: 成功安装依赖包

**Step 2: 验证安装**

Run:
```bash
pnpm list @react-three/postprocessing postprocessing
```

Expected: 显示已安装的版本信息

**Step 3: 提交**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add postprocessing dependencies for cyberpunk effects"
```

---

## Task 2: 创建霓虹粒子着色器

**Files:**
- Create: `components/Weather/shaders/cyberpunkShaders.ts`

**Step 1: 编写霓虹粒子着色器代码**

创建文件并写入以下完整代码:

```typescript
/**
 * 赛博朋克霓虹粒子着色器
 * 支持发光、双色渐变、故障效果
 */

import * as THREE from 'three';

/**
 * 霓虹粒子顶点着色器
 */
export const neonParticleVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float alpha;
  attribute float glitchIntensity;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlitchIntensity;

  uniform float time;
  uniform float pixelRatio;
  uniform vec2 mousePos;

  void main() {
    vColor = customColor;
    vAlpha = alpha;
    vGlitchIntensity = glitchIntensity;

    vec3 pos = position;

    // 故障位移效果
    float glitch = sin(time * 10.0 + position.y * 5.0) * glitchIntensity;
    pos.x += glitch * 0.5;
    pos.z += glitch * 0.3;

    // 鼠标吸引效果
    vec3 toMouse = vec3(mousePos.x * 15.0, mousePos.y * 15.0, 0.0) - pos;
    float dist = length(toMouse);
    float attraction = smoothstep(10.0, 0.0, dist) * 0.3;
    pos += normalize(toMouse) * attraction;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // 脉动效果
    float pulse = sin(time * 3.0 + position.x * 0.5) * 0.2 + 1.0;

    // 根据距离调整大小
    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z) * pulse;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/**
 * 霓虹粒子片段着色器
 */
export const neonParticleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlitchIntensity;

  uniform float time;

  void main() {
    // 圆形粒子
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // 柔和边缘
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);

    // 霓虹发光核心
    float glow = exp(-dist * 2.5) * 1.5;

    // 故障闪烁
    float glitchFlicker = sin(time * 20.0 + gl_PointCoord.y * 100.0) * vGlitchIntensity * 0.3 + 1.0;

    // 扫描线效果
    float scanline = sin(gl_PointCoord.y * 50.0 + time * 2.0) * 0.1 + 0.9;

    // 最终颜色:霓虹发光
    vec3 finalColor = vColor * (1.0 + glow * 0.5);
    finalColor *= scanline * glitchFlicker;

    gl_FragColor = vec4(finalColor, alpha * vAlpha + glow * 0.3);
  }
`;

/**
 * 创建霓虹粒子材质
 */
export const createNeonParticleMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      mousePos: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: neonParticleVertexShader,
    fragmentShader: neonParticleFragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
  });
};
```

**Step 2: 验证文件创建**

检查文件确保所有代码正确写入

**Step 3: 提交**

```bash
git add components/Weather/shaders/cyberpunkShaders.ts
git commit -m "feat: add neon particle shaders for cyberpunk effects"
```

---

## Task 3: 创建赛博朋克粒子系统组件

**Files:**
- Create: `components/Weather/particles/CyberpunkParticleSystem.tsx`

**Step 1: 编写粒子系统组件代码**

创建文件并写入完整代码 (详见下方)

**代码太长,请创建以下完整组件:**
- 使用 InstancedMesh 或 Points 渲染 15,000 粒子
- 集成霓虹着色器
- 实现雨滴下落动画
- 添加鼠标交互吸引效果
- 性能优化

**Step 2: 测试组件渲染**

确保组件能正常导入和渲染

**Step 3: 提交**

```bash
git add components/Weather/particles/CyberpunkParticleSystem.tsx
git commit -m "feat: add cyberpunk particle system with mouse interaction"
```

---

## Task 4: 创建赛博朋克雨天效果

**Files:**
- Create: `components/Weather/effects/CyberRainEffect.tsx`

**Step 1: 编写赛博朋克雨天效果**

整合粒子系统、光源、后期处理

**Step 2: 测试效果渲染**

**Step 3: 提交**

---

## Task 5: 集成后期处理

**Files:**
- Modify: `components/Weather/WeatherScene.tsx`

**Step 1: 添加 Bloom 后期处理**

使用 @react-three/postprocessing 的 EffectComposer 和 BloomEffect

**Step 2: 调整Bloom参数**

```typescript
<Bloom
  intensity={2.0}
  luminanceThreshold={0.3}
  luminanceSmoothing={0.9}
  height={300}
/>
```

**Step 3: 测试光晕效果**

**Step 4: 提交**

---

## Task 6: 更新天气场景使用赛博朋克效果

**Files:**
- Modify: `components/Weather/WeatherScene.tsx`
- Modify: `components/Weather/WeatherClient.tsx`

**Step 1: 替换雨天效果**

将原来的 RainyEffect 替换为 CyberRainEffect

**Step 2: 测试完整流程**

确保天气页面能正确显示赛博朋克效果

**Step 3: 提交**

---

## Task 7: 性能测试与优化

**Files:**
- Test files only

**Step 1: 测试FPS**

运行应用并检查帧率

**Step 2: 调整粒子数量**

如果FPS低于30,适当减少粒子数

**Step 3: 提交优化**

---

## Task 8: 文档更新

**Files:**
- Modify: `docs/weather-feature.md`

**Step 1: 添加赛博朋克效果说明**

**Step 2: 提交文档**

---

## 验证清单

- [ ] 依赖包安装成功
- [ ] 霓虹着色器编译无错误
- [ ] 粒子系统正常渲染
- [ ] Bloom光晕效果明显
- [ ] 鼠标交互流畅
- [ ] FPS >= 30
- [ ] 视觉效果震撼

---

## 预期效果

完成MVP后,你将看到:
- 💜 青色和品红色的霓虹雨滴
- ✨ 强烈的发光效果和光晕
- 🖱️ 鼠标移动时粒子被吸引
- 🌧️ 赛博朋克风格的雨天场景

这将为后续完整实施奠定基础!
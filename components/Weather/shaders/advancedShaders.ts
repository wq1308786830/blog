/**
 * 高级粒子着色器材质
 * 支持发光、渐变、动态效果
 */

import * as THREE from 'three';

/**
 * 顶点着色器
 */
export const particleVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float alpha;
  attribute float speed;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vSpeed;

  uniform float time;
  uniform float pixelRatio;

  void main() {
    vColor = customColor;
    vAlpha = alpha;
    vSpeed = speed;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // 脉动效果
    float pulse = sin(time * speed + position.x * 0.5) * 0.3 + 1.0;

    // 根据距离调整大小
    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z) * pulse;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/**
 * 片段着色器
 */
export const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSpeed;

  uniform float time;
  uniform sampler2D pointTexture;

  void main() {
    // 圆形粒子
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // 柔和边缘
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

    // 发光效果
    float glow = exp(-dist * 3.0) * 0.5;

    // 动态颜色变化
    vec3 finalColor = vColor + vec3(glow * 0.3);

    // 闪烁效果
    float flicker = sin(time * vSpeed * 2.0) * 0.2 + 0.8;

    gl_FragColor = vec4(finalColor, alpha * vAlpha * flicker + glow);
  }
`;

/**
 * 创建高级粒子材质
 */
export const createAdvancedParticleMaterial = (
  time: number,
  texture?: THREE.Texture
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: time },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      pointTexture: { value: texture || createGlowTexture() },
    },
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
  });
};

/**
 * 创建发光粒子纹理
 */
export const createGlowTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);

  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
};

/**
 * 光束着色器 - 用于激光效果
 */
export const beamVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const beamFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform vec3 color;
  uniform float time;
  uniform float intensity;

  void main() {
    // 垂直渐变
    float gradient = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);

    // 波动效果
    float wave = sin(vPosition.y * 10.0 + time * 5.0) * 0.1 + 0.9;

    // 核心亮度
    float core = smoothstep(0.4, 0.5, 1.0 - abs(vUv.x - 0.5) * 2.0);

    vec3 finalColor = color * intensity * wave;
    float alpha = gradient * core * intensity;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * 创建光束材质
 */
export const createBeamMaterial = (color: THREE.Color, time: number): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: color },
      time: { value: time },
      intensity: { value: 1.0 },
    },
    vertexShader: beamVertexShader,
    fragmentShader: beamFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });
};

/**
 * 水波纹着色器
 */
export const rippleVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const rippleFragmentShader = `
  varying vec2 vUv;

  uniform float time;
  uniform vec3 color;
  uniform float speed;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);

    // 扩散波纹
    float ring1 = sin(dist * 20.0 - time * speed * 2.0) * 0.5 + 0.5;
    float ring2 = sin(dist * 30.0 - time * speed * 3.0) * 0.5 + 0.5;

    // 衰减
    float fade = 1.0 - smoothstep(0.0, 0.5, dist);

    float alpha = (ring1 * 0.6 + ring2 * 0.4) * fade * 0.8;

    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * 创建水波纹材质
 */
export const createRippleMaterial = (color: THREE.Color, time: number): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: time },
      color: { value: color },
      speed: { value: 1.0 },
    },
    vertexShader: rippleVertexShader,
    fragmentShader: rippleFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });
};

/**
 * 星空背景着色器
 */
export const starfieldVertexShader = `
  attribute float size;
  attribute float brightness;

  varying float vBrightness;

  uniform float time;

  void main() {
    vBrightness = brightness;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // 闪烁
    float twinkle = sin(time * 2.0 + position.x * 100.0 + position.y * 100.0) * 0.3 + 0.7;

    gl_PointSize = size * twinkle * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starfieldFragmentShader = `
  varying float vBrightness;

  uniform vec3 color;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

    gl_FragColor = vec4(color, alpha * vBrightness);
  }
`;

/**
 * 创建星空材质
 */
export const createStarfieldMaterial = (color: THREE.Color): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: color },
    },
    vertexShader: starfieldVertexShader,
    fragmentShader: starfieldFragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
  });
};
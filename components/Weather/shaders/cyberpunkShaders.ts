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
  gl_PointSize = size * pixelRatio * (150.0 / -mvPosition.z) * pulse;
  gl_Position = projectionMatrix * mvPosition;
}
`;

/**
 * 霓虹粒子片段着色器
 * 支持基于深度的线条渲染:近景线条,远景粒子
 */
export const neonParticleFragmentShader = `
varying vec3 vColor;
varying float vAlpha;
varying float vGlitchIntensity;

uniform float time;

void main() {
  // 圆形粒子基坐标
  vec2 center = gl_PointCoord - vec2(0.5);

  // 获取深度值 (归一化到 0-1 范围)
  float depth = gl_FragCoord.z;

  // 根据深度计算线条拉伸因子
  // 近景 (z < 0.3): 拉伸成线条
  // 远景 (z > 0.6): 保持圆形粒子
  float lineFactor = smoothstep(0.3, 0.7, depth);

  // 在 Y 方向拉伸创建线条效果
  vec2 stretched = center;
  stretched.y *= mix(5.0, 1.0, lineFactor); // 近景拉伸5倍,远景保持原样

  // 计算拉伸后的距离
  float stretchedDist = length(stretched);

  // 柔和边缘 (根据拉伸距离)
  float alpha = 1.0 - smoothstep(0.2, 0.5, stretchedDist);

  // 霓虹发光核心
  float glow = exp(-stretchedDist * 2.5) * 1.5;

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

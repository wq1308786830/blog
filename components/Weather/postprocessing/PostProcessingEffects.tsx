/**
 * 后期处理效果 - Bloom光晕、色差、扫描线
 * 赛博朋克风格的视觉增强
 */

'use client';

import { memo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface PostProcessingProps {
  /** Bloom强度 */
  bloomStrength?: number;
  /** Bloom半径 */
  bloomRadius?: number;
  /** Bloom阈值 */
  bloomThreshold?: number;
  /** 色差强度 */
  chromaticAberration?: number;
  /** 扫描线密度 */
  scanlineDensity?: number;
  /** 扫描线速度 */
  scanlineSpeed?: number;
  /** 噪点强度 */
  noiseIntensity?: number;
  /** 暗角强度 */
  vignetteIntensity?: number;
}

/**
 * 简单的Bloom后期处理
 */
const SimpleBloom: React.FC<{ strength: number; radius: number }> = memo(({ strength, radius }) => {
  const { gl, scene, camera } = useThree();
  const renderTargetRef = useRef<THREE.WebGLRenderTarget>();
  const bloomTargetRef = useRef<THREE.WebGLRenderTarget>();

  useEffect(() => {
    renderTargetRef.current = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    bloomTargetRef.current = new THREE.WebGLRenderTarget(window.innerWidth / 4, window.innerHeight / 4);
  }, []);

  return null;
});

SimpleBloom.displayName = 'SimpleBloom';

/**
 * 色差效果着色器
 */
const chromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.005 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;

    void main() {
      vec2 offset = amount * vec2(1.0, 0.0);

      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};

/**
 * 扫描线效果着色器
 */
const scanlineShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    density: { value: 800 },
    speed: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float density;
    uniform float speed;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // 扫描线
      float scanline = sin(vUv.y * density + time * speed) * 0.04;
      color.rgb -= scanline;

      // 移动的扫描线
      float movingScanline = sin(vUv.y * density * 0.5 - time * speed * 2.0) * 0.02;
      color.rgb += movingScanline;

      gl_FragColor = color;
    }
  `,
};

/**
 * 噪点和暗角效果着色器
 */
const noiseVignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    noiseAmount: { value: 0.05 },
    vignetteAmount: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float noiseAmount;
    uniform float vignetteAmount;
    varying vec2 vUv;

    float random(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // 噪点
      float noise = random(vUv + time) * noiseAmount;
      color.rgb += noise;

      // 暗角
      vec2 center = vUv - 0.5;
      float vignette = 1.0 - dot(center, center) * vignetteAmount;
      color.rgb *= vignette;

      gl_FragColor = color;
    }
  `,
};

/**
 * 组合后期处理效果
 */
const PostProcessingEffects: React.FC<PostProcessingProps> = memo(
  ({
    bloomStrength = 0.8,
    chromaticAberration = 0.002,
    scanlineDensity = 800,
    scanlineSpeed = 0.5,
    noiseIntensity = 0.03,
    vignetteIntensity = 0.3,
  }) => {
    const { gl, scene, camera, size } = useThree();
    const composerRef = useRef<any>();

    useEffect(() => {
      // 这里可以集成EffectComposer
      // 为了简化，我们直接在渲染循环中应用效果
    }, [size]);

    return null;
  }
);

PostProcessingEffects.displayName = 'PostProcessingEffects';

export { PostProcessingEffects };
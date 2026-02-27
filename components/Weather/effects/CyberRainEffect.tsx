/**
 * 赛博朋克阴雨天气效果 - 增强版
 * 实现要点：
 * 1. BufferGeometry + Points 高效渲染海量粒子
 * 2. 物理模拟：重力加速度 + 风力偏移
 * 3. 霓虹色彩 + 透明水滴纹理
 * 4. 碰撞溅射效果
 * 5. 鼠标交互系统
 */

'use client';

import { memo, useRef, useMemo, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface CyberRainEffectProps {
  intensity?: number;
  backgroundImage?: string;
  neonColor1?: string;      // 霓虹色 1
  neonColor2?: string;      // 霓虹色 2
  neonColor3?: string;      // 霓虹色 3
  enableMouseInteraction?: boolean; // 启用鼠标交互
}

// ==================== 鼠标追踪系统 ====================
class MouseTracker {
  public position = new THREE.Vector2(0, 0);
  public worldPosition = new THREE.Vector3(0, 0, 0);
  public velocity = new THREE.Vector2(0, 0);
  public lastPosition = new THREE.Vector2(0, 0);
  public isMoving = false;
  private lastMoveTime = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('touchmove', this.handleTouchMove);
    }
  }

  private handleMouseMove = (event: MouseEvent) => {
    const now = Date.now();
    this.lastPosition.copy(this.position);
    this.position.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.velocity.x = (this.position.x - this.lastPosition.x) / (now - this.lastMoveTime + 0.016);
    this.velocity.y = (this.position.y - this.lastPosition.y) / (now - this.lastMoveTime + 0.016);
    this.lastMoveTime = now;
    this.isMoving = true;
    setTimeout(() => { this.isMoving = false; }, 100);
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.lastPosition.copy(this.position);
      this.position.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.position.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      this.isMoving = true;
    }
  };

  updateWorldPosition(camera: THREE.Camera, sceneZ: number = -10) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.position, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -sceneZ);
    raycaster.ray.intersectPlane(plane, this.worldPosition);
  }

  dispose() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('touchmove', this.handleTouchMove);
    }
  }
}

let globalMouseTracker: MouseTracker | null = null;
const getMouseTracker = () => {
  if (!globalMouseTracker) {
    globalMouseTracker = new MouseTracker();
  }
  return globalMouseTracker;
};

// ==================== 创建雨滴纹理（真实泪滴形状） ====================
function createRaindropTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // 完全透明背景
  ctx.clearRect(0, 0, w, h);

  // 绘制真实雨滴形状：顶部尖锐，底部圆润饱满
  function drawRaindropPath(context: CanvasRenderingContext2D, centerX: number, centerY: number, width: number, height: number) {
    context.beginPath();
    // 从顶部尖端开始
    context.moveTo(centerX, centerY - height / 2);

    // 上半部分 - 较窄，形成尖端
    const upperControlX = centerX + width * 0.5;
    const upperY = centerY - height * 0.15;

    // 右侧上半曲线
    context.bezierCurveTo(
      upperControlX, upperY,
      centerX + width * 0.65, centerY,
      centerX + width * 0.65, centerY + height * 0.1
    );

    // 下半部分 - 圆润饱满（底部半圆）
    const bottomY = centerY + height / 2;
    // 右侧下半曲线（圆润）
    context.bezierCurveTo(
      centerX + width * 0.65, centerY + height * 0.35,
      centerX + width * 0.4, bottomY,
      centerX, bottomY
    );
    // 左侧下半曲线（圆润）
    context.bezierCurveTo(
      centerX - width * 0.4, bottomY,
      centerX - width * 0.65, centerY + height * 0.35,
      centerX - width * 0.65, centerY + height * 0.1
    );

    // 左侧上半曲线（回到尖端）
    context.bezierCurveTo(
      centerX - width * 0.65, centerY,
      centerX - width * 0.5, upperY,
      centerX, centerY - height / 2
    );

    context.closePath();
  }

  // 1. 内部填充 - 极淡的透明蓝色
  drawRaindropPath(ctx, cx, cy, w * 0.55, h * 0.9);
  const fillGrad = ctx.createRadialGradient(
    cx, cy - h * 0.15, 0,
    cx, cy + h * 0.1, h * 0.5
  );
  fillGrad.addColorStop(0, 'rgba(200, 230, 255, 0.08)');
  fillGrad.addColorStop(0.5, 'rgba(180, 220, 255, 0.12)');
  fillGrad.addColorStop(0.8, 'rgba(160, 210, 255, 0.08)');
  fillGrad.addColorStop(1, 'rgba(140, 200, 255, 0.02)');
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // 2. 外边缘轮廓 - 清晰的边缘线
  drawRaindropPath(ctx, cx, cy, w * 0.55, h * 0.9);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // 3. 内边缘高光
  drawRaindropPath(ctx, cx, cy, w * 0.45, h * 0.78);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. 上部主高光 - 模拟光源照射
  ctx.beginPath();
  ctx.ellipse(
    cx - w * 0.1,
    cy - h * 0.22,
    w * 0.06,
    h * 0.12,
    -0.25, 0, Math.PI * 2
  );
  const mainHighlight = ctx.createRadialGradient(
    cx - w * 0.1, cy - h * 0.22, 0,
    cx - w * 0.1, cy - h * 0.22, w * 0.08
  );
  mainHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  mainHighlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  mainHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = mainHighlight;
  ctx.fill();

  // 5. 细长高光条 - 沿左侧边缘
  ctx.beginPath();
  ctx.ellipse(
    cx - w * 0.22,
    cy - h * 0.05,
    w * 0.025,
    h * 0.28,
    0.15, 0, Math.PI * 2
  );
  const streakGrad = ctx.createLinearGradient(
    cx - w * 0.22, cy - h * 0.3,
    cx - w * 0.22, cy + h * 0.2
  );
  streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  streakGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  streakGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
  streakGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = streakGrad;
  ctx.fill();

  // 6. 底部反光点 - 圆润底部的反光
  ctx.beginPath();
  ctx.ellipse(
    cx + w * 0.12,
    cy + h * 0.28,
    w * 0.05,
    h * 0.06,
    0.3, 0, Math.PI * 2
  );
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fill();

  // 7. 折射光斑 - 内部的光线折射效果
  ctx.beginPath();
  ctx.ellipse(
    cx + w * 0.08,
    cy + h * 0.05,
    w * 0.12,
    h * 0.18,
    0.4, 0, Math.PI * 2
  );
  const causticGrad = ctx.createRadialGradient(
    cx + w * 0.08, cy + h * 0.05, 0,
    cx + w * 0.08, cy + h * 0.05, w * 0.15
  );
  causticGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  causticGrad.addColorStop(0.5, 'rgba(200, 230, 255, 0.1)');
  causticGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = causticGrad;
  ctx.fill();

  // 8. 顶部尖端微光
  ctx.beginPath();
  ctx.arc(cx, cy - h * 0.42, w * 0.04, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ==================== 全屏背景图 ====================
const FullScreenBackground: React.FC<{ imageUrl: string }> = memo(({ imageUrl }) => {
  const { camera, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [dimensions, setDimensions] = useState({ width: 50, height: 30 });

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        const imgAspect = tex.image.width / tex.image.height;
        const perspCamera = camera as THREE.PerspectiveCamera;
        const fov = perspCamera.fov * (Math.PI / 180);
        const distance = perspCamera.position.z;
        const visibleHeight = 2 * Math.tan(fov / 2) * distance;
        const visibleWidth = visibleHeight * (size.width / size.height);

        let width, height;
        const screenAspect = visibleWidth / visibleHeight;

        if (screenAspect > imgAspect) {
          width = visibleWidth * 1.05;
          height = width / imgAspect;
        } else {
          height = visibleHeight * 1.05;
          width = height * imgAspect;
        }

        setDimensions({ width, height });
        setTexture(tex);
      },
      undefined,
      () => console.warn('Failed to load background image')
    );
  }, [imageUrl, camera, size]);

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[dimensions.width, dimensions.height]} />
      <meshBasicMaterial map={texture} depthWrite={false} depthTest={true} />
    </mesh>
  );
});
FullScreenBackground.displayName = 'FullScreenBackground';

// ==================== 深色云朵层 ====================
const DarkClouds: React.FC<{ intensity: number }> = memo(({ intensity }) => {
  const cloudsRef = useRef<THREE.Group>(null);

  const cloudConfigs = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      position: [
        (Math.random() - 0.5) * 50,
        6 + Math.random() * 5,
        -3 + Math.random() * 3,
      ] as [number, number, number],
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        offset: [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2,
        ] as [number, number, number],
        scale: 1.5 + Math.random() * 2.5,
      })),
      speed: 0.06 + Math.random() * 0.1,
      opacity: 0.3 + Math.random() * 0.2,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!cloudsRef.current) return;
    cloudsRef.current.children.forEach((cloud, i) => {
      cloud.position.x += cloudConfigs[i].speed * delta * intensity;
      if (cloud.position.x > 30) cloud.position.x = -30;
    });
  });

  return (
    <group ref={cloudsRef}>
      {cloudConfigs.map((cloud, ci) => (
        <group key={ci} position={cloud.position}>
          {cloud.puffs.map((puff, pi) => (
            <mesh key={pi} position={puff.offset} scale={puff.scale}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial
                color="#1e2530"
                transparent
                opacity={cloud.opacity}
                roughness={1}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
});
DarkClouds.displayName = 'DarkClouds';

// ==================== 溅射粒子系统 ====================
interface SplashParticle {
  position: Float32Array;
  velocity: Float32Array;
  life: Float32Array;
  size: Float32Array;
  color: Float32Array;
}

export interface SplashParticleSystemRef {
  spawnSplash: (x: number, z: number, count: number) => void;
}

const SplashParticleSystem = memo(forwardRef<SplashParticleSystemRef, { intensity: number; neonColors: THREE.Color[] }>(({ intensity, neonColors }, ref) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 3000; // 溅射粒子数量

  const particles = useMemo<SplashParticle>(() => {
    const position = new Float32Array(particleCount * 3);
    const velocity = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);
    const size = new Float32Array(particleCount);
    const color = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // 初始位置在地面以下（隐藏）
      position[i3] = 9999;
      position[i3 + 1] = -9999;
      position[i3 + 2] = 9999;
      velocity[i3] = 0;
      velocity[i3 + 1] = 0;
      velocity[i3 + 2] = 0;
      life[i] = 0;
      size[i] = 0;

      const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
      color[i3] = randomColor.r;
      color[i3 + 1] = randomColor.g;
      color[i3 + 2] = randomColor.b;
    }

    return { position, velocity, life, size, color };
  }, [neonColors]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles.position, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(particles.size, 1));
    geo.setAttribute('aLife', new THREE.BufferAttribute(particles.life, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(particles.color, 3));
    return geo;
  }, [particles]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      },
      vertexShader: `
        precision highp float;
        in float aSize;
        in float aLife;
        in vec3 aColor;
        out float vLife;
        out vec3 vColor;

        void main() {
          vLife = aLife;
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float depth = max(-mvPosition.z, 1.0);
          float pointSize = aSize * (200.0 / depth);
          gl_PointSize = clamp(pointSize, 1.0, 64.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        in float vLife;
        in vec3 vColor;
        out vec4 fragColor;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          float edge = 1.0 - smoothstep(0.4, 0.5, dist);
          float alpha = edge * vLife * 0.8;

          // 霓虹发光效果
          float glow = exp(-dist * 3.0) * 0.5;

          if (alpha < 0.01) discard;
          fragColor = vec4(vColor + glow, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = particles.velocity;
    const lives = particles.life;
    const sizes = particles.size;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      if (lives[i] > 0) {
        // 更新粒子
        lives[i] -= delta * 2; // 生命周期减少

        // 应用重力
        velocities[i3 + 1] -= 15 * delta;

        // 更新位置
        positions[i3] += velocities[i3] * delta * intensity;
        positions[i3 + 1] += velocities[i3 + 1] * delta * intensity;
        positions[i3 + 2] += velocities[i3 + 2] * delta * intensity;

        // 根据生命调整大小
        sizes[i] = (0.05 + Math.random() * 0.03) * lives[i];

        // 生命结束，重置
        if (lives[i] <= 0 || positions[i3 + 1] < -12) {
          positions[i3] = 9999;
          positions[i3 + 1] = -9999;
          positions[i3 + 2] = 9999;
          sizes[i] = 0;
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.aSize.needsUpdate = true;
    pointsRef.current.geometry.attributes.aLife.needsUpdate = true;
  });

  // 暴露溅射生成方法
  useImperativeHandle(ref, () => ({
    spawnSplash: (x: number, z: number, count: number = 5) => {
      let spawned = 0;
      for (let i = 0; i < particleCount && spawned < count; i++) {
        if (particles.life[i] <= 0) {
          const i3 = i * 3;
          particles.position[i3] = x;
          particles.position[i3 + 1] = -10; // 地面高度
          particles.position[i3 + 2] = z;

          // 向上溅射速度
          particles.velocity[i3] = (Math.random() - 0.5) * 8;
          particles.velocity[i3 + 1] = 5 + Math.random() * 5;
          particles.velocity[i3 + 2] = (Math.random() - 0.5) * 8;

          particles.life[i] = 0.5 + Math.random() * 0.3;
          particles.size[i] = 0.05 + Math.random() * 0.05;

          spawned++;
        }
      }
    },
  }), [particles]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}));
SplashParticleSystem.displayName = 'SplashParticleSystem';

// ==================== 高性能雨滴粒子系统（增强版） ====================
interface RainParticle {
  position: Float32Array;
  velocity: Float32Array;
  size: Float32Array;
  opacity: Float32Array;
  color: Float32Array;
}

const RainParticleSystem: React.FC<{
  intensity: number;
  neonColors: THREE.Color[];
  enableMouseInteraction: boolean;
  onRaindropHit?: (x: number, z: number) => void;
}> = memo(({ intensity, neonColors, enableMouseInteraction, onRaindropHit }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const particleCount = 6000; // 减少粒子数量避免重叠
  const mouseTracker = useMemo(() => getMouseTracker(), []);

  // 纹理状态 - 确保在客户端创建
  const [raindropTexture, setRaindropTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    console.log('[CyberRainEffect] Creating raindrop texture...');
    const texture = createRaindropTexture();
    if (texture) {
      console.log('[CyberRainEffect] Raindrop texture created successfully');
      setRaindropTexture(texture);
    } else {
      console.error('[CyberRainEffect] Failed to create raindrop texture');
    }
  }, []);

  // 物理参数
  const physics = useMemo(() => ({
    gravity: 25,
    windStrength: 0.8,
    windDirection: 0.15,
    terminalVelocity: 35,
    mouseRepulsionRadius: 8,
    mouseRepulsionStrength: 50,
  }), []);

  // 初始化粒子数据
  const particles = useMemo<RainParticle>(() => {
    const position = new Float32Array(particleCount * 3);
    const velocity = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);
    const opacity = new Float32Array(particleCount);
    const color = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 增大分布范围，避免连线
      position[i3] = (Math.random() - 0.5) * 80;
      position[i3 + 1] = Math.random() * 40 - 10;
      position[i3 + 2] = (Math.random() - 0.5) * 60;

      velocity[i3] = (Math.random() - 0.5) * 2;
      velocity[i3 + 1] = -(15 + Math.random() * 15);
      velocity[i3 + 2] = (Math.random() - 0.5) * 1;

      const depth = position[i3 + 2];
      const depthFactor = 1.0 - (depth + 15) / 45; // 调整深度因子
      size[i] = (0.3 + Math.random() * 0.3) * depthFactor; // 增大雨滴尺寸
      opacity[i] = (0.6 + Math.random() * 0.3) * depthFactor; // 提高透明度

      // 霓虹颜色
      const colorIndex = Math.floor(Math.random() * neonColors.length);
      color[i3] = neonColors[colorIndex].r;
      color[i3 + 1] = neonColors[colorIndex].g;
      color[i3 + 2] = neonColors[colorIndex].b;
    }

    return { position, velocity, size, opacity, color };
  }, [neonColors]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles.position, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(particles.color, 3));
    // PointsMaterial 使用默认大小，不需要自定义 size 属性
    return geo;
  }, [particles]);

  const material = useMemo(() => {
    // 如果纹理还没准备好，返回 null
    if (!raindropTexture) return null;

    // 使用 PointsMaterial 简化测试
    return new THREE.PointsMaterial({
      size: 0.6,
      map: raindropTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
    });
  }, [raindropTexture]);

  // 动画循环
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = particles.velocity;

    // 更新鼠标世界坐标
    if (enableMouseInteraction) {
      mouseTracker.updateWorldPosition(camera, -10);
    }

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 应用重力加速度
      velocities[i3 + 1] -= physics.gravity * delta;

      // 限制终端速度
      if (velocities[i3 + 1] < -physics.terminalVelocity) {
        velocities[i3 + 1] = -physics.terminalVelocity;
      }

      // 应用风力
      const windNoise = Math.sin(i * 0.1 + state.clock.elapsedTime * 0.5) * physics.windStrength;
      velocities[i3] = physics.windDirection * physics.windStrength + windNoise * 0.1;

      // 鼠标交互 - 排斥力场
      if (enableMouseInteraction) {
        const dx = positions[i3] - mouseTracker.worldPosition.x;
        const dz = positions[i3 + 2] - mouseTracker.worldPosition.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < physics.mouseRepulsionRadius) {
          const force = (physics.mouseRepulsionRadius - dist) / physics.mouseRepulsionRadius;
          velocities[i3] += (dx / (dist + 0.01)) * force * physics.mouseRepulsionStrength * delta;
          velocities[i3 + 2] += (dz / (dist + 0.01)) * force * physics.mouseRepulsionStrength * delta;
        }
      }

      // 更新位置
      positions[i3] += velocities[i3] * delta * intensity;
      positions[i3 + 1] += velocities[i3 + 1] * delta * intensity;
      positions[i3 + 2] += velocities[i3 + 2] * delta * intensity;

      // 边界检测：落地后重置到顶部
      const prevY = positions[i3 + 1] - velocities[i3 + 1] * delta * intensity;
      if (prevY >= -10 && positions[i3 + 1] < -10) {
        // 触发溅射效果
        if (onRaindropHit) {
          onRaindropHit(positions[i3], positions[i3 + 2]);
        }
      }

      if (positions[i3 + 1] < -10) {
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = 25 + Math.random() * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 60;
        velocities[i3 + 1] = -(15 + Math.random() * 15);
        velocities[i3] = (Math.random() - 0.5) * 2;
        velocities[i3 + 2] = (Math.random() - 0.5) * 1;
      }

      // X 轴边界循环
      if (positions[i3] > 40) positions[i3] = -40;
      if (positions[i3] < -40) positions[i3] = 40;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // 如果材质还没准备好，不渲染
  if (!material) return null;

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});
RainParticleSystem.displayName = 'RainParticleSystem';

// ==================== 细雨层（远景） ====================
const FineRainLayer: React.FC<{ intensity: number; neonColors: THREE.Color[] }> = memo(({ intensity, neonColors }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 6000;

  const { positions, velocities, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = Math.random() * 30 - 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 8;
      velocities[i] = 12 + Math.random() * 8;
      sizes[i] = 0.04 + Math.random() * 0.06;

      const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
      colors[i3] = randomColor.r;
      colors[i3 + 1] = randomColor.g;
      colors[i3 + 2] = randomColor.b;
    }
    return { positions, velocities, sizes, colors };
  }, [neonColors]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      },
      vertexShader: `
        precision highp float;
        uniform float uPixelRatio;
        in float aSize;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          float depth = max(-mvPosition.z, 1.0);
          gl_PointSize = aSize * (200.0 / depth) * uPixelRatio;
        }
      `,
      fragmentShader: `
        precision highp float;
        out vec4 fragColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * 0.4;
          if (alpha < 0.01) discard;
          fragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 1] -= velocities[i] * intensity * delta;
      pos[i3] += Math.sin(i * 0.05) * 0.005;

      if (pos[i3 + 1] < -10) {
        pos[i3 + 1] = 25;
        pos[i3] = (Math.random() - 0.5) * 60;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});
FineRainLayer.displayName = 'FineRainLayer';

// ==================== 主组件 ====================
export const CyberRainEffect: React.FC<CyberRainEffectProps> = memo(
  ({
    intensity = 1,
    backgroundImage,
    neonColor1 = '#00ffff',
    neonColor2 = '#ff00ff',
    neonColor3 = '#00ff88',
    enableMouseInteraction = true,
  }) => {
    const neonColors = useMemo(() => [
      new THREE.Color(neonColor1),
      new THREE.Color(neonColor2),
      new THREE.Color(neonColor3),
    ], [neonColor1, neonColor2, neonColor3]);

    const splashSystemRef = useRef<SplashParticleSystemRef>(null);

    // 处理雨滴落地，触发溅射
    const handleRaindropHit = useCallback((x: number, z: number) => {
      const splash = splashSystemRef.current?.spawnSplash;
      if (splash && Math.random() < 0.3) { // 30% 概率触发溅射
        splash(x, z, 3 + Math.floor(Math.random() * 5));
      }
    }, []);

    return (
      <group>
        {/* 全屏背景图 */}
        {backgroundImage && <FullScreenBackground imageUrl={backgroundImage} />}

        {/* 深色云朵层 */}
        <DarkClouds intensity={intensity} />

        {/* 细雨层（远景） */}
        <FineRainLayer intensity={intensity} neonColors={neonColors} />

        {/* 主雨滴粒子系统 */}
        <RainParticleSystem
          intensity={intensity}
          neonColors={neonColors}
          enableMouseInteraction={enableMouseInteraction}
          onRaindropHit={handleRaindropHit}
        />

        {/* 溅射粒子系统 */}
        <SplashParticleSystem
          ref={splashSystemRef}
          intensity={intensity}
          neonColors={neonColors}
        />

        {/* 环境光 */}
        <ambientLight color="#1a1a2e" intensity={0.2} />

        {/* 霓虹环境光 */}
        <pointLight position={[0, 10, 0]} color={neonColor1} intensity={0.5} />
      </group>
    );
  }
);

CyberRainEffect.displayName = 'CyberRainEffect';

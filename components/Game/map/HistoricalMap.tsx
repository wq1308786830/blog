/**
 * 古风3D地形渲染组件
 * 水墨画风格的历史地图
 * 2.5D等轴视角
 */

'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import {
  FACTION_TERRITORIES,
  RIVERS,
  MOUNTAINS,
  MAP_BOUNDS,
  geoToMapCoord,
  generateTerrainHeightData,
  type GeoPoint,
} from '../data/geoData';

// ==================== Shader 定义 ====================

// 地形着色器 - 水墨风格
const terrainVertexShader = `
  varying vec2 vUv;
  varying float vHeight;
  varying vec3 vNormal;

  uniform float uTime;

  void main() {
    vUv = uv;
    vHeight = position.z;
    vNormal = normal;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
`;

const terrainFragmentShader = `
  varying vec2 vUv;
  varying float vHeight;
  varying vec3 vNormal;

  uniform float uTime;
  uniform sampler2D uPaperTexture;

  // 水墨效果颜色
  vec3 inkColor(float height) {
    // 平原 - 淡黄/米色（宣纸色）
    vec3 plainColor = vec3(0.95, 0.92, 0.85);
    // 山地 - 褐色
    vec3 mountainColor = vec3(0.55, 0.45, 0.35);
    // 深山 - 深棕色
    vec3 deepMountainColor = vec3(0.35, 0.28, 0.22);
    // 水域 - 淡青色
    vec3 waterColor = vec3(0.75, 0.85, 0.88);

    if (height < -0.05) {
      return waterColor;
    } else if (height < 0.1) {
      return mix(waterColor, plainColor, (height + 0.05) / 0.15);
    } else if (height < 0.4) {
      return mix(plainColor, mountainColor, (height - 0.1) / 0.3);
    } else {
      return mix(mountainColor, deepMountainColor, (height - 0.4) / 0.6);
    }
  }

  void main() {
    vec3 color = inkColor(vHeight);

    // 添加水墨晕染效果
    float noise = fract(sin(dot(vUv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.03;

    // 边缘做旧效果
    float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float edgeEffect = smoothstep(0.0, 0.1, edgeDist);
    color *= 0.9 + edgeEffect * 0.1;

    // 纸张纹理
    float paperNoise = fract(sin(dot(vUv * 200.0, vec2(127.1, 311.7))) * 43758.5453);
    color += (paperNoise - 0.5) * 0.02;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// 河流着色器
const riverVertexShader = `
  varying vec2 vUv;
  varying float vProgress;

  uniform float uTime;

  void main() {
    vUv = uv;
    vProgress = uTime * 0.1;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
`;

const riverFragmentShader = `
  varying vec2 vUv;
  varying float vProgress;

  uniform float uTime;

  void main() {
    // 淡青色河流
    vec3 riverColor = vec3(0.6, 0.75, 0.82);

    // 流动波纹效果
    float wave = sin((vUv.x + vProgress) * 20.0) * 0.5 + 0.5;
    riverColor += wave * 0.05;

    // 透明度渐变
    float alpha = 0.7;

    gl_FragColor = vec4(riverColor, alpha);
  }
`;

// ==================== 地形组件 ====================

interface TerrainProps {
  resolution?: number;
  size?: number;
}

const Terrain = ({ resolution = 128, size = 100 }: TerrainProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 生成地形几何体
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, resolution - 1, resolution - 1);
    const heightData = generateTerrainHeightData(resolution);

    const positions = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const idx = (i * resolution + j) * 3;
        // 注意：heightData 的行是按纬度从北到南存储
        const height = heightData.heights[i]?.[j] ?? 0;
        positions[idx + 2] = height * 3; // z轴为高度
      }
    }

    geo.computeVertexNormals();
    return geo;
  }, [resolution, size]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPaperTexture: { value: null },
    }),
    []
  );

  // 动画更新
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ==================== 河流组件 ====================

const Rivers = () => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 生成河流几何体
  const riverGeometries = useMemo(() => {
    return RIVERS.map((river) => {
      const points: THREE.Vector3[] = [];
      const width = river.width * 0.3;

      river.points.forEach((point) => {
        const coord = geoToMapCoord(point, MAP_BOUNDS);
        points.push(new THREE.Vector3(coord.x, 0.05, -coord.y));
      });

      // 创建管道几何体模拟河流
      const curve = new THREE.CatmullRomCurve3(points);
      return {
        id: river.id,
        name: river.name,
        geometry: new THREE.TubeGeometry(curve, 64, width, 8, false),
      };
    });
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={groupRef}>
      {riverGeometries.map(({ id, name, geometry }) => (
        <mesh key={id} geometry={geometry} position={[0, 0.1, 0]}>
          <shaderMaterial
            vertexShader={riverVertexShader}
            fragmentShader={riverFragmentShader}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// ==================== 势力边界组件 ====================

const FactionBorders = () => {
  const bordersRef = useRef<THREE.Group>(null);

  // 生成边界线
  const borderLines = useMemo(() => {
    const lines: { id: string; points: THREE.Vector3[]; color: string }[] = [];

    FACTION_TERRITORIES.forEach((territory) => {
      territory.borders.forEach((border) => {
        const points = border.points.map((point) => {
          const coord = geoToMapCoord(point, MAP_BOUNDS);
          return new THREE.Vector3(coord.x, 0.2, -coord.y);
        });

        // 闭合边界
        if (points.length > 0) {
          points.push(points[0].clone());
        }

        lines.push({
          id: `${territory.id}-${border.id}`,
          points,
          color: territory.color,
        });
      });
    });

    return lines;
  }, []);

  return (
    <group ref={bordersRef}>
      {borderLines.map(({ id, points, color }) => {
        if (points.length < 2) return null;

        return (
          <Line
            key={id}
            points={points}
            color={color}
            lineWidth={2}
            opacity={0.8}
            transparent
          />
        );
      })}
    </group>
  );
};

// ==================== 都城标记组件 ====================

const CapitalMarkers = () => {
  const markersRef = useRef<THREE.Group>(null);

  const capitals = useMemo(() => {
    return FACTION_TERRITORIES.map((territory) => {
      const coord = geoToMapCoord(territory.capital, MAP_BOUNDS);
      return {
        id: territory.id,
        name: territory.name,
        position: [coord.x, 0.5, -coord.y] as [number, number, number],
        color: territory.color,
        isCapital: true,
      };
    });
  }, []);

  return (
    <group ref={markersRef}>
      {capitals.map(({ id, name, position, color }) => (
        <group key={id} position={position}>
          {/* 城池基座 */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 1, 0.3, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>

          {/* 城池主体 */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.5, 0.7, 0.5, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>

          {/* 塔尖 */}
          <mesh position={[0, 0.8, 0]}>
            <coneGeometry args={[0.3, 0.4, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>

          {/* 发光效果 */}
          <pointLight color={color} intensity={0.5} distance={5} decay={2} />
        </group>
      ))}
    </group>
  );
};

// ==================== 山脉标记组件 ====================

const MountainMarkers = () => {
  const mountainsRef = useRef<THREE.Group>(null);

  const mountainMarkers = useMemo(() => {
    const markers: { id: string; position: [number, number, number]; scale: number }[] = [];

    MOUNTAINS.forEach((mountain) => {
      mountain.centerPoints.forEach((center, idx) => {
        const coord = geoToMapCoord(center, MAP_BOUNDS);
        markers.push({
          id: `${mountain.id}-${idx}`,
          position: [coord.x, 0, -coord.y],
          scale: mountain.radius * 1.5,
        });
      });
    });

    return markers;
  }, []);

  return (
    <group ref={mountainsRef}>
      {mountainMarkers.map(({ id, position, scale }) => (
        <mesh key={id} position={position} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
          <coneGeometry args={[scale * 0.5, scale, 4]} />
          <meshStandardMaterial
            color="#5a4a3a"
            emissive="#3a2a2a"
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

// ==================== 主组件 ====================

interface HistoricalMapProps {
  onTerritoryClick?: (factionId: string) => void;
  selectedFactionId?: string | null;
}

const HistoricalMap = ({ onTerritoryClick, selectedFactionId }: HistoricalMapProps) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* 环境光 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 50, 25]} intensity={0.8} castShadow />

      {/* 地形 */}
      <Terrain resolution={100} size={110} />

      {/* 河流 */}
      <Rivers />

      {/* 山脉 */}
      <MountainMarkers />

      {/* 势力边界 */}
      <FactionBorders />

      {/* 都城标记 */}
      <CapitalMarkers />

      {/* 地图边框 */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[112, 112]} />
        <meshStandardMaterial color="#f5f0e6" />
      </mesh>
    </group>
  );
};

export { HistoricalMap };
export default HistoricalMap;
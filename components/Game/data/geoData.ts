/**
 * 春秋战国时期地理数据
 * 包含诸侯国边界、河流、山脉等地理信息
 * 坐标系：以中国中心为原点，单位为度（经纬度偏移量）
 */

// ==================== 类型定义 ====================

export interface GeoPoint {
  lng: number; // 经度偏移
  lat: number; // 纬度偏移
}

export interface GeoPolygon {
  id: string;
  name: string;
  points: GeoPoint[];
  type: 'land' | 'water' | 'mountain';
}

export interface RiverPath {
  id: string;
  name: string;
  points: GeoPoint[];
  width: number; // 相对宽度
}

export interface MountainRange {
  id: string;
  name: string;
  centerPoints: GeoPoint[];
  radius: number; // 影响范围
  height: number; // 相对高度
}

export interface FactionTerritory {
  id: string;
  name: string;
  factionId: string;
  color: string;
  borders: GeoPolygon[];
  capital: GeoPoint;
}

export interface TerrainHeightData {
  // 地形高度网格 (简化版，用于3D渲染)
  resolution: number;
  bounds: {
    minLng: number;
    maxLng: number;
    minLat: number;
    maxLat: number;
  };
  heights: number[][]; // 二维数组，按纬度行存储
}

// ==================== 势力领土数据 ====================

export const FACTION_TERRITORIES: FactionTerritory[] = [
  {
    id: 'territory-qin',
    name: '秦国',
    factionId: 'faction-qin',
    color: '#00f5ff',
    borders: [
      {
        id: 'qin-main',
        name: '秦本土',
        points: [
          { lng: -12, lat: 5 },
          { lng: -8, lat: 8 },
          { lng: -3, lat: 6 },
          { lng: -2, lat: 2 },
          { lng: -5, lat: -2 },
          { lng: -10, lat: -3 },
          { lng: -14, lat: 0 },
          { lng: -15, lat: 3 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: -10, lat: 2 },
  },
  {
    id: 'territory-qi',
    name: '齐国',
    factionId: 'faction-qi',
    color: '#ff0066',
    borders: [
      {
        id: 'qi-main',
        name: '齐地',
        points: [
          { lng: 18, lat: 10 },
          { lng: 22, lat: 12 },
          { lng: 26, lat: 10 },
          { lng: 28, lat: 6 },
          { lng: 26, lat: 2 },
          { lng: 22, lat: 3 },
          { lng: 18, lat: 5 },
          { lng: 17, lat: 8 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 23, lat: 7 },
  },
  {
    id: 'territory-chu',
    name: '楚国',
    factionId: 'faction-chu',
    color: '#ff6600',
    borders: [
      {
        id: 'chu-main',
        name: '楚地',
        points: [
          { lng: -2, lat: -5 },
          { lng: 5, lat: -3 },
          { lng: 12, lat: -6 },
          { lng: 18, lat: -10 },
          { lng: 15, lat: -15 },
          { lng: 8, lat: -18 },
          { lng: 0, lat: -16 },
          { lng: -5, lat: -12 },
          { lng: -6, lat: -8 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 5, lat: -10 },
  },
  {
    id: 'territory-yan',
    name: '燕国',
    factionId: 'faction-yan',
    color: '#ff0000',
    borders: [
      {
        id: 'yan-main',
        name: '燕地',
        points: [
          { lng: 10, lat: 18 },
          { lng: 16, lat: 20 },
          { lng: 20, lat: 18 },
          { lng: 22, lat: 14 },
          { lng: 18, lat: 12 },
          { lng: 12, lat: 13 },
          { lng: 10, lat: 15 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 15, lat: 17 },
  },
  {
    id: 'territory-zhao',
    name: '赵国',
    factionId: 'faction-zhao',
    color: '#ffcc00',
    borders: [
      {
        id: 'zhao-main',
        name: '赵地',
        points: [
          { lng: 2, lat: 12 },
          { lng: 8, lat: 14 },
          { lng: 14, lat: 12 },
          { lng: 15, lat: 8 },
          { lng: 10, lat: 6 },
          { lng: 5, lat: 7 },
          { lng: 2, lat: 9 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 8, lat: 10 },
  },
  {
    id: 'territory-wei',
    name: '魏国',
    factionId: 'faction-wei',
    color: '#00ff66',
    borders: [
      {
        id: 'wei-main',
        name: '魏地',
        points: [
          { lng: 0, lat: 8 },
          { lng: 5, lat: 10 },
          { lng: 10, lat: 7 },
          { lng: 12, lat: 3 },
          { lng: 8, lat: 0 },
          { lng: 3, lat: 1 },
          { lng: 0, lat: 4 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 5, lat: 5 },
  },
  {
    id: 'territory-han',
    name: '韩国',
    factionId: 'faction-han',
    color: '#0066ff',
    borders: [
      {
        id: 'han-main',
        name: '韩地',
        points: [
          { lng: 0, lat: 3 },
          { lng: 4, lat: 5 },
          { lng: 7, lat: 2 },
          { lng: 5, lat: -2 },
          { lng: 1, lat: -1 },
          { lng: -2, lat: 1 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 3, lat: 2 },
  },
  {
    id: 'territory-zhou',
    name: '周王室',
    factionId: 'faction-zhou',
    color: '#FFD700',
    borders: [
      {
        id: 'zhou-main',
        name: '王畿',
        points: [
          { lng: -1, lat: 6 },
          { lng: 3, lat: 7 },
          { lng: 4, lat: 4 },
          { lng: 2, lat: 2 },
          { lng: -1, lat: 3 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 1, lat: 5 },
  },
  {
    id: 'territory-song',
    name: '宋国',
    factionId: 'faction-song',
    color: '#cc99ff',
    borders: [
      {
        id: 'song-main',
        name: '宋地',
        points: [
          { lng: 8, lat: 2 },
          { lng: 12, lat: 4 },
          { lng: 15, lat: 2 },
          { lng: 14, lat: -2 },
          { lng: 10, lat: -3 },
          { lng: 7, lat: 0 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 11, lat: 1 },
  },
  {
    id: 'territory-lu',
    name: '鲁国',
    factionId: 'faction-lu',
    color: '#99ff99',
    borders: [
      {
        id: 'lu-main',
        name: '鲁地',
        points: [
          { lng: 16, lat: 5 },
          { lng: 20, lat: 6 },
          { lng: 22, lat: 3 },
          { lng: 20, lat: 0 },
          { lng: 16, lat: 1 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 19, lat: 3 },
  },
  {
    id: 'territory-wu',
    name: '吴国',
    factionId: 'faction-wu',
    color: '#00ffff',
    borders: [
      {
        id: 'wu-main',
        name: '吴地',
        points: [
          { lng: 20, lat: -2 },
          { lng: 25, lat: 0 },
          { lng: 28, lat: -3 },
          { lng: 26, lat: -8 },
          { lng: 22, lat: -7 },
          { lng: 19, lat: -4 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 24, lat: -3 },
  },
  {
    id: 'territory-yue',
    name: '越国',
    factionId: 'faction-yue',
    color: '#ff99cc',
    borders: [
      {
        id: 'yue-main',
        name: '越地',
        points: [
          { lng: 22, lat: -8 },
          { lng: 28, lat: -6 },
          { lng: 30, lat: -12 },
          { lng: 26, lat: -16 },
          { lng: 22, lat: -14 },
          { lng: 20, lat: -10 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: 26, lat: -10 },
  },
  {
    id: 'territory-ba',
    name: '巴国',
    factionId: 'faction-ba',
    color: '#cccccc',
    borders: [
      {
        id: 'ba-main',
        name: '巴地',
        points: [
          { lng: -8, lat: -8 },
          { lng: -3, lat: -6 },
          { lng: 0, lat: -10 },
          { lng: -2, lat: -14 },
          { lng: -7, lat: -13 },
          { lng: -10, lat: -11 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: -4, lat: -10 },
  },
  {
    id: 'territory-shu',
    name: '蜀国',
    factionId: 'faction-shu',
    color: '#888888',
    borders: [
      {
        id: 'shu-main',
        name: '蜀地',
        points: [
          { lng: -14, lat: -10 },
          { lng: -9, lat: -8 },
          { lng: -6, lat: -12 },
          { lng: -8, lat: -18 },
          { lng: -13, lat: -17 },
          { lng: -16, lat: -14 },
        ],
        type: 'land',
      },
    ],
    capital: { lng: -11, lat: -13 },
  },
];

// ==================== 河流数据 ====================

export const RIVERS: RiverPath[] = [
  {
    id: 'yellow-river',
    name: '黄河',
    width: 3,
    points: [
      { lng: -15, lat: 10 },
      { lng: -10, lat: 9 },
      { lng: -3, lat: 11 },
      { lng: 3, lat: 8 },
      { lng: 8, lat: 10 },
      { lng: 15, lat: 6 },
      { lng: 22, lat: 5 },
      { lng: 28, lat: 3 },
    ],
  },
  {
    id: 'yangtze-river',
    name: '长江',
    width: 4,
    points: [
      { lng: -12, lat: -8 },
      { lng: -5, lat: -6 },
      { lng: 5, lat: -8 },
      { lng: 12, lat: -10 },
      { lng: 20, lat: -8 },
      { lng: 28, lat: -12 },
    ],
  },
  {
    id: 'huai-river',
    name: '淮河',
    width: 2,
    points: [
      { lng: 0, lat: 0 },
      { lng: 8, lat: -1 },
      { lng: 16, lat: -3 },
      { lng: 22, lat: -2 },
    ],
  },
  {
    id: 'han-river',
    name: '汉水',
    width: 2,
    points: [
      { lng: -5, lat: 2 },
      { lng: 0, lat: -4 },
      { lng: 5, lat: -8 },
    ],
  },
  {
    id: 'wei-river',
    name: '渭水',
    width: 2,
    points: [
      { lng: -14, lat: 4 },
      { lng: -10, lat: 3 },
      { lng: -6, lat: 5 },
    ],
  },
];

// ==================== 山脉数据 ====================

export const MOUNTAINS: MountainRange[] = [
  {
    id: 'qinling',
    name: '秦岭',
    centerPoints: [
      { lng: -8, lat: 0 },
      { lng: -4, lat: 1 },
      { lng: 0, lat: 0 },
      { lng: 4, lat: -1 },
    ],
    radius: 2,
    height: 1.0,
  },
  {
    id: 'taihang',
    name: '太行山',
    centerPoints: [
      { lng: 0, lat: 10 },
      { lng: 2, lat: 8 },
      { lng: 4, lat: 6 },
      { lng: 6, lat: 4 },
    ],
    radius: 1.5,
    height: 0.8,
  },
  {
    id: 'yanshan',
    name: '燕山',
    centerPoints: [
      { lng: 12, lat: 16 },
      { lng: 16, lat: 17 },
      { lng: 20, lat: 16 },
    ],
    radius: 1.5,
    height: 0.6,
  },
  {
    id: 'wushan',
    name: '巫山',
    centerPoints: [
      { lng: -2, lat: -8 },
      { lng: 0, lat: -10 },
      { lng: 2, lat: -12 },
    ],
    radius: 1.5,
    height: 0.7,
  },
  {
    id: 'dabashan',
    name: '大巴山',
    centerPoints: [
      { lng: -10, lat: -6 },
      { lng: -8, lat: -8 },
      { lng: -6, lat: -10 },
    ],
    radius: 1.5,
    height: 0.7,
  },
  {
    id: 'wuyishan',
    name: '武夷山',
    centerPoints: [
      { lng: 18, lat: -12 },
      { lng: 20, lat: -14 },
      { lng: 22, lat: -16 },
    ],
    radius: 1.2,
    height: 0.5,
  },
];

// ==================== 地图边界 ====================

export const MAP_BOUNDS = {
  minLng: -20,
  maxLng: 35,
  minLat: -22,
  maxLat: 25,
};

// ==================== 辅助函数 ====================

/**
 * 将地理坐标转换为地图坐标
 */
export function geoToMapCoord(geo: GeoPoint, bounds: typeof MAP_BOUNDS): { x: number; y: number } {
  const width = bounds.maxLng - bounds.minLng;
  const height = bounds.maxLat - bounds.minLat;
  return {
    x: ((geo.lng - bounds.minLng) / width) * 100 - 50,
    y: ((bounds.maxLat - geo.lat) / height) * 100 - 50,
  };
}

/**
 * 获取点是否在多边形内部
 */
export function isPointInPolygon(point: GeoPoint, polygon: GeoPoint[]): boolean {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    const intersect =
      ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * 生成地形高度数据
 */
export function generateTerrainHeightData(resolution: number = 100): TerrainHeightData {
  const { minLng, maxLng, minLat, maxLat } = MAP_BOUNDS;
  const heights: number[][] = [];

  const lngStep = (maxLng - minLng) / resolution;
  const latStep = (maxLat - minLat) / resolution;

  for (let latIdx = 0; latIdx < resolution; latIdx++) {
    const row: number[] = [];
    const lat = maxLat - latIdx * latStep;

    for (let lngIdx = 0; lngIdx < resolution; lngIdx++) {
      const lng = minLng + lngIdx * lngStep;
      let height = 0;

      // 检查山脉影响
      for (const mountain of MOUNTAINS) {
        for (const center of mountain.centerPoints) {
          const dist = Math.sqrt(
            Math.pow(lng - center.lng, 2) + Math.pow(lat - center.lat, 2)
          );
          if (dist < mountain.radius * 2) {
            const influence = Math.max(0, 1 - dist / (mountain.radius * 2));
            height += influence * mountain.height;
          }
        }
      }

      // 检查河流降低高度
      for (const river of RIVERS) {
        for (const point of river.points) {
          const dist = Math.sqrt(
            Math.pow(lng - point.lng, 2) + Math.pow(lat - point.lat, 2)
          );
          if (dist < river.width * 0.5) {
            height = Math.min(height, -0.1);
          }
        }
      }

      row.push(Math.max(-0.2, Math.min(1, height)));
    }
    heights.push(row);
  }

  return {
    resolution,
    bounds: MAP_BOUNDS,
    heights,
  };
}

export default {
  FACTION_TERRITORIES,
  RIVERS,
  MOUNTAINS,
  MAP_BOUNDS,
  geoToMapCoord,
  isPointInPolygon,
  generateTerrainHeightData,
};
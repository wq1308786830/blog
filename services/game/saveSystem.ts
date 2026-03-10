/**
 * 存档系统
 * 处理游戏保存和加载
 */

import type { GameState, PlayerState } from '../../components/Game/types/gameTypes';

// 存档数据接口
export interface SaveData {
  version: string;
  savedAt: number;
  gameState: GameState;
  playerState: PlayerState;
  metadata: {
    turn: number;
    year: number;
    phase: string;
    factionName: string;
    territoryCount: number;
    playTime: number;
  };
}

// 存档槽位
export interface SaveSlot {
  id: string;
  name: string;
  saveData: SaveData | null;
  isEmpty: boolean;
}

// 存档版本（用于兼容性检查）
export const SAVE_VERSION = '1.0.0';

// 本地存储键名
const SAVE_KEY_PREFIX = 'warring_states_save_';
const QUICK_SAVE_KEY = 'warring_states_quick_save';
const AUTO_SAVE_KEY = 'warring_states_auto_save';
const SETTINGS_KEY = 'warring_states_settings';

// 检查浏览器是否支持本地存储
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// 保存游戏
export function saveGame(
  slotId: string,
  gameState: GameState,
  playerState: PlayerState,
  saveName?: string
): { success: boolean; message: string } {
  if (!isLocalStorageAvailable()) {
    return { success: false, message: '浏览器不支持本地存储' };
  }

  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      gameState,
      playerState,
      metadata: {
        turn: gameState.turn,
        year: gameState.year,
        phase: gameState.phase,
        factionName: playerState.name,
        territoryCount: playerState.controlledTerritories.length,
        playTime: playerState.totalPlayTime,
      },
    };

    const key = `${SAVE_KEY_PREFIX}${slotId}`;
    localStorage.setItem(key, JSON.stringify(saveData));

    // 更新存档列表
    updateSaveList(slotId, saveName || `存档 ${slotId}`, saveData);

    return { success: true, message: '保存成功' };
  } catch (error) {
    console.error('Save game failed:', error);
    return { success: false, message: '保存失败: ' + (error as Error).message };
  }
}

// 加载游戏
export function loadGame(slotId: string): {
  success: boolean;
  data?: SaveData;
  message: string;
} {
  if (!isLocalStorageAvailable()) {
    return { success: false, message: '浏览器不支持本地存储' };
  }

  try {
    const key = `${SAVE_KEY_PREFIX}${slotId}`;
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return { success: false, message: '存档不存在' };
    }

    const saveData: SaveData = JSON.parse(savedData);

    // 版本检查
    if (saveData.version !== SAVE_VERSION) {
      console.warn(`Save version mismatch: ${saveData.version} vs ${SAVE_VERSION}`);
      // 尝试迁移数据
      const migratedData = migrateSaveData(saveData);
      if (migratedData) {
        return { success: true, data: migratedData, message: '存档已迁移' };
      }
    }

    return { success: true, data: saveData, message: '加载成功' };
  } catch (error) {
    console.error('Load game failed:', error);
    return { success: false, message: '加载失败: ' + (error as Error).message };
  }
}

// 快速保存
export function quickSave(
  gameState: GameState,
  playerState: PlayerState
): { success: boolean; message: string } {
  return saveGame('quick', gameState, playerState, '快速存档');
}

// 快速加载
export function quickLoad(): {
  success: boolean;
  data?: SaveData;
  message: string;
} {
  return loadGame('quick');
}

// 自动保存
export function autoSave(
  gameState: GameState,
  playerState: PlayerState
): { success: boolean; message: string } {
  return saveGame('auto', gameState, playerState, '自动存档');
}

// 自动加载
export function autoLoad(): {
  success: boolean;
  data?: SaveData;
  message: string;
} {
  return loadGame('auto');
}

// 获取所有存档槽位
export function getSaveSlots(): SaveSlot[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  const slots: SaveSlot[] = [];

  // 获取存档列表
  const saveListStr = localStorage.getItem(`${SAVE_KEY_PREFIX}list`);
  const saveList = saveListStr ? JSON.parse(saveListStr) : {};

  // 遍历所有可能的存档槽
  for (let i = 1; i <= 10; i++) {
    const slotId = i.toString();
    const key = `${SAVE_KEY_PREFIX}${slotId}`;
    const savedData = localStorage.getItem(key);

    slots.push({
      id: slotId,
      name: saveList[slotId]?.name || `存档 ${slotId}`,
      saveData: savedData ? JSON.parse(savedData) : null,
      isEmpty: !savedData,
    });
  }

  return slots;
}

// 删除存档
export function deleteSave(slotId: string): { success: boolean; message: string } {
  if (!isLocalStorageAvailable()) {
    return { success: false, message: '浏览器不支持本地存储' };
  }

  try {
    const key = `${SAVE_KEY_PREFIX}${slotId}`;
    localStorage.removeItem(key);

    // 更新存档列表
    const saveListStr = localStorage.getItem(`${SAVE_KEY_PREFIX}list`);
    const saveList = saveListStr ? JSON.parse(saveListStr) : {};
    delete saveList[slotId];
    localStorage.setItem(`${SAVE_KEY_PREFIX}list`, JSON.stringify(saveList));

    return { success: true, message: '删除成功' };
  } catch (error) {
    return { success: false, message: '删除失败: ' + (error as Error).message };
  }
}

// 更新存档列表
function updateSaveList(slotId: string, name: string, saveData: SaveData): void {
  const saveListStr = localStorage.getItem(`${SAVE_KEY_PREFIX}list`);
  const saveList = saveListStr ? JSON.parse(saveListStr) : {};

  saveList[slotId] = {
    name,
    savedAt: saveData.savedAt,
    turn: saveData.metadata.turn,
  };

  localStorage.setItem(`${SAVE_KEY_PREFIX}list`, JSON.stringify(saveList));
}

// 数据迁移
function migrateSaveData(oldData: SaveData): SaveData | null {
  // 简单的迁移逻辑
  try {
    // 确保必要字段存在
    return {
      ...oldData,
      version: SAVE_VERSION,
      gameState: {
        ...oldData.gameState,
        // 添加可能缺少的新字段
        isPaused: oldData.gameState.isPaused ?? false,
        lastSavedAt: Date.now(),
      },
      playerState: {
        ...oldData.playerState,
        totalPlayTime: oldData.playerState.totalPlayTime || 0,
      },
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return null;
  }
}

// 导出存档到文件
export function exportSaveToFile(
  gameState: GameState,
  playerState: PlayerState
): void {
  const saveData: SaveData = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    gameState,
    playerState,
    metadata: {
      turn: gameState.turn,
      year: gameState.year,
      phase: gameState.phase,
      factionName: playerState.name,
      territoryCount: playerState.controlledTerritories.length,
      playTime: playerState.totalPlayTime,
    },
  };

  const dataStr = JSON.stringify(saveData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `warring_states_save_${gameState.turn}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// 从文件导入存档
export function importSaveFromFile(file: File): Promise<{
  success: boolean;
  data?: SaveData;
  message: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const saveData: SaveData = JSON.parse(event.target?.result as string);

        // 验证存档数据
        if (!saveData.gameState || !saveData.playerState) {
          resolve({ success: false, message: '无效的存档文件' });
          return;
        }

        resolve({ success: true, data: saveData, message: '导入成功' });
      } catch (error) {
        resolve({ success: false, message: '解析失败: ' + (error as Error).message });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, message: '读取文件失败' });
    };

    reader.readAsText(file);
  });
}

// 存档设置
export interface SaveSettings {
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // 回合数
  quickSaveEnabled: boolean;
  maxAutoSaves: number;
}

export const DEFAULT_SAVE_SETTINGS: SaveSettings = {
  autoSaveEnabled: true,
  autoSaveInterval: 5,
  quickSaveEnabled: true,
  maxAutoSaves: 3,
};

// 加载设置
export function loadSettings(): SaveSettings {
  if (!isLocalStorageAvailable()) {
    return DEFAULT_SAVE_SETTINGS;
  }

  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SAVE_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Load settings failed:', error);
  }

  return DEFAULT_SAVE_SETTINGS;
}

// 保存设置
export function saveSettings(settings: SaveSettings): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Save settings failed:', error);
  }
}

// 清除所有存档
export function clearAllSaves(): { success: boolean; message: string } {
  if (!isLocalStorageAvailable()) {
    return { success: false, message: '浏览器不支持本地存储' };
  }

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SAVE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    return { success: true, message: '所有存档已清除' };
  } catch (error) {
    return { success: false, message: '清除失败: ' + (error as Error).message };
  }
}

export default {
  saveGame,
  loadGame,
  quickSave,
  quickLoad,
  autoSave,
  autoLoad,
  getSaveSlots,
  deleteSave,
  exportSaveToFile,
  importSaveFromFile,
  loadSettings,
  saveSettings,
  clearAllSaves,
  isLocalStorageAvailable,
  SAVE_VERSION,
  DEFAULT_SAVE_SETTINGS,
};

/**
 * 玩家状态管理
 */

'use client';

import { useReducer, useCallback } from 'react';
import type {
  PlayerState,
  Resources,
  CampaignProgress,
} from '../types/gameTypes';
import { GamePhase } from '../types/gameTypes';

// 玩家动作类型
export type PlayerAction =
  | { type: 'INIT_PLAYER'; payload: Partial<PlayerState> }
  | { type: 'UPDATE_RESOURCES'; payload: Partial<Resources> }
  | { type: 'ADD_TERRITORY'; payload: string }
  | { type: 'REMOVE_TERRITORY'; payload: string }
  | { type: 'ADD_ARMY'; payload: string }
  | { type: 'REMOVE_ARMY'; payload: string }
  | { type: 'RECRUIT_HERO'; payload: string }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: { id: string; progress: number } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_CAMPAIGN'; payload: Partial<CampaignProgress> }
  | { type: 'ADD_PLAY_TIME'; payload: number }
  | { type: 'RESET_PLAYER' };

// 初始资源状态
export const initialResources: Resources = {
  population: 1000,
  food: 500,
  gold: 200,
  wood: 100,
  iron: 50,
  prestige: 10,
};

// 初始玩家状态
export const initialPlayerState: PlayerState = {
  id: 'player-1',
  name: '玩家',
  factionId: 'faction-player',
  resources: initialResources,
  controlledTerritories: [],
  armies: [],
  recruitedHeroes: [],
  achievements: [],
  totalPlayTime: 0,
  currentCampaignProgress: {
    phase: GamePhase.EARLY_ZHOU,
    objectives: [],
    completedObjectives: [],
  },
};

// 玩家状态 Reducer
export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'INIT_PLAYER':
      return {
        ...initialPlayerState,
        ...action.payload,
      };

    case 'UPDATE_RESOURCES':
      return {
        ...state,
        resources: {
          ...state.resources,
          ...action.payload,
        },
      };

    case 'ADD_TERRITORY':
      if (state.controlledTerritories.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        controlledTerritories: [...state.controlledTerritories, action.payload],
      };

    case 'REMOVE_TERRITORY':
      return {
        ...state,
        controlledTerritories: state.controlledTerritories.filter(
          (id) => id !== action.payload
        ),
      };

    case 'ADD_ARMY':
      if (state.armies.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        armies: [...state.armies, action.payload],
      };

    case 'REMOVE_ARMY':
      return {
        ...state,
        armies: state.armies.filter((id) => id !== action.payload),
      };

    case 'RECRUIT_HERO':
      if (state.recruitedHeroes.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        recruitedHeroes: [...state.recruitedHeroes, action.payload],
      };

    case 'UPDATE_ACHIEVEMENT': {
      const { id, progress } = action.payload;
      const updatedAchievements = state.achievements.map((a) =>
        a.id === id ? { ...a, progress: Math.min(progress, a.maxProgress) } : a
      );
      return {
        ...state,
        achievements: updatedAchievements,
      };
    }

    case 'UNLOCK_ACHIEVEMENT': {
      const achievementId = action.payload;
      const updatedAchievements = state.achievements.map((a) =>
        a.id === achievementId && !a.unlockedAt
          ? { ...a, unlockedAt: Date.now() }
          : a
      );
      return {
        ...state,
        achievements: updatedAchievements,
      };
    }

    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        currentCampaignProgress: {
          ...state.currentCampaignProgress,
          ...action.payload,
        },
      };

    case 'ADD_PLAY_TIME':
      return {
        ...state,
        totalPlayTime: state.totalPlayTime + action.payload,
      };

    case 'RESET_PLAYER':
      return initialPlayerState;

    default:
      return state;
  }
}

// 自定义 Hook 用于玩家状态管理
export function usePlayerState() {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);

  // 计算资源上限
  const getResourceLimit = useCallback((resourceType: keyof Resources): number => {
    const baseLimits: Record<keyof Resources, number> = {
      population: 10000,
      food: 5000,
      gold: 2000,
      wood: 2000,
      iron: 1000,
      prestige: 1000,
    };

    // 根据控制的领地增加上限
    const territoryBonus = state.controlledTerritories.length * 0.1;
    return Math.floor(baseLimits[resourceType] * (1 + territoryBonus));
  }, [state.controlledTerritories.length]);

  // 检查资源是否足够
  const hasEnoughResources = useCallback((required: Partial<Resources>): boolean => {
    return Object.entries(required).every(([key, value]) => {
      const resourceKey = key as keyof Resources;
      return state.resources[resourceKey] >= (value || 0);
    });
  }, [state.resources]);

  // 消耗资源
  const consumeResources = useCallback((cost: Partial<Resources>) => {
    if (!hasEnoughResources(cost)) {
      return false;
    }

    const newResources: Partial<Resources> = {};
    Object.entries(cost).forEach(([key, value]) => {
      const resourceKey = key as keyof Resources;
      newResources[resourceKey] = state.resources[resourceKey] - (value || 0);
    });

    dispatch({ type: 'UPDATE_RESOURCES', payload: newResources });
    return true;
  }, [state.resources, hasEnoughResources]);

  // 增加资源
  const addResources = useCallback((gain: Partial<Resources>) => {
    const newResources: Partial<Resources> = {};
    Object.entries(gain).forEach(([key, value]) => {
      const resourceKey = key as keyof Resources;
      const limit = getResourceLimit(resourceKey);
      newResources[resourceKey] = Math.min(
        state.resources[resourceKey] + (value || 0),
        limit
      );
    });

    dispatch({ type: 'UPDATE_RESOURCES', payload: newResources });
  }, [state.resources, getResourceLimit]);

  return {
    state,
    dispatch,
    getResourceLimit,
    hasEnoughResources,
    consumeResources,
    addResources,
  };
}

export default usePlayerState;

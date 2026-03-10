/**
 * 游戏状态管理
 * 使用 useReducer 管理复杂游戏状态
 */

'use client';

import { useReducer, useEffect, useCallback } from 'react';
import type {
  GameState,
  GameAction,
  DiplomaticRelation,
} from '../types/gameTypes';
import {
  GamePhase,
  TerritoryStatus,
  ArmyStatus,
} from '../types/gameTypes';

// 初始游戏状态
export const initialGameState: GameState = {
  phase: GamePhase.EARLY_ZHOU,
  turn: 1,
  year: -770, // 周平王东迁，春秋开始
  playerId: 'player-1',
  territories: [],
  armies: [],
  heroes: [],
  events: [],
  diplomaticRelations: [],
  gameLog: [],
  settings: {
    autoSave: true,
    autoSaveInterval: 5,
    difficulty: 'normal',
    soundEnabled: true,
  },
  isPaused: false,
  lastSavedAt: null,
};

// 游戏状态 Reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...initialGameState,
        ...action.payload,
        lastSavedAt: Date.now(),
      };

    case 'LOAD_GAME':
      return {
        ...action.payload,
        isPaused: false,
      };

    case 'SAVE_GAME':
      return {
        ...state,
        lastSavedAt: Date.now(),
      };

    case 'NEXT_TURN': {
      const newYear = state.year + (state.phase === GamePhase.EARLY_ZHOU ? 1 : 0.5);
      return {
        ...state,
        turn: state.turn + 1,
        year: Math.floor(newYear * 10) / 10,
      };
    }

    case 'UPDATE_TERRITORY': {
      const updatedTerritories = state.territories.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload.data } : t
      );
      return {
        ...state,
        territories: updatedTerritories,
      };
    }

    case 'CONQUER_TERRITORY': {
      const { territoryId, conquerorId } = action.payload as { territoryId: string; conquerorId: string };
      const updatedTerritories = state.territories.map((t) =>
        t.id === territoryId
          ? {
              ...t,
              ownerId: conquerorId,
              status: TerritoryStatus.OCCUPIED,
              conqueredAt: Date.now(),
            }
          : t
      );
      return {
        ...state,
        territories: updatedTerritories,
      };
    }

    case 'MOVE_ARMY': {
      const { armyId, targetTerritoryId } = action.payload;
      const updatedArmies = state.armies.map((a) =>
        a.id === armyId
          ? {
              ...a,
              targetTerritoryId,
              status: ArmyStatus.MOVING,
            }
          : a
      );
      return {
        ...state,
        armies: updatedArmies,
      };
    }

    case 'RECRUIT_HERO': {
      const { hero, territoryId } = action.payload;
      const heroWithLocation = {
        ...hero,
        locationId: territoryId,
        recruitedAt: Date.now(),
      };
      return {
        ...state,
        heroes: [...state.heroes, heroWithLocation],
      };
    }

    case 'START_BATTLE':
      return state;

    case 'END_BATTLE':
      return state;

    case 'TRIGGER_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
      };

    case 'CHOOSE_EVENT_OPTION':
      return state;

    case 'UPDATE_DIPLOMACY': {
      const { faction1Id, faction2Id, status } = action.payload;
      const existingRelationIndex = state.diplomaticRelations.findIndex(
        (r) =>
          (r.faction1Id === faction1Id && r.faction2Id === faction2Id) ||
          (r.faction1Id === faction2Id && r.faction2Id === faction1Id)
      );

      let updatedRelations: DiplomaticRelation[];
      if (existingRelationIndex >= 0) {
        updatedRelations = [...state.diplomaticRelations];
        updatedRelations[existingRelationIndex] = {
          ...updatedRelations[existingRelationIndex],
          status,
          updatedAt: Date.now(),
        };
      } else {
        updatedRelations = [
          ...state.diplomaticRelations,
          {
            id: `diplomacy-${Date.now()}`,
            faction1Id,
            faction2Id,
            status,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ];
      }

      return {
        ...state,
        diplomaticRelations: updatedRelations,
      };
    }

    case 'ADD_LOG':
      return {
        ...state,
        gameLog: [
          {
            id: `log-${Date.now()}`,
            timestamp: Date.now(),
            turn: state.turn,
            year: state.year,
            message: action.payload.message,
            type: action.payload.type || 'info',
          },
          ...state.gameLog.slice(0, 99), // 保留最近100条日志
        ],
      };

    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: !state.isPaused,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'RESET_GAME':
      return initialGameState;

    // 额外动作类型
    case 'ADVANCE_TURN': {
      const newYear = state.year + (state.phase === GamePhase.EARLY_ZHOU ? 1 : 0.5);
      return {
        ...state,
        turn: state.turn + 1,
        year: Math.floor(newYear * 10) / 10,
      };
    }

    case 'CHANGE_PHASE':
      return {
        ...state,
        phase: action.payload,
      };

    case 'RESOLVE_EVENT':
      return state;

    case 'UPDATE_PLAYER':
      return state;

    case 'CREATE_ARMY':
      return {
        ...state,
        armies: [...state.armies, action.payload],
      };

    case 'UPDATE_ARMY': {
      const updatedArmies = state.armies.map((a) =>
        a.id === action.payload.id ? { ...a, ...action.payload.data } : a
      );
      return {
        ...state,
        armies: updatedArmies,
      };
    }

    case 'DISBAND_ARMY': {
      const updatedArmies = state.armies.filter((a) => a.id !== action.payload);
      return {
        ...state,
        armies: updatedArmies,
      };
    }

    case 'ASSIGN_HERO':
      return state;

    default:
      return state;
  }
}

// 自定义 Hook 用于游戏状态管理
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // 自动保存
  useEffect(() => {
    if (state.settings.autoSave && state.lastSavedAt && !state.isPaused) {
      const saveData = JSON.stringify(state);
      localStorage.setItem('warringStatesGame_save', saveData);
    }
  }, [state.turn, state.settings.autoSave, state.isPaused]);

  // 加载存档
  const loadGame = useCallback(() => {
    const savedData = localStorage.getItem('warringStatesGame_save');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as GameState;
        dispatch({ type: 'LOAD_GAME', payload: parsed });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  // 手动保存
  const saveGame = useCallback(() => {
    dispatch({ type: 'SAVE_GAME' });
    const saveData = JSON.stringify(state);
    localStorage.setItem('warringStatesGame_save', saveData);
  }, [state]);

  // 检查是否有存档
  const hasSaveGame = useCallback(() => {
    return localStorage.getItem('warringStatesGame_save') !== null;
  }, []);

  return {
    state,
    dispatch,
    loadGame,
    saveGame,
    hasSaveGame,
  };
}

export default useGameState;

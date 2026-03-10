/**
 * 游戏状态提供者
 * 提供游戏状态和玩家状态给子组件
 */

'use client';

import { createContext, useContext, ReactNode, type ActionDispatch } from 'react';
import { useGameState } from './state/GameState';
import { usePlayerState } from './state/PlayerState';
import type { GameState, GameAction, PlayerState, Resources } from './types/gameTypes';
import type { PlayerAction } from './state/PlayerState';

// 游戏上下文类型
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  playerState: PlayerState;
  playerDispatch: ActionDispatch<[action: PlayerAction]>;
  hasEnoughResources: (required: Partial<Resources>) => boolean;
  consumeResources: (cost: Partial<Resources>) => boolean;
  addResources: (gain: Partial<Resources>) => void;
}

// 创建上下文
const GameContext = createContext<GameContextType | null>(null);

// 使用游戏的 Hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// 游戏提供者组件
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const { state, dispatch } = useGameState();
  const {
    state: playerState,
    dispatch: playerDispatch,
    hasEnoughResources,
    consumeResources,
    addResources,
  } = usePlayerState();

  const value: GameContextType = {
    state,
    dispatch,
    playerState,
    playerDispatch,
    hasEnoughResources,
    consumeResources,
    addResources,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameProvider;

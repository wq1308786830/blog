/**
 * 游戏菜单组件
 */

'use client';

import { memo, useEffect } from 'react';
import './gameMenu.css';

interface GameMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
}

const GameMenu = memo(({ isOpen, onClose, onSave, onLoad, onReset }: GameMenuProps) => {
  // ESC键关闭菜单
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="game-menu-overlay" onClick={onClose}>
      <div className="game-menu" onClick={(e) => e.stopPropagation()}>
        <h2 className="game-menu-title">游戏菜单</h2>

        <div className="game-menu-items">
          <button className="game-menu-item" onClick={onSave}>
            <span className="menu-icon">💾</span>
            <span className="menu-label">保存游戏</span>
          </button>

          <button className="game-menu-item" onClick={onLoad}>
            <span className="menu-icon">📂</span>
            <span className="menu-label">加载游戏</span>
          </button>

          <button className="game-menu-item" onClick={onReset}>
            <span className="menu-icon">🔄</span>
            <span className="menu-label">重新开始</span>
          </button>

          <button className="game-menu-item" onClick={onClose}>
            <span className="menu-icon">▶️</span>
            <span className="menu-label">继续游戏</span>
          </button>
        </div>

        <button className="game-menu-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
});

GameMenu.displayName = 'GameMenu';

export { GameMenu };
export default GameMenu;

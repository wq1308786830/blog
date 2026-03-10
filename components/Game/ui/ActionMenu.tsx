/**
 * 行动菜单组件
 */

'use client';

import { memo } from 'react';
import './actionMenu.css';

interface ActionMenuProps {
  activeView: 'map' | 'diplomacy' | 'heroes' | 'tech';
  onViewChange: (view: 'map' | 'diplomacy' | 'heroes' | 'tech') => void;
}

const ActionMenu = memo(({ activeView, onViewChange }: ActionMenuProps) => {
  const menuItems = [
    { id: 'map', label: '地图', icon: '🗺️' },
    { id: 'diplomacy', label: '外交', icon: '🤝' },
    { id: 'heroes', label: '武将', icon: '⚔️' },
    { id: 'tech', label: '科技', icon: '🔬' },
  ] as const;

  return (
    <div className="action-menu">
      <h3 className="action-menu-title">功能菜单</h3>
      <div className="action-menu-list">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`action-menu-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="action-menu-icon">{item.icon}</span>
            <span className="action-menu-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

ActionMenu.displayName = 'ActionMenu';

export { ActionMenu };
export default ActionMenu;

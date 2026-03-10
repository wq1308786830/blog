/**
 * 地图控制组件
 * 提供缩放、重置、攻击模式等控制功能
 */

'use client';

import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './mapControls.css';

interface MapControlsProps {
  // 缩放控制
  scale?: number;
  minScale?: number;
  maxScale?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;

  // 攻击模式
  attackMode?: boolean;
  canAttack?: boolean;
  onToggleAttackMode?: () => void;

  // 其他控制
  showGrid?: boolean;
  onToggleGrid?: () => void;

  // 位置
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  // 方向
  vertical?: boolean;
}

// 缩放级别指示器
interface ZoomIndicatorProps {
  scale: number;
  minScale: number;
  maxScale: number;
}

const ZoomIndicator = memo(({ scale, minScale, maxScale }: ZoomIndicatorProps) => {
  const percentage = ((scale - minScale) / (maxScale - minScale)) * 100;

  return (
    <div className="zoom-indicator">
      <div className="zoom-bar">
        <div
          className="zoom-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="zoom-value">{Math.round(scale * 100)}%</span>
    </div>
  );
});

ZoomIndicator.displayName = 'ZoomIndicator';

const MapControls = memo(({
  scale = 1,
  minScale = 0.5,
  maxScale = 4,
  onZoomIn,
  onZoomOut,
  onReset,
  attackMode = false,
  canAttack = false,
  onToggleAttackMode,
  showGrid = false,
  onToggleGrid,
  position = 'top-right',
  vertical = true,
}: MapControlsProps) => {
  // 处理按钮点击
  const handleZoomIn = useCallback(() => {
    onZoomIn?.();
  }, [onZoomIn]);

  const handleZoomOut = useCallback(() => {
    onZoomOut?.();
  }, [onZoomOut]);

  const handleReset = useCallback(() => {
    onReset?.();
  }, [onReset]);

  const handleToggleAttack = useCallback(() => {
    onToggleAttackMode?.();
  }, [onToggleAttackMode]);

  const handleToggleGrid = useCallback(() => {
    onToggleGrid?.();
  }, [onToggleGrid]);

  // 位置样式
  const positionClass = `map-controls-${position}`;
  const directionClass = vertical ? 'vertical' : 'horizontal';

  return (
    <div className={`map-controls-wrapper ${positionClass} ${directionClass}`}>
      {/* 缩放控制组 */}
      <div className="controls-group zoom-controls">
        <button
          className="control-button zoom-in"
          onClick={handleZoomIn}
          disabled={scale >= maxScale}
          title="放大"
          aria-label="放大地图"
        >
          <span className="button-icon">+</span>
        </button>

        <ZoomIndicator scale={scale} minScale={minScale} maxScale={maxScale} />

        <button
          className="control-button zoom-out"
          onClick={handleZoomOut}
          disabled={scale <= minScale}
          title="缩小"
          aria-label="缩小地图"
        >
          <span className="button-icon">−</span>
        </button>
      </div>

      {/* 分隔线 */}
      <div className="controls-divider" />

      {/* 重置按钮 */}
      <button
        className="control-button reset"
        onClick={handleReset}
        title="重置视图"
        aria-label="重置地图视图"
      >
        <span className="button-icon">⟲</span>
      </button>

      {/* 网格切换 */}
      {onToggleGrid && (
        <button
          className={`control-button grid-toggle ${showGrid ? 'active' : ''}`}
          onClick={handleToggleGrid}
          title={showGrid ? '隐藏网格' : '显示网格'}
          aria-label={showGrid ? '隐藏网格' : '显示网格'}
        >
          <span className="button-icon">▦</span>
        </button>
      )}

      {/* 攻击模式按钮 */}
      {canAttack && onToggleAttackMode && (
        <>
          <div className="controls-divider" />
          <motion.button
            className={`control-button attack-mode ${attackMode ? 'active' : ''}`}
            onClick={handleToggleAttack}
            title={attackMode ? '取消攻击' : '攻击模式'}
            aria-label={attackMode ? '取消攻击模式' : '进入攻击模式'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-icon">⚔️</span>
            <AnimatePresence>
              {attackMode && (
                <motion.span
                  className="attack-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        </>
      )}

      {/* 攻击模式提示 */}
      <AnimatePresence>
        {attackMode && (
          <motion.div
            className="attack-hint"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="hint-icon">⚔️</span>
            <span className="hint-text">点击目标领地发起攻击</span>
            <button
              className="hint-close"
              onClick={handleToggleAttack}
              aria-label="关闭攻击模式"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MapControls.displayName = 'MapControls';

export { MapControls };
export default MapControls;
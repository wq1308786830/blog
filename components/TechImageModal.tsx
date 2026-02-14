'use client';

import React, { memo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { TechImageModalProps } from '@/types';

/**
 * React 19 优化的技术图片模态框组件
 */
export const TechImageModal = memo<TechImageModalProps>(({ isOpen, onClose, src, alt }) => {
  // React 19 优化的键盘事件处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // React 19 优化的点击外部关闭
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // 键盘事件监听和滚动锁定
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

    // Modal content
  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" 
        onClick={handleBackdropClick}
      >
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 243, 255, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 4px, 6px 100%' 
          }} 
        />
      </div>

      {/* 模态框容器 */}
      <div className="relative w-full max-w-6xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HUD 装饰 - 四角 */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[var(--primary)]" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[var(--primary)]" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[var(--primary)]" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[var(--primary)]" />

        {/* 头部 HUD */}
        <div className="bg-black/80 border border-[var(--primary)] p-1 backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-center bg-[rgba(0,243,255,0.1)] px-4 py-2 border-b border-[var(--primary)] mb-1">
            <div className="flex items-center gap-4">
              <span className="text-[var(--primary)] font-mono text-xs tracking-widest animate-pulse">● LIVE_FEED</span>
              <h2 
                id="modal-title"
                className="text-[var(--text)] font-mono text-sm uppercase"
              >
                [{alt}]
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[var(--muted)] font-mono text-xs">
              <span>ZOOM: 100%</span>
              <button 
                onClick={onClose} 
                className="hover:text-[var(--accent)] hover:bg-white/10 px-2 py-1 transition-colors uppercase"
                aria-label="关闭图片查看器"
              >
                [CLOSE_VIEWER]
              </button>
            </div>
          </div>

          {/* 图片容器 */}
          <div className="relative aspect-video w-full bg-black/50 flex items-center justify-center p-4 overflow-hidden group">
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto h-auto object-contain shadow-[0_0_30px_rgba(0,243,255,0.2)]"
              priority
              quality={95}
            />
            
            {/* 扫描线动画 */}
            <div 
              className="absolute inset-0 pointer-events-none animate-scan"
              style={{ 
                background: 'linear-gradient(to bottom, transparent, rgba(0,243,255,0.3) 50%, transparent)',
                backgroundSize: '100% 150%',
                opacity: 0.3
              }} 
            />
          </div>

          {/* 底部 HUD */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-[var(--primary)] bg-black/90">
            <div className="text-[10px] text-[var(--muted)] font-mono">
              COORDS: {Math.random().toFixed(4)}, {Math.random().toFixed(4)} // ENCRYPTION: NONE
            </div>
            <div className="text-[10px] text-[var(--primary)] font-mono animate-pulse">
              SYSTEM_READY
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal in browser, direct render in test environment
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
});

TechImageModal.displayName = 'TechImageModal';

// 保持向后兼容的默认导出
export default TechImageModal;

'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TechImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export default function TechImageModal({ isOpen, onClose, src, alt }: TechImageModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use portal to render at document root level to ensure it's above everything
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with scanlines */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 243, 255, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
               backgroundSize: '100% 4px, 6px 100%' 
             }} 
        />
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HUD Decoration - Corners */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[var(--primary)]" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[var(--primary)]" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[var(--primary)]" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[var(--primary)]" />

        {/* Header HUD */}
        <div className="bg-black/80 border border-[var(--primary)] p-1 backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-center bg-[rgba(0,243,255,0.1)] px-4 py-2 border-b border-[var(--primary)] mb-1">
            <div className="flex items-center gap-4">
               <span className="text-[var(--primary)] font-mono text-xs tracking-widest animate-pulse">● LIVE_FEED</span>
               <span className="text-[var(--text)] font-mono text-sm uppercase">[{alt}]</span>
            </div>
            <div className="flex items-center gap-4 text-[var(--muted)] font-mono text-xs">
               <span>ZOOM: 100%</span>
               <button onClick={onClose} className="hover:text-[var(--accent)] hover:bg-white/10 px-2 py-1 transition-colors uppercase">
                 [CLOSE_VIEWER]
               </button>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative aspect-video w-full bg-black/50 flex items-center justify-center p-4 overflow-hidden group">
            <img 
              src={src} 
              alt={alt} 
              className="max-h-[80vh] w-auto h-auto object-contain shadow-[0_0_30px_rgba(0,243,255,0.2)]"
            />
            
            {/* Scanning Line Animation */}
            <div 
              className="absolute inset-0 pointer-events-none animate-scan"
              style={{ 
                background: 'linear-gradient(to bottom, transparent, rgba(0,243,255,0.3) 50%, transparent)',
                backgroundSize: '100% 150%',
                opacity: 0.3
              }} 
            />
          </div>

          {/* Footer HUD */}
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
    </div>,
    document.body
  );
}

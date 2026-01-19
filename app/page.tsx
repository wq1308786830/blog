'use client';

import React, { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TechImageModal } from '@/components/TechImageModal';

// 图片常量 - 使用 Next.js 16 的静态导入优化
const IMAGES = {
  faceLeft: '/imgs/home/NDk2MDg0NjE1.jpeg',
  russell: '/imgs/home/Bertrand_Russell.jpg',
  program: '/imgs/home/language_map.png',
  frontend: '/imgs/home/frontend_map.png',
} as const;

// 图片数据类型
interface ImageData {
  src: string;
  alt: string;
}

/**
 * Hero 图片组件 - React 19 优化的 memo 组件
 */
const HeroImage = memo<{
  src: string;
  alt: string;
  label: string;
  color: string;
  onClick: (src: string, alt: string) => void;
}>(({ src, alt, label, color, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(src, alt);
  }, [src, alt, onClick]);

  return (
    <div className="cyber-border p-1 bg-black/60 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500">
      <div className="relative overflow-hidden group cursor-pointer" onClick={handleClick}>
        <Image
          src={src}
          alt={alt}
          width={300}
          height={300}
          className="w-full grayscale group-hover:grayscale-0 transition-all duration-500"
          priority={alt === 'Blackhole'} // 优先加载第一张图片
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs font-mono text-[var(--primary)] translate-y-full group-hover:translate-y-0 transition-transform">
          TARGET: {label}
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center px-1">
        <span className="text-[10px] uppercase text-[var(--muted)]">{label}_MODE</span>
        <span className={`w-2 h-2 bg-[${color}] rounded-full animate-blink`} />
      </div>
    </div>
  );
});

HeroImage.displayName = 'HeroImage';

/**
 * 地图卡片组件 - React 19 优化
 */
const MapCard = memo<{
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  dataSet: string;
  color: string;
  onImageClick: (src: string, alt: string) => void;
}>(({ title, description, imageSrc, imageAlt, dataSet, color, onImageClick }) => {
  const handleImageClick = useCallback(() => {
    onImageClick(imageSrc, imageAlt);
  }, [imageSrc, imageAlt, onImageClick]);

  return (
    <div className={`group relative border border-[var(--border)] bg-[rgba(0,10,20,0.8)] p-6 hover:border-[${color}] transition-colors duration-300`}>
      <div className={`absolute top-0 right-0 px-2 py-1 bg-[var(--border)] text-[10px] text-black font-bold group-hover:bg-[${color}]`}>
        {dataSet}
      </div>
      <div className="mb-4">
        <h4 className={`text-xl text-[var(--text)] mb-2 group-hover:text-[${color}] transition-colors`}>
          {title}
        </h4>
        <p className="text-sm text-[var(--muted)]">{description}</p>
      </div>
      <div 
        className="relative overflow-hidden border border-[var(--border)] h-48 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={handleImageClick}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className={`bg-black/70 border border-[${color}] text-[${color}] px-3 py-1 text-xs font-mono tracking-widest backdrop-blur-sm`}>
            [ EXPAND_VIEW ]
          </span>
        </div>
      </div>
    </div>
  );
});

MapCard.displayName = 'MapCard';

/**
 * React 19 优化的主页组件
 */
export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);

  // React 19 优化的事件处理器
  const openModal = useCallback((src: string, alt: string) => {
    setCurrentImage({ src, alt });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setCurrentImage(null);
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col p-4 md:p-10 max-w-7xl mx-auto gap-20">
      
      {/* React 19 条件渲染优化 */}
      {currentImage && (
        <TechImageModal 
          isOpen={modalOpen} 
          onClose={closeModal} 
          src={currentImage.src} 
          alt={currentImage.alt} 
        />
      )}
      
      {/* HUD Header */}
      <header className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <div className="flex flex-col">
          <span className="text-[var(--primary)] text-xs tracking-[0.2em] animate-pulse">SYSTEM_ONLINE</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            RUSSELL<span className="text-[var(--primary)]">.LOG</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-4 text-xs font-mono">
          <div className="flex flex-col items-end text-[var(--muted)]">
            <span>LOCATION: EARTH</span>
            <span>STATUS: CURIOSITY_ACTIVE</span>
          </div>
          <div className="w-10 h-10 border border-[var(--primary)] flex items-center justify-center animate-spin">
            <div className="w-6 h-6 border-t-2 border-[var(--primary)] rounded-full" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-8 relative">
          <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-[var(--border)]">
            <div className="absolute top-0 left-0 w-1 h-20 bg-[var(--primary)]" />
          </div>
          
          <div className="space-y-4">
            <p className="text-[var(--primary)] font-mono text-sm">[ INPUT_SOURCE: USER_MIND ]</p>
            <h2 className="text-4xl md:text-6xl uppercase leading-none font-display cyber-glitch" data-text="思考、写作、构建">
              思考、写作、构建
            </h2>
            <h2 className="text-2xl md:text-4xl uppercase text-[var(--muted)]">
              让想法<span className="text-[var(--accent)]">落地</span>
            </h2>
          </div>

          <p className="text-lg md:text-xl max-w-lg border-l-2 border-[var(--gray)] pl-4 text-[var(--text)] opacity-80">
            &gt; 喜欢思考，热爱知识，也喜欢把灵感做成可以分享的作品。<br/>
            &gt; 这里记录<span className="text-[var(--primary)]">前端</span>、<span className="text-[var(--accent)]">后端</span>、以及哲学与人文的思考痕迹_
          </p>

          <div className="flex gap-6">
            <Link 
              href="/category" 
              className="group relative px-8 py-3 bg-[rgba(0,243,255,0.1)] border border-[var(--primary)] text-[var(--primary)] font-bold uppercase tracking-widest overflow-hidden hover:bg-[var(--primary)] hover:text-black transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                INITIATE_READ <span className="text-xl">&rarr;</span>
              </span>
              <div className="absolute inset-0 bg-[var(--primary)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
            </Link>
            <a 
              href="#maps" 
              className="px-8 py-3 border border-[var(--muted)] text-[var(--muted)] uppercase tracking-widest hover:border-[var(--text)] hover:text-[var(--text)] transition-all"
            >
              ACCESS_MAPS
            </a>
          </div>
        </div>

        {/* Hero Visuals - React 19 优化 */}
        <div className="relative">
          <div className="absolute -inset-4 bg-[var(--primary)] opacity-20 blur-2xl rounded-full animate-pulse" />
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <HeroImage
              src={IMAGES.faceLeft}
              alt="Blackhole"
              label="UNIVERSE"
              color="var(--primary)"
              onClick={openModal}
            />
            <div className="mt-8">
              <HeroImage
                src={IMAGES.russell}
                alt="Russell"
                label="REASON"
                color="var(--accent)"
                onClick={openModal}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Maps Section - React 19 优化 */}
      <section id="maps" className="py-20 space-y-10 w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-[var(--border)]" />
          <h3 className="text-2xl font-mono text-[var(--primary)]">&lt; KNOWLEDGE_DATABASE /&gt;</h3>
          <div className="h-[1px] flex-1 bg-[var(--border)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MapCard
            title="FRONTEND_ARCH"
            description="从交互到工程化 // 体系构建中..."
            imageSrc={IMAGES.frontend}
            imageAlt="FRONTEND_ARCH"
            dataSet="DATA_SET_01"
            color="var(--primary)"
            onImageClick={openModal}
          />
          <MapCard
            title="BACKEND_ARCH"
            description="语言与架构串联 // 核心运算中..."
            imageSrc={IMAGES.program}
            imageAlt="BACKEND_ARCH"
            dataSet="DATA_SET_02"
            color="var(--accent)"
            onImageClick={openModal}
          />
        </div>
      </section>

      <footer className="text-center py-10 border-t border-[var(--border)] text-[var(--muted)] text-xs font-mono">
        <p>SYSTEM_ID: RUSSELL_BLOG_V2.0</p>
        <p className="opacity-50 mt-2">
          <a 
            href="https://beian.miit.gov.cn" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-[var(--primary)] transition-colors"
          >
            浙ICP备19021274号-2
          </a>
        </p>
      </footer>
    </main>
  );
}

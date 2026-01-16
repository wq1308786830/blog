import React from 'react';
import Link from 'next/link';

const FaceLeftPic = '/imgs/home/NDk2MDg0NjE1.jpeg';
const RussellPic = '/imgs/home/Bertrand_Russell.jpg';
const ProgramPic = '/imgs/home/language_map.png';
const FrontendPic = '/imgs/home/frontend_map.png';

export default function Page() {
  return (
    <main className="min-h-screen w-full flex flex-col p-4 md:p-10 max-w-7xl mx-auto gap-20">
      
      {/* HUD Header */}
      <header className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <div className="flex flex-col">
          <span className="text-[var(--primary)] text-xs tracking-[0.2em] animate-pulse">SYSTEM_ONLINE</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">RUSSELL<span className="text-[var(--primary)]">.LOG</span></h1>
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
            <Link href="/category" className="group relative px-8 py-3 bg-[rgba(0,243,255,0.1)] border border-[var(--primary)] text-[var(--primary)] font-bold uppercase tracking-widest overflow-hidden hover:bg-[var(--primary)] hover:text-black transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">
                INITIATE_READ <span className="text-xl">&rarr;</span>
              </span>
              <div className="absolute inset-0 bg-[var(--primary)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
            </Link>
            <a href="#maps" className="px-8 py-3 border border-[var(--muted)] text-[var(--muted)] uppercase tracking-widest hover:border-[var(--text)] hover:text-[var(--text)] transition-all">
              ACCESS_MAPS
            </a>
          </div>
        </div>

        {/* Hero Visuals */}
        <div className="relative">
          <div className="absolute -inset-4 bg-[var(--primary)] opacity-20 blur-2xl rounded-full animate-pulse" />
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="cyber-border p-1 bg-black/60 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500">
              <div className="relative overflow-hidden group">
                <img src={FaceLeftPic} alt="Blackhole" className="w-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs font-mono text-[var(--primary)] translate-y-full group-hover:translate-y-0 transition-transform">
                  TARGET: UNIVERSE
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center px-1">
                <span className="text-[10px] uppercase text-[var(--muted)]">OBSERVATION_MODE</span>
                <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-blink"></span>
              </div>
            </div>

            <div className="cyber-border p-1 bg-black/60 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500 mt-8">
               <div className="relative overflow-hidden group">
                <img src={RussellPic} alt="Russell" className="w-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs font-mono text-[var(--primary)] translate-y-full group-hover:translate-y-0 transition-transform">
                  TARGET: REASON
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center px-1">
                <span className="text-[10px] uppercase text-[var(--muted)]">LOGIC_CORE</span>
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-blink"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section id="maps" className="py-20 space-y-10 w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-[var(--border)]" />
          <h3 className="text-2xl font-mono text-[var(--primary)]">&lt; KNOWLEDGE_DATABASE /&gt;</h3>
          <div className="h-[1px] flex-1 bg-[var(--border)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Map Card 1 */}
          <div className="group relative border border-[var(--border)] bg-[rgba(0,10,20,0.8)] p-6 hover:border-[var(--primary)] transition-colors duration-300">
            <div className="absolute top-0 right-0 px-2 py-1 bg-[var(--border)] text-[10px] text-black font-bold group-hover:bg-[var(--primary)]">
              DATA_SET_01
            </div>
            <div className="mb-4">
              <h4 className="text-xl text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors">FRONTEND_ARCH</h4>
              <p className="text-sm text-[var(--muted)]">从交互到工程化 // 体系构建中...</p>
            </div>
            <div className="relative overflow-hidden border border-[var(--border)] h-48 opacity-60 group-hover:opacity-100 transition-opacity">
               <img src={FrontendPic} alt="Frontend Map" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            </div>
          </div>

          {/* Map Card 2 */}
          <div className="group relative border border-[var(--border)] bg-[rgba(0,10,20,0.8)] p-6 hover:border-[var(--accent)] transition-colors duration-300">
            <div className="absolute top-0 right-0 px-2 py-1 bg-[var(--border)] text-[10px] text-black font-bold group-hover:bg-[var(--accent)]">
              DATA_SET_02
            </div>
             <div className="mb-4">
              <h4 className="text-xl text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">BACKEND_ARCH</h4>
              <p className="text-sm text-[var(--muted)]">语言与架构串联 // 核心运算中...</p>
            </div>
            <div className="relative overflow-hidden border border-[var(--border)] h-48 opacity-60 group-hover:opacity-100 transition-opacity">
               <img src={ProgramPic} alt="Backend Map" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-10 border-t border-[var(--border)] text-[var(--muted)] text-xs font-mono">
        <p>SYSTEM_ID: RUSSELL_BLOG_V2.0</p>
        <p className="opacity-50 mt-2">
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer" className="hover:text-[var(--primary)]">
            浙ICP备19021274号-2
          </a>
        </p>
      </footer>
    </main>
  );
}

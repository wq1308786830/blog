'use client';

import React from 'react';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import type { Category } from '@/services/data.d';

interface TopNavProps {
  navs: Category[];
}
function TopNav(props: TopNavProps) {
  const { navs } = props;
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = pathname.split('/')[2];

  if (!Array.isArray(navs)) {
    return null;
  }

  const isActive = (navItem: any) => categoryId && navItem.id === +categoryId;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-8 bg-black/80 backdrop-blur-md border-b border-[var(--border)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
       <div className="flex gap-4 overflow-x-auto w-full max-w-7xl mx-auto no-scrollbar">
        {navs.map((nav) => (
            <button
            type="button"
            key={nav.id}
            className={clsx(
                "relative flex items-center px-6 py-2 text-sm font-mono tracking-wider uppercase transition-all duration-300 border border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)] group",
                isActive(nav) 
                ? "text-black bg-[var(--primary)] font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]" 
                : "text-[var(--muted)] bg-[rgba(255,255,255,0.02)]"
            )}
            onClick={() => {
                router.push(`/category/${nav.id}`);
            }}
            >
            {/* Corner Markers */}
            <span className="absolute top-0 left-0 w-1 h-1 bg-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-0 right-0 w-1 h-1 bg-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {nav.name}
            </button>
        ))}
      </div>
    </header>
  );
}

export default TopNav;

'use client';

import React from 'react';
import type { Category } from '@/services/data';
import CategoryTree from './CategoryTree';

interface LeftNavProps {
  sub: Category;
  categoryId: number;
}
function LeftNav(props: LeftNavProps) {
  const { sub, categoryId } = props;

  if (!Array.isArray(sub?.subCategory)) {
    return null;
  }

  return (
    <nav className="flex flex-col gap-2 p-4 border-r border-[var(--border)] bg-black/20 h-full backdrop-blur-sm">
      <div className="text-xs font-mono text-[var(--muted)] mb-4 uppercase tracking-widest pl-2 border-l-2 border-[var(--primary)]">
        DIRECTORY_LISTING
      </div>
      {sub.subCategory.map((category) => (
        <CategoryTree key={category.id} category={category} categoryId={categoryId} />
      ))}
    </nav>
  );
}

export default LeftNav;

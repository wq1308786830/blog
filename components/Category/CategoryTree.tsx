import React from 'react';
import Link from 'next/link';
import type { Category } from '@/services/data.d';

interface CategoryTreeProps {
  category: Category;
  categoryId: number;
  leafId?: number;
}

function CategoryTree({ category, categoryId, leafId }: CategoryTreeProps) {
  const renderSubs = (sub: Category) => {
    if (!Array.isArray(sub?.subCategory)) {
      const isActive = sub.id === leafId;
      return (
        <Link
          key={sub.id}
          href={`/category/${categoryId}/${sub.id}`}
          className={`block py-2 px-3 text-sm font-mono transition-all border-l-2 ${
            isActive
              ? 'bg-[rgba(0,243,255,0.15)] text-[var(--primary)] border-[var(--primary)] font-semibold'
              : 'text-[var(--muted)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[rgba(0,243,255,0.05)]'
          }`}
        >
          {'>'} {sub.name}
        </Link>
      );
    }

    const hasActiveChild = sub.subCategory?.some((child) => child.id === leafId);

    return (
      <dl className="pl-3 border-l border-[rgba(255,255,255,0.05)] ml-1 my-1">
        <dt
          className={`py-2 px-2 text-sm font-bold uppercase tracking-wide bg-black/40 mb-1 ${
            hasActiveChild
              ? 'text-[var(--primary)] border-l-4 border-[var(--primary)]'
              : 'text-[var(--text)]'
          }`}
        >
          [{sub.name}]
        </dt>
        {sub.subCategory.map((s) => (
          <dd key={s.id} className="ml-0">
            {renderSubs(s)}
          </dd>
        ))}
      </dl>
    );
  };

  return <div>{renderSubs(category)}</div>;
}

CategoryTree.defaultProps = {
  leafId: undefined,
};

export default CategoryTree;

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/services/data.d';

interface CategoryTreeProps {
  category: Category;
  categoryId: number;
  leafId?: number;
}
function CategoryTree(props: CategoryTreeProps) {
  const { category, categoryId, leafId = undefined } = props;

  const renderSubs = (sub: Category) => {
    if (!Array.isArray(sub?.subCategory)) {
      return (
        <Link
          key={sub.id}
          href={`/category/${categoryId}/${sub.id}`}
          className={`block py-2 px-3 text-sm text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[rgba(0,243,255,0.05)] transition-colors border-l border-transparent hover:border-[var(--primary)] font-mono ${sub.id === leafId ? 'bg-[rgba(0,243,255,0.1)] border-[var(--primary)] text-[var(--primary)]' : ''}`}
        >
          {'>'} {sub.name}
        </Link>
      );
    }

    return (
      <dl className="pl-3 border-l border-[rgba(255,255,255,0.05)] ml-1 my-1">
        <dt
          className={`py-2 px-2 text-sm font-bold text-[var(--text)] uppercase tracking-wide bg-black/40 mb-1 ${sub.id === leafId ? 'border-l-4 border-[var(--primary)]' : ''}`}
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

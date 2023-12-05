'use client';

import React from 'react';
import type { Category } from '@/services/data';
import css from '@/styles/article.module.scss';
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
    <nav className={css.leftNavWrapper}>
      {sub.subCategory.map((category) => (
        <CategoryTree key={category.id} category={category} categoryId={categoryId} />
      ))}
    </nav>
  );
}

export default LeftNav;

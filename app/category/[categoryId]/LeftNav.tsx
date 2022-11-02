'use client';

import React from 'react';
import CategoryTree from './CategoryTree';
import type { Category } from '@/libs/data';
import css from '@/styles/article.module.scss';

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

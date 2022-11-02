import React from 'react';
import Link from 'next/link';
import type { Category } from '@/libs/data';
import css from '@/styles/article.module.scss';

interface CategoryTreeProps {
  category: Category;
  categoryId: number;
}
function CategoryTree(props: CategoryTreeProps) {
  const { category, categoryId } = props;

  const renderSubs = (sub: Category) => {
    if (!Array.isArray(sub?.subCategory)) {
      return (
        <Link key={sub.id} href={`/category/${categoryId}`} className={css.link}>
          {sub.name}
        </Link>
      );
    }

    return (
      <dl className={css.dl}>
        <dt className={css.dt}>{sub.name}</dt>
        {sub.subCategory.map((s) => (
          <dd key={s.id} className={css.dd}>
            {renderSubs(s)}
          </dd>
        ))}
      </dl>
    );
  };
  return <div className={css.categoryTreeWrapper}>{renderSubs(category)}</div>;
}

export default CategoryTree;

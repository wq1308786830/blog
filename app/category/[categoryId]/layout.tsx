import React, { use } from 'react';
import { getAllCategories } from '@/services/blog';
import type { PageProps } from '@/services/data.d';
import css from '@/styles/article.module.scss';
import LeftNav from './LeftNav';

export default function Layout(props: PageProps<{ categoryId: string }>) {
  const { children, params } = props;
  const resp: any = use(getAllCategories());
  const { data: navs } = resp;

  if (!Array.isArray(navs)) {
    return null;
  }

  const sub = navs.find((nav) => nav.id === +params.categoryId);
  return (
    <section className={css.body}>
      <LeftNav sub={sub} categoryId={+params.categoryId} />
      {children}
    </section>
  );
}

import React, { use } from 'react';
import { getAllCategories } from '@/services/blog';
import LeftNav from './LeftNav';
import { PageProps } from '@/utils/data.d';
import css from '@/styles/article.module.scss';

export default function Layout(props: PageProps) {
  const { children, params } = props;
  const resp: any = use(getAllCategories());
  const { data: navs } = resp;

  if (!Array.isArray(navs)) {
    return null;
  }

  const sub = navs.find((nav) => nav.id === +params.categoryId);
  console.log('=====params', sub);
  return (
    <section className={css.body}>
      <LeftNav sub={sub} />
      <div>{children}</div>
    </section>
  );
}

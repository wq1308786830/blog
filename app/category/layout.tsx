import React, { use } from 'react';
import { getAllCategories } from '@/services/blog';
import type { PageProps } from '@/services/data.d';
import css from '@/styles/article.module.scss';
import TopNav from './TopNav';

export default function Layout(props: PageProps<any>) {
  const { children } = props;
  const resp: any = use(getAllCategories());
  const { data: navs } = resp;

  return (
    <main className={css.main}>
      <TopNav navs={navs} />
      <div className={css.content}>{children}</div>
    </main>
  );
}

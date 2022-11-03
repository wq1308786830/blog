import React, { use } from 'react';
import TopNav from './TopNav';
import { getAllCategories } from '@/libs/blog';
import type { PageProps } from '@/libs/data.d';
import css from '@/styles/article.module.scss';

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

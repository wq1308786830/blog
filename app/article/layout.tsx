import React, { use } from 'react';
import TopNav from './TopNav';
import { getAllCategories } from '@/services/blog';
import css from '@/styles/article.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const resp: any = use(getAllCategories());
  const { data: navs } = resp;

  return (
    <section>
      <TopNav navs={navs} />
      <div className={css.content}>{children}</div>
    </section>
  );
}

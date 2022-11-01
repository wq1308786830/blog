import React, { use } from 'react';
import TopNav from './TopNav';
import { getAllCategories } from '@/services/blog';
import css from '@/styles/article.module.scss';
import type { PageProps } from "@/utils/data.d";

export default function Layout(props: PageProps<any>) {
  const { children } = props;
  const resp: any = use(getAllCategories());
  const { data: navs } = resp;

  return (
    <>
      <TopNav navs={navs} />
      <div className={css.content}>{children}</div>
    </>
  );
}

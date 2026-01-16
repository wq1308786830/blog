import React, { use } from 'react';
import { getAllCategories } from '@/services/blog';
import type { PageProps } from '@/services/data.d';
import TopNav from './TopNav';

export default function Layout(props: PageProps<any>) {
  const { children } = props;
  const resp: any = use(getAllCategories());
  const { data: navs } = resp;

  return (
    <main className="min-h-screen relative z-10 pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      <TopNav navs={navs} />
      <div className="w-full mt-8">{children}</div>
    </main>
  );
}

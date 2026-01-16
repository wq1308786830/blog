import React, { use } from 'react';
import { getAllCategories } from '@/services/blog';
import type { PageProps } from '@/services/data.d';
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
    <section className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
      <aside className="w-full md:w-64 flex-shrink-0">
        <LeftNav sub={sub} categoryId={+params.categoryId} />
      </aside>
      <div className="flex-1 min-w-0 cyber-border bg-black/40 p-6">
        {children}
      </div>
    </section>
  );
}

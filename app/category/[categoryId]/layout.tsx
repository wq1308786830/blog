import React, { use } from 'react';
import { getAllCategories } from '@/services/blog';
import LeftNav from '@/components/Category/LeftNav';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    categoryId: string;
    leafId?: string;
    articleId?: string;
  }>;
}

export default function CategoryLayout(props: CategoryLayoutProps) {
  const params = use(props.params);

  const {
    children
  } = props;

  const resp: any = use(getAllCategories());
  const { data: navs } = resp;

  if (!Array.isArray(navs)) {
    return null;
  }

  const sub = navs.find((nav: any) => nav.id === +params.categoryId);
  const leafId = params.leafId ? +params.leafId : undefined;

  return (
    <section className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
      <aside className="w-full md:w-64 flex-shrink-0">
        <LeftNav sub={sub} categoryId={+params.categoryId} leafId={leafId} />
      </aside>
      <div className="flex-1 min-w-0 cyber-border bg-black/40 p-6">{children}</div>
    </section>
  );
}

import React, { use, Suspense } from 'react';
import { getAllCategories } from '@/services/blog';
import type { PageProps } from '@/services/data.d';
import LeftNav from '@/components/Category/LeftNav';

// Wrapper component to handle API errors gracefully
function CategoryDetailLayoutContent({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { categoryId: string; leafId?: string };
}) {
  try {
    const resp: any = use(getAllCategories());
    const { data: navs } = resp;

    if (!Array.isArray(navs)) {
      return (
        <section className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="text-red-400">Unable to load categories</div>
          </aside>
          <div className="flex-1 min-w-0 cyber-border bg-black/40 p-6">{children}</div>
        </section>
      );
    }

    const sub = navs.find((nav) => nav.id === +params.categoryId);
    console.log(
      'Layout params:',
      params,
      'sub:',
      sub,
      'leafId:',
      params.leafId ? +params.leafId : undefined,
    );
    return (
      <section className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
        <aside className="w-full md:w-64 flex-shrink-0">
          <LeftNav
            sub={sub}
            categoryId={+params.categoryId}
            leafId={params.leafId ? +params.leafId : undefined}
          />
        </aside>
        <div className="flex-1 min-w-0 cyber-border bg-black/40 p-6">{children}</div>
      </section>
    );
  } catch (error) {
    console.error('Failed to load categories:', error);
    return (
      <section className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="text-red-400 p-4">
            Unable to load categories. Please check your connection.
          </div>
        </aside>
        <div className="flex-1 min-w-0 cyber-border bg-black/40 p-6">{children}</div>
      </section>
    );
  }
}

export default function Layout(props: PageProps<{ categoryId: string; leafId?: string }>) {
  const { children, params } = props;

  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <CategoryDetailLayoutContent params={params}>{children}</CategoryDetailLayoutContent>
    </Suspense>
  );
}

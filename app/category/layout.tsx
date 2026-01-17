import React, { use, Suspense } from 'react';
import { getAllCategories } from '@/services/blog';
import type { PageProps } from '@/services/data.d';
import TopNav from './TopNav';

// Wrapper component to handle API errors gracefully
function CategoryLayoutContent({ children }: { children: React.ReactNode }) {
  try {
    const resp = use(getAllCategories());
    const { data: navs } = resp;
    return (
      <>
        <TopNav navs={navs} />
        <div className="w-full mt-8">{children}</div>
      </>
    );
  } catch (error) {
    console.error('Failed to load categories:', error);
    // Provide fallback navigation or empty state
    return (
      <>
        <TopNav navs={[]} />
        <div className="w-full mt-8">{children}</div>
      </>
    );
  }
}

export default function Layout(props: PageProps<any>) {
  const { children } = props;

  return (
    <main className="min-h-screen relative z-10 pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoryLayoutContent>{children}</CategoryLayoutContent>
      </Suspense>
    </main>
  );
}

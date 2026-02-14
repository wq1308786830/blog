import React, { Suspense } from 'react';
import { getArticleList } from '@/services/blog';
import { ArticleList } from '@/components/ArticleList';
import type { PageProps } from '@/types';

// 强制动态渲染
export const dynamic = 'force-dynamic';

/**
 * 文章列表加载组件
 */
async function ArticleListContent({ categoryId }: { categoryId: string }) {
  try {
    const response = await getArticleList({ key: categoryId });
    const { data: articleList } = response;

    if (!Array.isArray(articleList) || articleList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-mono text-[var(--primary)] mb-2">NO_ARTICLES_FOUND</h2>
          <p className="text-[var(--muted)]">该分类下暂无文章</p>
        </div>
      );
    }

    return <ArticleList categoryId={categoryId} list={articleList} />;
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-mono text-[var(--primary)] mb-2">LOAD_ERROR</h2>
        <p className="text-[var(--muted)]">加载文章数据失败</p>
      </div>
    );
  }
}

/**
 * 加载状态组件
 */
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary)] mb-4" />
      <p className="text-[var(--muted)] font-mono">LOADING_ARTICLES...</p>
    </div>
  );
}

/**
 * 分类页面组件
 */
export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId || '';

  return (
    <div className="min-h-screen w-full p-4 md:p-10 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-mono text-[var(--primary)] mb-4">
          &lt; CATEGORY_{categoryId.toUpperCase()}_DATABASE /&gt;
        </h1>
        <div className="h-[1px] bg-[var(--border)]" />
      </header>

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <ArticleListContent categoryId={categoryId} />
        </Suspense>
      </main>
    </div>
  );
}

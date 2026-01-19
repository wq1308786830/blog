import React, { Suspense } from 'react';
import { getArticleList } from '@/services/blog';
import { ArticleList } from '@/components/ArticleList';
import type { PageProps } from '@/types';

/**
 * 文章列表加载组件 - 使用 React 19 的 use() hook
 */
function ArticleListContent() {
  // React 19 的 use() hook 用于处理 Promise
  const response = React.use(getArticleList({}));
  const { data: articleList } = response;

  if (!Array.isArray(articleList) || articleList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-mono text-[var(--primary)] mb-2">NO_DATA_FOUND</h2>
        <p className="text-[var(--muted)]">暂无文章数据</p>
      </div>
    );
  }

  return <ArticleList list={articleList} />;
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
 * React 19 优化的分类页面
 * 使用 Server Component + Suspense 提升性能
 */
export default function CategoryPage({ params, searchParams }: PageProps) {
  return (
    <div className="min-h-screen w-full p-4 md:p-10 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-mono text-[var(--primary)] mb-4">
          &lt; ARTICLE_DATABASE /&gt;
        </h1>
        <div className="h-[1px] bg-[var(--border)]" />
      </header>

      <main>
        {/* React 19 的 Suspense 边界 */}
        <Suspense fallback={<LoadingFallback />}>
          <ArticleListContent />
        </Suspense>
      </main>
    </div>
  );
}

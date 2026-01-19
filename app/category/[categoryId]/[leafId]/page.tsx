import React, { Suspense } from 'react';
import { getArticleList } from '@/services/blog';
import { ArticleList } from '@/components/ArticleList';
import type { PageProps } from '@/types';

/**
 * 文章列表加载组件
 */
function ArticleListContent({ categoryId, leafId }: { categoryId: string; leafId: string }) {
  const response = React.use(getArticleList({ key: leafId }));
  const { data: articleList } = response;

  if (!Array.isArray(articleList) || articleList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-mono text-[var(--primary)] mb-2">NO_ARTICLES_FOUND</h2>
        <p className="text-[var(--muted)]">该子分类下暂无文章</p>
      </div>
    );
  }

  return <ArticleList categoryId={categoryId} leafId={leafId} list={articleList} />;
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
 * 叶子节点页面组件
 */
export default async function LeafPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId || '';
  const leafId = resolvedParams.leafId || '';

  return (
    <div className="min-h-screen w-full p-4 md:p-10 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-mono text-[var(--primary)] mb-4">
          &lt; LEAF_{leafId.toUpperCase()}_DATABASE /&gt;
        </h1>
        <div className="h-[1px] bg-[var(--border)]" />
      </header>

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <ArticleListContent categoryId={categoryId} leafId={leafId} />
        </Suspense>
      </main>
    </div>
  );
}

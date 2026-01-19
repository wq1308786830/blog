import React, { memo } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import type { ArticleListProps } from '@/types';

/**
 * 单个文章项组件 - React 19 优化的 memo 组件
 */
const ArticleItem = memo<{
  article: {
    id: number;
    title: string;
    date_publish: number;
  };
  categoryId?: string;
  leafId?: string;
}>(({ article, categoryId, leafId }) => {
  const href = `/category/${categoryId}${leafId ? `/${leafId}` : ''}/article/${article.id}`;
  
  return (
    <div className="group flex items-center justify-between p-3 border border-transparent hover:border-[var(--primary)] hover:bg-[rgba(0,243,255,0.03)] transition-all cursor-pointer">
      <Link
        href={href}
        className="font-mono text-[var(--text)] group-hover:text-[var(--primary)] hover:underline decoration-[var(--primary)] underline-offset-4 decoration-1 transition-colors flex-1"
        prefetch={false} // Next.js 16 优化：按需预取
      >
        {article.title}
      </Link>
      <time 
        className="text-xs font-mono text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors"
        dateTime={dayjs(article.date_publish).toISOString()}
      >
        {dayjs(article.date_publish).format('YYYY-MM-DD')}
      </time>
    </div>
  );
});

ArticleItem.displayName = 'ArticleItem';

/**
 * React 19 优化的文章列表组件
 * 使用 memo 和 key 优化渲染性能
 */
export const ArticleList = memo<ArticleListProps>(({ list, categoryId = '', leafId = '' }) => {
  if (!Array.isArray(list) || list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-mono text-[var(--primary)] mb-2">NO_ARTICLES_FOUND</h2>
        <p className="text-[var(--muted)]">暂无文章数据</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 表头 */}
      <div className="flex justify-between border-b border-[var(--border)] pb-2 mb-4 text-xs font-mono text-[var(--muted)] uppercase">
        <span>FILE_NAME</span>
        <span>DATE_MODIFIED</span>
      </div>
      
      {/* 文章列表 */}
      <div className="space-y-2" role="list">
        {list.map((article) => (
          <ArticleItem
            key={article.id}
            article={article}
            categoryId={categoryId}
            leafId={leafId}
          />
        ))}
      </div>
      
      {/* 统计信息 */}
      <div className="mt-8 pt-4 border-t border-[var(--border)] text-center">
        <p className="text-xs font-mono text-[var(--muted)]">
          TOTAL_FILES: {list.length}
        </p>
      </div>
    </div>
  );
});

ArticleList.displayName = 'ArticleList';

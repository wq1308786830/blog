import React, { use } from 'react';
import { getArticleDetail } from '@/services/blog';
import { ArticleDetail } from '@/components/ArticleDetail';

interface ArticlePageProps {
  params: Promise<{
    categoryId: string;
    leafId: string;
    articleId: string;
  }>;
}

function ArticlePage(props: ArticlePageProps) {
  const params = use(props.params);
  const { articleId } = params;
  const resp = use(getArticleDetail({ articleId }));

  if (!resp.data) {
    return <div className="text-[var(--muted)]">Article not found</div>;
  }

  return <ArticleDetail article={resp.data} />;
}

export default ArticlePage;

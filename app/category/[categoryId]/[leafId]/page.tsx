import React, { use } from 'react';
import { getArticleList } from '@/services/blog';
import ArticleList from '@/components/ArticleList';

interface LeafPageProps {
  params: {
    categoryId: string;
    leafId: string;
  };
}

function LeafPage({ params }: LeafPageProps) {
  const { categoryId, leafId } = params;
  const resp = use(getArticleList({ key: leafId }));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return <div className="text-[var(--muted)]">No articles found</div>;
  }

  return <ArticleList categoryId={categoryId} leafId={leafId} list={articleList} />;
}

export default LeafPage;

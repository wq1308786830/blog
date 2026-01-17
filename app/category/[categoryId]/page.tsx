import React, { use } from 'react';
import { getArticleList } from '@/services/blog';
import ArticleList from '@/components/ArticleList';

interface CategoryPageProps {
  params: {
    categoryId: string;
    leafId?: string;
  };
}

function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = params;
  const resp = use(getArticleList({ key: categoryId }));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return <div className="text-[var(--muted)]">No articles found</div>;
  }

  return <ArticleList categoryId={categoryId} list={articleList} />;
}

export default CategoryPage;

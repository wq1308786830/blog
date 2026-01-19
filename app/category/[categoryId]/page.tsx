import React, { use } from 'react';
import { getArticleList } from '@/services/blog';
import { ArticleList } from '@/components/ArticleList';

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
    leafId?: string;
  }>;
}

function CategoryPage(props: CategoryPageProps) {
  const params = use(props.params);
  const { categoryId } = params;
  const resp = use(getArticleList({ key: categoryId }));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return <div className="text-[var(--muted)]">No articles found</div>;
  }

  return <ArticleList categoryId={categoryId} list={articleList} />;
}

export default CategoryPage;

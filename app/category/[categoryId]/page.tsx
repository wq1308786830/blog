import React, { use } from 'react';
import { getArticleList } from '@/services/blog';
import ArticleList from '@/components/ArticleList';
import type { PageProps } from '@/services/data.d';

function Page(props: PageProps<{ categoryId: string }>) {
  const {
    params: { categoryId },
  } = props;
  const resp = use(getArticleList({ key: categoryId }));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return null;
  }

  return <ArticleList categoryId={categoryId} list={articleList} />;
}

export default Page;

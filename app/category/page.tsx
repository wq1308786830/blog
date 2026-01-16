import React, { use } from 'react';
import { getArticleList } from '@/services/blog';
import ArticleList from '@/components/ArticleList';

function Page() {
  const resp = use(getArticleList({}));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return null;
  }

  return <ArticleList list={articleList} />;
}

export default Page;

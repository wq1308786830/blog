import React, { use } from 'react';
import { getArticleList } from '@/libs/blog';
import ArticleList from '@/ui/ArticleList';

function Page() {
  const resp: any = use(getArticleList(''));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return null;
  }

  return <ArticleList list={articleList} />;
}

export default Page;

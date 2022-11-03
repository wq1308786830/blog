import React, { use } from 'react';
import { getArticleList } from '@/libs/blog';
import ArticleList from '@/ui/ArticleList';
import type { PageProps } from '@/libs/data.d';

function Page(props: PageProps<{ leafId: string; categoryId: string }>) {
  const {
    params: { leafId, categoryId },
  } = props;
  const resp: any = use(getArticleList(leafId));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return null;
  }

  return <ArticleList categoryId={categoryId} leafId={leafId} list={articleList} />;
}

export default Page;

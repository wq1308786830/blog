import React, { use } from 'react';
import { getArticleList } from '@/services/blog';
import ArticleList from '@/components/ArticleList';
import type { PageProps } from '@/services/data.d';

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

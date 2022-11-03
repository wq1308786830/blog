import React, { use } from 'react';
import Image from 'next/image';
import { getArticleList } from '@/libs/blog';
import ArticleList from '@/ui/ArticleList';
import type { PageProps } from '@/libs/data.d';

function Page(props: PageProps<{ categoryId: string }>) {
  const {
    params: { categoryId },
  } = props;
  const resp: any = use(getArticleList(categoryId));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList) || !articleList.length) {
    return null;
  }

  return <ArticleList categoryId={categoryId} list={articleList} />;
}

export default Page;

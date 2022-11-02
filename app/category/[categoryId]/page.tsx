import React, { use } from 'react';
import css from '@/styles/article.module.scss';
import { getArticleList } from '@/libs/blog';
import ArticleList from '@/ui/ArticleList';
import type { PageProps } from '@/libs/data.d';

function Page(props: PageProps<{ categoryId: string }>) {
  const {
    params: { categoryId },
  } = props;
  const resp: any = use(getArticleList(categoryId));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList)) {
    return null;
  }

  return (
    <div className={css.main}>
      <ArticleList categoryId={categoryId} list={articleList} />
    </div>
  );
}

export default Page;

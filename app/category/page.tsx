import React, { use } from 'react';
import { getArticleList } from '@/libs/blog';
import ArticleList from '@/ui/ArticleList';
import css from '@/styles/article.module.scss';

function Page() {
  const resp: any = use(getArticleList(''));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList)) {
    return null;
  }

  return (
    <div className={css.main}>
      <ArticleList list={articleList} />
    </div>
  );
}

export default Page;

import React, { use } from 'react';
import Link from 'next/link';
import { getArticleList } from '@/services/blog';
import { PageProps } from '@/utils/data.d';
import css from '@/styles/article.module.scss';

function Page(props: PageProps<{ leafId: string }>) {
  const { params } = props;
  const resp: any = use(getArticleList(params.leafId));
  const { data: articleList } = resp;

  if (!Array.isArray(articleList)) {
    return null;
  }
  return (
    <div className={css.articleListWrapper}>
      <div className={css.articleLink}>
        {articleList.map((article) => (
          <div key={article.id}>
            <Link href={`/detail/${article.id}`}>{article.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;

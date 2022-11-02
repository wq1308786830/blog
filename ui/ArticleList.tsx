import React from 'react';
import Link from 'next/link';
import css from '@/styles/article.module.scss';

interface ArticleListProps {
  list: any[];
  categoryId?: string;
}
function ArticleList(props: ArticleListProps) {
  const { categoryId, list } = props;

  return (
    <div className={css.articleListWrapper}>
      <div className={css.articleLink}>
        {list.map((article) => (
          <div key={article.id}>
            <Link href={`/category/${categoryId}/article/${article.id}`}>{article.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
const defaultProps = {
  categoryId: '',
};
ArticleList.defaultProps = defaultProps;

export default ArticleList;

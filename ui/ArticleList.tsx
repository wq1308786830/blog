import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import css from '@/styles/article.module.scss';

interface ArticleListProps {
  list: any[];
  categoryId?: string;
  leafId?: string;
}
function ArticleList(props: ArticleListProps) {
  const { categoryId, leafId, list } = props;

  return (
    <div className={css.articleListWrapper}>
      <div className={css.articleLink}>
        {list.map((article) => (
          <div key={article.id} className={css.articleRow}>
            <Link
              href={`/category/${categoryId}${leafId ? `/${leafId}` : ''}/article/${article.id}`}
            >
              {article.title}
            </Link>
            <span className={css.time}>{dayjs(article.date_publish).format('YYYY-MM-DD')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
const defaultProps = {
  categoryId: '',
  leafId: '',
};
ArticleList.defaultProps = defaultProps;

export default ArticleList;

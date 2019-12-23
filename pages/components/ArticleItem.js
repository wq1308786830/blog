import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import './ArticleItem.less';

function ArticleItem({ article }) {
  const { id, leafId } = useRouter().query;
  if (!article) {
    return <></>;
  }
  const { id: articleId, title, description, date_publish: date } = article;
  return (
    <div className="article-item-wrap">
      <time className="time">
        <strong>{date && date.substring(5, 10)}</strong>
        <span>{date && date.split('-')[0]}</span>
      </time>
      <div className="desc">
        <Link
          key={id}
          href="/category/[id]/[leafId]/article/[aId]"
          as={`/category/${id}/${leafId}/article/${articleId}`}
        >
          <a>
            <h2>{title}</h2>
          </a>
        </Link>
        <p>{description}</p>
      </div>
    </div>
  );
}

ArticleItem.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date_publish: PropTypes.string.isRequired
  }).isRequired
};

export default ArticleItem;

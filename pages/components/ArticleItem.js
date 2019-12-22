import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import './ArticleItem.less';

function ArticleItem({ article }) {
  const { id, title, description, date_publish: date } = article;
  return (
    <div className="article-item-wrap">
      <time className="time">
        <strong>{date && date.substring(5, 10)}</strong>
        <span>{date && date.split('-')[0]}</span>
      </time>
      <div className="desc">
        <Link key={id} href="/article/[id]" as={`/article/${id}`}>
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
  article: {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date_publish: PropTypes.string.isRequired
  }.isRequired
};

export default ArticleItem;

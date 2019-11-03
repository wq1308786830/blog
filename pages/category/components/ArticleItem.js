import React from 'react';
import PropTypes from 'prop-types';
import './ArticleItem.less';
import Link from 'next/link';

function ArticleItem({ article }) {
  return (
    <div className="article-item-wrap">
      <div>
        <p>{article.date_publish.substring(5, 10)}</p>
        <p>{article.date_publish.split('-')[0]}</p>
      </div>
      <div>
        <Link key={article.id} href="/article/[id]" as={`/article/${article.id}`}>
          <a>
            <h3>{article.title}</h3>
          </a>
        </Link>
        <p>{article.description}</p>
      </div>
    </div>
  );
}

ArticleItem.propTypes = {
  article: PropTypes.object.isRequired
};

export default ArticleItem;

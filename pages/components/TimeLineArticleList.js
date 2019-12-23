import PropTypes from 'prop-types';
import React from 'react';
import ArticleItem from './ArticleItem';
import './TimeLine.less';

function TimeLineArticleList({ articles }) {
  return (
    <section className="timeline-list-container">
      {articles &&
        articles.map(article => {
          if (article) {
            return <ArticleItem key={article.id} article={article} />;
          }
          return null;
        })}
    </section>
  );
}

export default TimeLineArticleList;

TimeLineArticleList.propTypes = {
  articles: PropTypes.array.isRequired
};

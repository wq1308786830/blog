import PropTypes from 'prop-types';
import React from 'react';
import ArticleItem from './ArticleItem';
import './TimeLine.less';

function TimeLineArticleList({ articleList }) {
  return (
    <section className="timeline-list-container">
      {articleList &&
        articleList.map(article => <ArticleItem key={article.id} article={article} />)}
    </section>
  );
}

export default TimeLineArticleList;

TimeLineArticleList.propTypes = {
  articleList: PropTypes.array
};

TimeLineArticleList.defaultProps = {
  articleList: []
};

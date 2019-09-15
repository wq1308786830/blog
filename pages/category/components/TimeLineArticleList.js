import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ArticleItem from './ArticleItem';
import './TimeLine.less';

function TimeLineArticleList({ id, articles }) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (id) {
      setTitle('某个');
    } else {
      setTitle('所有');
    }
  }, [id]);

  return (
    <section className="timeline-list-container">
      <h2>{title}</h2>
      {articles && articles.map(article => <ArticleItem article={article}/>)}
    </section>
  );
}

export default TimeLineArticleList;

TimeLineArticleList.propTypes = {
  id: PropTypes.string,
  articles: PropTypes.array.isRequired
};

TimeLineArticleList.defaultProps = {
  id: null
};

import React, { useEffect, useState } from 'react';
import ArticleItem from './ArticleItem';
import './TimeLine.less';
import PropTypes from 'prop-types';
import CategoryList from './CategoryList';

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
      {articles && articles.map(article => <ArticleItem article={article} />)}
    </section>
  );
}

export default TimeLineArticleList;

TimeLineArticleList.propTypes = {
  id: PropTypes.number.isRequired,
  articles: PropTypes.object.isRequired
};

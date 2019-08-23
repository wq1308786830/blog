import React, { useState } from 'react';
import ArticleItem from './ArticleItem';
import './TimeLine.less';

function TimeLineArticleList({ id, articles }) {
  const [title, setTitle] = useState('');
  if (id) {
    setTitle('某个');
  } else {
    setTitle('所有');
  }
  return (
    <section className="timeline-list-container">
      <h2>{title}</h2>
      {articles && articles.length && articles.map(article => <ArticleItem article={article} />)}
    </section>
  );
}

export default TimeLineArticleList;

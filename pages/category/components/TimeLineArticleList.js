import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import ArticleItem from './ArticleItem';
import './TimeLine.less';
import BlogServices from '../../../services/BlogServices';

function TimeLineArticleList({ id }) {
  const [title, setTitle] = useState('');
  const [articleList, setArticleList] = useState([]);

  const getArticleList = useCallback(async () => {
    const articleListResp = await BlogServices.getArticleList(id);
    setArticleList(articleListResp.data);
  }, [id]);

  useEffect(() => {
    if (id) {
      setTitle('某个');
      getArticleList();
    } else {
      setTitle('所有');
    }
  }, [getArticleList, id]);

  return (
    <section className="timeline-list-container">
      <h2>{title}</h2>
      {articleList &&
        articleList.map(article => <ArticleItem key={article.id} article={article} />)}
    </section>
  );
}

export default TimeLineArticleList;

TimeLineArticleList.propTypes = {
  id: PropTypes.string
};

TimeLineArticleList.defaultProps = {
  id: null
};

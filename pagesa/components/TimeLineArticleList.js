import React from 'react';
import PropTypes from 'prop-types';
import ArticleItem from './ArticleItem';
import css from './TimeLine.module.scss';

function TimeLineArticleList({ articles = [] }) {
  return (
    <section className={css.timelineListContainer}>
      {articles.length ? (
        articles.map(article => {
          if (article) {
            return <ArticleItem key={article.id} article={article} />;
          }
          return null;
        })
      ) : (
        <img
          src="https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture"
          style={{ maxWidth: '100%' }}
          alt=""
        />
      )}
    </section>
  );
}

export default TimeLineArticleList;

TimeLineArticleList.propTypes = {
  articles: PropTypes.array.isRequired
};

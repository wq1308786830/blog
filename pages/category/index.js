import React from 'react';
import PropTypes from 'prop-types';
import BigNav from '../components/BigNav';
import TimeLineArticleList from '../components/TimeLineArticleList';
import CategoryList from '../components/CategoryList';
import BlogServices from '../../services/BlogServices';
import './index.less';

export default function Index({ articleList, id, categories, subCategories }) {
  return (
    <div className="doc">
      <main className="index-container">
        {categories && <BigNav category={categories} />}
        <TimeLineArticleList articles={articleList} />
        {subCategories && <CategoryList id={id} category={subCategories} />}
      </main>
    </div>
  );
}

Index.getInitialProps = async context => {
  const { id, articleList } = context.query;
  if (id) {
    return;
  }
  const categoryResp = await BlogServices.getAllCategories();
  const subC =
    (categoryResp &&
      categoryResp.data &&
      categoryResp.data.find(sub => {
        return `${sub.id}` === id;
      })) ||
    {};
  return {
    id: id || '',
    articleList: articleList || [],
    categories: categoryResp.data || [],
    subCategories: subC.subCategory || []
  };
};

Index.propTypes = {
  id: PropTypes.string,
  articleList: PropTypes.array,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired
};

Index.defaultProps = {
  id: '',
  articleList: []
};

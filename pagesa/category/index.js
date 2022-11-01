import React from 'react';
import PropTypes from 'prop-types';
import BigNav from '../components/BigNav';
import TimeLineArticleList from '../components/TimeLineArticleList';
import CategoryList from '../components/CategoryList';
import BlogServices from '../../services/BlogServices';

import base from '@/components/base.module.scss';

export default function Index({ articleList, id, categories, subCategories }) {
  return (
    <div className={base.doc}>
      <main className={base.indexContainer}>
        {categories && <BigNav category={categories} />}
        <TimeLineArticleList articles={articleList} />
        {subCategories && <CategoryList id={id} category={subCategories} />}
      </main>
    </div>
  );
}

Index.getServersideProps = async context => {
  const { id, articleList } = context.query;
  console.log('===========', context);
  if (id) {
    return {};
  }
  const categoryResp = await BlogServices.getAllCategories();
  const { data: categories } = categoryResp;
  const subC =
    (categories &&
      categories.find(sub => {
        return `${sub.id}` === id;
      })) ||
    {};
  return {
    id: id || '',
    articleList: articleList || [],
    categories: categories || [],
    subCategories: subC.subCategory || []
  };
};

Index.propTypes = {
  id: PropTypes.string,
  articleList: PropTypes.array,
  categories: PropTypes.array,
  subCategories: PropTypes.array
};

Index.defaultProps = {
  id: '',
  articleList: []
};

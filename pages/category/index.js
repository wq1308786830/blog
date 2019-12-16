import React from 'react';
import PropTypes from 'prop-types';
import BlogServices from '../../services/BlogServices';
import BigNav from '../components/BigNav';
import TimeLineArticleList from '../components/TimeLineArticleList';
import CategoryList from '../components/CategoryList';
import './index.less';

export default function Index({ id, leafId, categories, subCategories }) {
  return (
    <div className="index-container">
      {categories && <BigNav category={categories} />}
      <TimeLineArticleList id={leafId} articles={[]} />
      {subCategories && <CategoryList id={id} category={subCategories} />}
    </div>
  );
}

Index.getInitialProps = async context => {
  const { id, leafId } = context.query;
  if (id) return;
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
    leafId: leafId || '',
    categories: categoryResp.data || [],
    subCategories: subC.subCategory || []
  };
};

Index.propTypes = {
  id: PropTypes.string,
  leafId: PropTypes.string,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired
};

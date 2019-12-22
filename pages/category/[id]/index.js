import React from 'react';
import PropTypes from 'prop-types';
import Category from '../index';
import BlogServices from '../../../services/BlogServices';

export default function CategorySub(props) {
  return <Category {...props} />;
}

CategorySub.getInitialProps = async context => {
  const { id, leafId } = context.query;
  if (leafId) {
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
    categories: categoryResp.data || [],
    subCategories: subC.subCategory || []
  };
};

CategorySub.propTypes = {
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired
};

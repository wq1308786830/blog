import React from 'react';
import PropTypes from 'prop-types';
import Category from '../index';
import BlogServices from '../../../services/BlogServices';
import '../index.less';

export default function LeafId(props) {
  return <Category {...props} />;
}

LeafId.getInitialProps = async context => {
  const { id, leafId } = context.query;
  const categoryResp = await BlogServices.getAllCategories();
  const articleListResp = await BlogServices.getArticleList(leafId);
  const subC =
    (categoryResp &&
      categoryResp.data &&
      categoryResp.data.find(sub => {
        return `${sub.id}` === id;
      })) ||
    {};
  return {
    id,
    articleList: articleListResp.data || [],
    categories: categoryResp.data || [],
    subCategories: subC.subCategory || []
  };
};

LeafId.propTypes = {
  id: PropTypes.string.isRequired,
  articleList: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired
};

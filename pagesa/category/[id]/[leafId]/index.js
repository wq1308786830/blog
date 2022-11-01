import React from 'react';
import PropTypes from 'prop-types';
import Category from '../../index';
import BlogServices from '../../../../services/BlogServices';
import '../../index.module.scss';

export default function Index(props) {
  return <Category {...props} />;
}

export const getServerSideProps = async context => {
  console.log(11111111)
  const { id, leafId } = context.query;
  const categoryResp = await BlogServices.getAllCategories();
  const articleListResp = await BlogServices.getArticleList(leafId);
  const { data: categories } = categoryResp;
  const { data: articleList } = articleListResp;
  const subC =
    (categories &&
      categories.find(sub => {
        return `${sub.id}` === id;
      })) ||
    {};
  return {
    props: {
      id,
      articleList: articleList || [],
      categories: categories || [],
      subCategories: subC.subCategory || []
    }
  };
};

Index.propTypes = {
  id: PropTypes.string.isRequired,
  articleList: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired
};

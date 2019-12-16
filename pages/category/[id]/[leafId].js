/*
 * Copyright (c) 2013-2019. 浙江博圣生物技术股份有限公司 www.biosan.cn. All Rights Reserved.
 */
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
  const subC =
    (categoryResp &&
      categoryResp.data &&
      categoryResp.data.find(sub => {
        return `${sub.id}` === id;
      })) ||
    {};
  return {
    id: id,
    leafId: leafId,
    categories: categoryResp.data || [],
    subCategories: subC.subCategory || []
  };
};

LeafId.propTypes = {
  id: PropTypes.string.isRequired,
  leafId: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired
};

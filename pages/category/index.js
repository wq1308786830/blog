import React, { useCallback, useEffect, useState } from 'react';
import BlogServices from '../../services/BlogServices';
import BigNav from './components/BigNav';
import TimeLineArticleList from './components/TimeLineArticleList';
import CategoryList from './components/CategoryList';
import './index.less';

export default function Index(props) {
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);

  const { id } = props;
  const getAllCategories = async () => {
    const categoryResp = await BlogServices.getAllCategories();
    setCategories(categoryResp.data);
    const subC =
      categoryResp &&
      categoryResp.data &&
      categoryResp.data.find(sub => {
        return sub.id + '' === id;
      });
    subC && setSubCategories(subC.subCategory);
  };

  useEffect(() => {
    getAllCategories();
  }, [id]);

  return (
    <div className="index-container">
      {categories && <BigNav category={categories} />}
      <TimeLineArticleList id={id} articles={[]} />
      {subCategories && <CategoryList category={subCategories} />}
    </div>
  );
}

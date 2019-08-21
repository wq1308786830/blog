import React, { useEffect, useState } from 'react';
import BlogServices from '../../services/BlogServices';
import BigNav from './components/BigNav';
import TimeLineArticleList from './components/TimeLineArticleList';
import CategoryList from './components/CategoryList';
import './index.less';

export default function Index() {
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    const categoryResp = await BlogServices.getAllCategories();
    setCategories(categoryResp.data);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="index-container">
      <BigNav category={categories} />
      <TimeLineArticleList />
      <CategoryList category={categories} />
    </div>
  );
}

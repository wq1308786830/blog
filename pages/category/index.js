import React, { useEffect, useState } from 'react';
import BlogServices from '../../services/BlogServices';
import Layout from '../../components/Layout';
import BigNav from './components/BigNav';
import TimeLineArticleList from './components/TimeLineArticleList';
import CategoryList from './components/CategoryList';

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
    <Layout>
      <BigNav category={categories} />
      <TimeLineArticleList />
      <CategoryList category={categories} />
    </Layout>
  );
}

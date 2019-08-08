import React from 'react';
import BigNav from './components/BigNav';
import TimeLineArticleList from './components/TimeLineArticleList';
import CategoryList from './components/CategoryList';
import fetch from 'isomorphic-unfetch';
import Layout from "../../components/Layout";

export default function Index({categories}) {
  return (
    <Layout>
      <BigNav category={categories} />
      <TimeLineArticleList />
      <CategoryList category={categories} />
    </Layout>
  );
}

Index.getInitialProps = async function() {
  const resp = await fetch('http://localhost:5002/category/getAllCategories');
  const data = await resp.json();
  return {
    categories: data.data
  }
};

import React from 'react';
import BlogServices from '../../services/BlogServices';

const Article = ({ detail }) => {
  return (
    <>
      <h2>{detail.title}</h2>
      <comment>{detail.date_publish}</comment>
      <p>{detail.content}</p>
    </>
  );
};

Article.getInitialProps = async context => {
  const { id } = context.query;
  const res = await BlogServices.getArticleDetail(id);
  console.log(`Show data fetched. Count: ${res.data}`);
  return {
    detail: res.data
  };
};

export default Article;

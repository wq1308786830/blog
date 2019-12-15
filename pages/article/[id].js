import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import BlogServices from '../../services/BlogServices';

const Article = ({ detail }) => {
  const { title, content, text_type: textType, date_publish: datePublish } = detail;
  const createHtml = c => ({ __html: c });
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="author" content="Russell" />
        <meta name="description" content="Russell's blog" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {detail.keywords &&
          detail.keywords.map(keyword => <meta name="keywords" content={keyword} />)}
      </Head>
      <h2>{title}</h2>
      <code>{datePublish}</code>
      {textType === 'html' ? (
        <div dangerouslySetInnerHTML={createHtml(content)} />
      ) : (
        <ReactMarkdown source={content} />
      )}
    </>
  );
};

Article.getInitialProps = async context => {
  const { id } = context.query;
  const res = await BlogServices.getArticleDetail(id);
  return {
    detail: res.data
  };
};

Article.propTypes = {
  detail: PropTypes.object.isRequired
};

export default Article;

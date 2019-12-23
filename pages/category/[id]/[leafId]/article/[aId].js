import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import BlogServices from '../../../../../services/BlogServices';
import BigNav from '../../../../components/BigNav';
import CategoryList from '../../../../components/CategoryList';
import './article.less';

const Article = ({ detail, categories, subCategories }) => {
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
      <main className="doc">
        <main className="main index-container">
          <section>{categories && <BigNav category={categories} />}</section>
          <article className="content">
            <time className="time">
              <strong>{datePublish && datePublish.substring(5, 10)}</strong>
              <span>{datePublish && datePublish.split('-')[0]}</span>
            </time>
            <h1>{title}</h1>
            <div className="article-content">
              {textType === 'html' ? (
                <div dangerouslySetInnerHTML={createHtml(content)} />
              ) : (
                <ReactMarkdown source={content} />
              )}
            </div>
          </article>
          <section>{subCategories && <CategoryList category={subCategories} />}</section>
        </main>
      </main>
    </>
  );
};

Article.getInitialProps = async context => {
  const { id, aId } = context.query;
  const res = await BlogServices.getArticleDetail(aId);
  const categoryResp = await BlogServices.getAllCategories();
  const subC =
    (categoryResp &&
      categoryResp.data &&
      categoryResp.data.find(sub => {
        return `${sub.id}` === id;
      })) ||
    {};
  return {
    detail: res.data || {},
    categories: categoryResp.data || [],
    subCategories: subC.subCategory || []
  };
};

Article.propTypes = {
  detail: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  subCategories: PropTypes.array.isRequired
};

export default Article;

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import BlogServices from '../../../../../services/BlogServices';
import CategoryList from '../../../../components/CategoryList';
import BigNav from '../../../../components/BigNav';

import base from '@/components/base.module.scss';
import css from './article.module.scss';

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
      <main className={base.doc}>
        <main className={`${css.main} ${base.indexContainer}`}>
          <section>{categories && <BigNav category={categories} />}</section>
          <article className={css.content}>
            <time className={`${base.time} ${css.time}`}>
              <strong>{datePublish && datePublish.substring(5, 10)}</strong>
              <span>{datePublish && datePublish.split('-')[0]}</span>
            </time>
            <h1>{title}</h1>
            <div className={css.articleContent}>
              {textType === 'html' ? (
                <div dangerouslySetInnerHTML={createHtml(content)} />
              ) : (
                <ReactMarkdown className={css.markdown-content} source={content} />
              )}
            </div>
          </article>
          <section>{subCategories && <CategoryList category={subCategories} />}</section>
        </main>
      </main>
    </>
  );
};

Article.getServersideProps = async context => {
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

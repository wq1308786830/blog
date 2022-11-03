import React from 'react';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';
import css from '@/styles/article.module.scss';
import markdownCss from '@/styles/markdown.module.scss';

interface ArticleDetailProps {
  title: string;
  content: string;
  datePublish: number;
  textType: string;
}
function ArticleDetail(props: ArticleDetailProps) {
  const { title, content, datePublish, textType } = props;

  const createHtml = (c: string) => ({ __html: c });

  return (
    <main className={css.articleDetail}>
      <div className={css.content}>
        <h1 className={css.h1}>{title}</h1>
        <div className={css.publishInfo}>
          发布时间：<i className={css.time}>{dayjs(datePublish).format('YYYY-MM-DD HH:mm:ss')}</i>
        </div>

        {textType === 'html' ? (
          <div dangerouslySetInnerHTML={createHtml(content)} />
        ) : (
          <ReactMarkdown className={markdownCss.markdown}>{content}</ReactMarkdown>
        )}
      </div>
    </main>
  );
}

export default ArticleDetail;

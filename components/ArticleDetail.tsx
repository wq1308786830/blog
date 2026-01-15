'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import dayjs from 'dayjs';
import css from '@/styles/article.module.scss';
import markdownCss from '@/styles/markdown.module.scss';

interface ArticleDetailProps {
  title: string;
  content: string;
  datePublish: number;
  textType: string;
}

function CodeComponent({ inline = true, className, children, node }: any) {
  const classAttr =
    className || (node && node.properties && node.properties.className ? node.properties.className.join(' ') : '');
  const match = /language-([^\s]+)/.exec(classAttr || '');
  const lang = match ? match[1] : '';

  if (inline || !lang) {
    return <code className={markdownCss.inlineCode}>{children}</code>;
  }

  return (
    <SyntaxHighlighter
      style={oneDark}
      language={lang || 'text'}
      PreTag="div"
      className={markdownCss.codeBlock}
      customStyle={{
        margin: '16px 0',
        padding: '14px',
        borderRadius: '14px',
        fontSize: '14px',
        lineHeight: '1.7',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
      }}
      wrapLongLines
      showLineNumbers
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
}

const markdownComponents = {
  code: CodeComponent,
};

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
          <div className="leading-relaxed text-gray-600" dangerouslySetInnerHTML={createHtml(content)} />
        ) : (
          <ReactMarkdown className={markdownCss.markdown} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </main>
  );
}

export default ArticleDetail;

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

function CodeComponent({ inline, className, children, node }: any) { 
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
    <main className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="relative z-10">
        <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold uppercase text-[var(--primary)] tracking-widest leading-tight mb-4 text-shadow-lg">
                {title}
            </h1>
            <div className="flex justify-center items-center gap-4 text-xs font-mono text-[var(--muted)] uppercase tracking-widest">
                <span className="px-2 py-1 bg-[var(--card)] border border-[var(--border)]">
                    LOG_DATE: {dayjs(datePublish).format('YYYY-MM-DD HH:mm:ss')}
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
                <span className="px-2 py-1 bg-[var(--card)] border border-[var(--border)]">
                    TYPE: {textType || 'MARKDOWN_DOC'}
                </span>
            </div>
        </div>

        <div className="cyber-border p-6 md:p-10 bg-black/50 backdrop-blur-sm">
            {textType === 'html' ? (
            <div className="leading-relaxed text-gray-300 font-mono" dangerouslySetInnerHTML={createHtml(content)} />
            ) : (
            <ReactMarkdown className={markdownCss.markdown} components={markdownComponents}>
                {content}
            </ReactMarkdown>
            )}
        </div>
      </div>
    </main>
  );
}

export default ArticleDetail;

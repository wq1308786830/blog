'use client';

import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import dayjs from 'dayjs';
import type { ArticleDetailProps } from '@/types';
import '@/app/markdown.css';

/**
 * 代码高亮组件 - React 19 优化
 */
const CodeComponent = memo<{
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  node?: any;
}>(({ inline, className, children, node }) => {
  const classAttr = className || (node?.properties?.className?.join(' ') ?? '');
  const match = /language-([^\s]+)/.exec(classAttr);
  const lang = match?.[1] ?? '';

  // 内联代码
  if (inline || !lang) {
    return <code className="inlineCode">{children}</code>;
  }

  // 代码块样式 - React 19 优化的 useMemo
  const codeBlockStyle = useMemo(() => ({
    margin: '16px 0',
    padding: '14px',
    borderRadius: '14px',
    fontSize: '14px',
    lineHeight: '1.7',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
  }), []);

  return (
    <SyntaxHighlighter
      style={oneDark}
      language={lang}
      PreTag="div"
      className="codeBlock"
      customStyle={codeBlockStyle}
      wrapLongLines
      showLineNumbers
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
});

CodeComponent.displayName = 'CodeComponent';

/**
 * Markdown 组件配置 - React 19 优化
 */
const markdownComponents = {
  code: CodeComponent,
  // 其他组件可以在这里添加
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-3xl font-bold text-[var(--primary)] mb-4">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-[var(--text)] mb-3">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-[var(--text)] mb-2">{children}</h3>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-[var(--primary)] pl-4 my-4 italic text-[var(--muted)]">
      {children}
    </blockquote>
  ),
};

/**
 * 文章头部信息组件
 */
const ArticleHeader = memo<{
  title: string;
  datePublish: number;
  textType: string;
}>(({ title, datePublish, textType }) => {
  const formattedDate = useMemo(() => 
    dayjs(datePublish).format('YYYY-MM-DD HH:mm:ss'), 
    [datePublish]
  );

  return (
    <div className="mb-10 text-center">
      <h1 className="text-3xl md:text-5xl font-display font-bold uppercase text-[var(--primary)] tracking-widest leading-tight mb-4 text-shadow-lg">
        {title}
      </h1>
      <div className="flex justify-center items-center gap-4 text-xs font-mono text-[var(--muted)] uppercase tracking-widest">
        <span className="px-2 py-1 bg-[var(--card)] border border-[var(--border)]">
          LOG_DATE: <time dateTime={dayjs(datePublish).toISOString()}>{formattedDate}</time>
        </span>
        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
        <span className="px-2 py-1 bg-[var(--card)] border border-[var(--border)]">
          TYPE: {textType || 'MARKDOWN_DOC'}
        </span>
      </div>
    </div>
  );
});

ArticleHeader.displayName = 'ArticleHeader';

/**
 * 文章内容组件
 */
const ArticleContent = memo<{
  content: string;
  textType: string;
}>(({ content, textType }) => {
  // HTML 内容渲染函数 - React 19 优化
  const createHtml = useMemo(() => 
    textType === 'html' ? { __html: content } : null, 
    [content, textType]
  );

  return (
    <div className="cyber-border p-6 md:p-10 bg-black/50 backdrop-blur-sm">
      {textType === 'html' ? (
        <div 
          className="leading-relaxed text-gray-300 font-mono" 
          dangerouslySetInnerHTML={createHtml!} 
        />
      ) : (
        <ReactMarkdown 
          className="markdown" 
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
});

ArticleContent.displayName = 'ArticleContent';

/**
 * React 19 优化的文章详情组件
 */
export const ArticleDetail = memo<ArticleDetailProps>(({ article }) => {
  const { title, content, date_publish: datePublish, text_type: textType } = article;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="relative z-10">
        <ArticleHeader 
          title={title}
          datePublish={datePublish}
          textType={textType}
        />
        <ArticleContent 
          content={content}
          textType={textType}
        />
      </div>
    </main>
  );
});

ArticleDetail.displayName = 'ArticleDetail';

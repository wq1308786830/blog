import React, { use } from 'react';
import { getArticleDetail } from '@/services/blog';
import ArticleDetail from '@/components/ArticleDetail';

interface ArticlePageProps {
  params: Promise<{
    categoryId: string;
    leafId: string;
    articleId: string;
  }>;
}

function ArticlePage(props: ArticlePageProps) {
  const params = use(props.params);
  const { articleId } = params;
  const resp = use(getArticleDetail({ articleId }));

  if (!resp.data) {
    return <div className="text-[var(--muted)]">Article not found</div>;
  }

  const { title, content, date_publish: datePublish, text_type: textType } = resp.data;

  return (
    <ArticleDetail title={title} datePublish={datePublish} textType={textType} content={content} />
  );
}

export default ArticlePage;

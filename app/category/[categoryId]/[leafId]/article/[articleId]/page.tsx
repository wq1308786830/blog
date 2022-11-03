import React, { use } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import type { PageProps } from '@/libs/data.d';
import { getArticleDetail } from '@/libs/blog';
import ArticleDetail from '@/ui/ArticleDetail';

function Page(props: PageProps<{ articleId: string }>) {
  const {
    params: { articleId },
  } = props;

  const resp = use(getArticleDetail(articleId));
  if (!resp.data) {
    return null;
  }

  const { title, content, date_publish: datePublish, text_type: textType } = resp.data;

  return (
    <ArticleDetail title={title} datePublish={datePublish} textType={textType} content={content} />
  );
}

export default Page;

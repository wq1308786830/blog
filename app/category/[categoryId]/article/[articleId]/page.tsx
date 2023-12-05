import React, { use } from 'react';
import Image from 'next/image';
import type { PageProps } from '@/services/data.d';
import { getArticleDetail } from '@/services/blog';
import ArticleDetail from '@/components/ArticleDetail';

function Page(props: PageProps<{ articleId: string }>) {
  const {
    params: { articleId },
  } = props;

  const resp = use(getArticleDetail(articleId));
  if (!resp.data) {
    return <Image src="https://api.dujin.org/bing/1920.php" width={1920} height={1080} alt="" />;
  }

  const { title, content, date_publish: datePublish, text_type: textType } = resp.data;

  return (
    <ArticleDetail title={title} datePublish={datePublish} textType={textType} content={content} />
  );
}

export default Page;

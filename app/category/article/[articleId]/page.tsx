import React, { use } from 'react';
import Image from 'next/image';
import { getArticleDetail } from '@/services/blog';
import ArticleDetail from '@/components/ArticleDetail';

interface ArticlePageProps {
  params: Promise<{
    articleId: string;
  }>;
}

function Page(props: ArticlePageProps) {
  const params = use(props.params);
  const { articleId } = params;
  const resp = use(getArticleDetail({ articleId }));
  
  if (!resp.data) {
    return <Image src="https://api.dujin.org/bing/1920.php" width={1920} height={1080} alt="" />;
  }

  const { title, content, date_publish: datePublish, text_type: textType } = resp.data;

  return (
    <ArticleDetail title={title} datePublish={datePublish} textType={textType} content={content} />
  );
}

export default Page;

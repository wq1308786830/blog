import React, { use } from 'react';
import Image from 'next/image';
import { getArticleDetail } from '@/services/blog';
import { ArticleDetail } from '@/components/ArticleDetail';

interface ArticlePageProps {
  params: Promise<{
    categoryId: string;
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

  return <ArticleDetail article={resp.data} />;
}

export default Page;

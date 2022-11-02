import React, { use } from 'react';
import type { PageProps } from '@/libs/data.d';
import { getArticleDetail } from '@/libs/blog';

function Page(props: PageProps<{ articleId: string }>) {
  const {
    params: { articleId },
  } = props;

  const resp = use(getArticleDetail(articleId));
  if (!resp.data) {
    return null;
  }
  const { title, description, content, date_publish } = resp.data;

  return (
    <main>
      <h1>{title}</h1>
      <div>{content}</div>
      <i>{date_publish}</i>
    </main>
  );
}

export default Page;

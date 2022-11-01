import React from 'react';
import css from '@/styles/article.module.scss';

function Page(props: any) {
  console.log(props);
  return <div className={css.main} />;
}

export default Page;

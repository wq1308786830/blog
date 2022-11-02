import React from 'react';
import '@/styles/dist.css';
import type { PageProps } from '@/libs/data.d';

export default function RootLayout(props: PageProps<any>) {
  const { children } = props;
  return (
    <html lang="zh-CN">
      <head>
        <title>Russell</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}

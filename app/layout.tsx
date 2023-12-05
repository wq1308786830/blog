import React from 'react';
import type { PageProps } from '@/services/data.d';
import '@/styles/dist.css';

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

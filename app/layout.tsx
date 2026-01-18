import React from 'react';
import type { Metadata } from 'next';
import type { PageProps } from '@/services/data.d';
import '@/styles/dist.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Russell',
  description: '思考、写作、构建 - 让想法落地',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout(props: PageProps<any>) {
  const { children } = props;
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

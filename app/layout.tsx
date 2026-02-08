import React from 'react';
import type { Metadata, Viewport } from 'next';
import type { LayoutProps } from '@/types';
import '@/styles/dist.css';
import './globals.css';

// React 19 优化的元数据
export const metadata: Metadata = {
  title: {
    default: 'Russell',
    template: '%s | Russell - 思考、写作、构建',
  },
  description: '思考、写作、构建 - 让想法落地。记录前端、后端以及哲学与人文的思考痕迹。',
  keywords: ['前端开发', '后端开发', '技术博客', '哲学思考', 'React', 'Next.js'],
  authors: [{ name: 'Russell' }],
  creator: 'Russell',
  publisher: 'Russell',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://blogru.vercel.app',
    title: 'Russell - 思考、写作、构建',
    description: '思考、写作、构建 - 让想法落地',
    siteName: 'Russell Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Russell - 思考、写作、构建',
    description: '思考、写作、构建 - 让想法落地',
  },
};

// React 19 视口配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

/**
 * React 19 优化的根布局组件
 * 使用 Server Component 提升性能
 */
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://api.dujin.org" />
        <link rel="dns-prefetch" href="https://api.dujin.org" />
        
        {/* 性能优化 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* 备案信息 */}
        <meta name="beian" content="浙ICP备19021274号-2" />
      </head>
      <body className="antialiased">
        {/* React 19 的 Suspense 边界 */}
        <React.Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--primary)]" />
            </div>
          }
        >
          {children}
        </React.Suspense>
      </body>
    </html>
  );
}

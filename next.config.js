const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19 优化配置
  experimental: {
    // 启用 React 19 的新特性
    reactCompiler: true,
    // 优化服务端组件
    serverComponentsExternalPackages: ['react-markdown', 'react-syntax-highlighter'],
  },
  
  // 样式配置
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  
  // 页面扩展名
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dujin.org',
        port: '',
        pathname: '/**',
      },
    ],
    // React 19 图片优化
    formats: ['image/webp', 'image/avif'],
  },
  
  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false, // 改为 false 以确保类型安全
  },
  
  // 编译优化
  compiler: {
    // 移除 console.log (生产环境)
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 缓存优化
  onDemandEntries: {
    // 页面在内存中保留的时间
    maxInactiveAge: 25 * 1000,
    // 同时保留的页面数
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;

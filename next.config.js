const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 实验性功能配置
  experimental: {
  },
  
  // 启用 React 19 Compiler
  reactCompiler: true,
  
  // 优化服务端组件
  serverExternalPackages: ['react-markdown', 'react-syntax-highlighter'],

  // 启用 Turbo 模式（如果可用）
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
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
    // 图片格式优化
    formats: ['image/webp', 'image/avif'],
  },
  
  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false, // 确保类型安全
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
  
  // // Webpack 配置
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   // 优化 bundle 大小
  //   if (!dev && !isServer) {
  //     config.optimization.splitChunks.cacheGroups = {
  //       ...config.optimization.splitChunks.cacheGroups,
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     };
  //   }
    
    // return config;
  // },
};

module.exports = nextConfig;

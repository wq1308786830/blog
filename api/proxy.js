// api/proxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  let target = '';

  // 根据请求路径确定代理目标
  if (['article', 'category', 'weChat'].some(s => req.url.includes(s))) {
    target = 'http://34.92.107.2:5002'; // 替换为你的实际后端地址
  }

  // 如果没有匹配到任何代理路径，可以返回错误或直接响应
  if (!target) {
    res.status(500).json({ error: 'Invalid proxy target' });
    return;
  }

  // 创建并执行代理中间件
  createProxyMiddleware({
    target,
    changeOrigin: true, // 修改请求头中的Host为目标URL的origin，通常需要开启[5](@ref)
    pathRewrite: {
      '^/article/': '/article/', // 重写路径：移除路径中的 '/backend' 前缀
      '^/category/': '/category/', // 重写路径：移除路径中的 '/backend' 前缀
      '^/weChat/': '/weChat/', // 重写路径：移除路径中的 '/backend' 前缀
    },
    // 可根据需要添加其他http-proxy选项[5](@ref)
  })(req, res);
};

module.exports = {
  generateEtags: true,
  assetPrefix: '',
  env: {
    ENV_NAME: process.env.ENV_NAME,
  },
  pageExtensions: ['mdx', 'jsx', 'js', 'ts', 'tsx'],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // console.log(webpack);
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config

    // Important: return the modified config
    return config;
  },
};

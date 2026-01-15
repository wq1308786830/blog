export const env = process.env.NODE_ENV;

export const Config = {
  production: 'https://blog-proxy-nine.vercel.app',
  test: 'https://blog-proxy-nine.vercel.app',
  development: 'https://blog-proxy-nine.vercel.app',
};

export const prefix = Config[env];
// export const prefix = Config.test;

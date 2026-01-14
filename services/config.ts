export const env = process.env.NODE_ENV;

export const Config = {
  production: 'https://blogru.vercel.app',
  test: 'https://blogru.vercel.app',
  development: 'http://localhost:5002',
};

export const prefix = Config[env];
// export const prefix = Config.test;

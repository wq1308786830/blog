export const env = process.env.NODE_ENV;

export const Config = {
  production: 'http://34.92.107.2:5002',
  test: 'http://34.92.107.2:5002',
  development: 'http://localhost:5002',
};

export const prefix = Config[env];
// export const prefix = Config.test;

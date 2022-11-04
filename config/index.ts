export let env = process.env.NODE_ENV;

export const Config = {
  production: 'http://81.69.247.116:5002',
  development: 'http://localhost:5002',
};

env = 'production';

export const prefix = Config[env];

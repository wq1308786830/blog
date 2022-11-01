export let env = process.env.NODE_ENV;

export const Config = {
  foreignPrefix: 'http://104.156.250.95:7001',
  production: 'http://47.112.23.45:5002',
  development: 'http://localhost:5002',
};

env = 'development';

export const prefix = Config[env];

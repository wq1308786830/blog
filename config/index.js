let env = process.env.NODE_ENV;

const Config = {
  foreignPrefix: 'http://104.156.250.95:7001',
  production: 'https://api.russellwq.club',
  development: 'http://localhost:5002'
};

env = 'production';

const prefix = Config[env];

export default {
  env,
  Config,
  prefix
};

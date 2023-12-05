export let env = process.env.NODE_ENV;

export const Config = {
  production: 'http://gin.web-framework-wcof.1681718655914897.cn-hangzhou.fc.devsapp.net',
  development: 'http://localhost:5002',
};

env = 'production';

export const prefix = Config[env];

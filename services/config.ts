export const env = process.env.NODE_ENV;

export const Config = {
  production: 'http://gin.web-framework-wcof.1681718655914897.cn-hangzhou.fc.devsapp.net',
  test: 'http://gin.web-framework-wcof.1681718655914897.cn-hangzhou.fc.devsapp.net',
  development: 'http://localhost:5002',
};

export const prefix = Config[env];
// export const prefix = Config.test;

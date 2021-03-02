module.exports = {
  apps: [
    {
      cwd: './',
      script: 'start.js',
      // watch: '.',
      name: 'blog-next-js',
      exec_mode: 'fork',
      instances: 1,
      // wait_ready: true,
      // shutdown_with_message : true,
      listen_timeout: 3000,
      env: {
        ENV_NAME: 'test',
      },
      env_test: {
        ENV_NAME: 'test',
      },
      env_prod: {
        ENV_NAME: 'prod',
      },
    },
  ],

  out_file: 'NULL',
  error_file: 'NULL',

  // deploy: {
  //   production: {
  //     user: 'SSH_USERNAME',
  //     host: 'SSH_HOSTMACHINE',
  //     ref: 'origin/master',
  //     repo: 'GIT_REPOSITORY',
  //     path: 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy': 'yarn && pm2 reload ecosystem.config.js --env prod',
  //     'pre-setup': '',
  //   },
  // },
};

module.exports = {
  apps: [
    {
      name: 'cidedec-backend',
      script: './server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      max_memory_restart: '1G',
      combine_logs: true,
      merge_logs: true,
      error_file: './logs/pm2_error.log',
      out_file: './logs/pm2_out.log'
    }
  ]
};

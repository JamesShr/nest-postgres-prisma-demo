module.exports = {
  port: {
    __name: 'PORT',
    __format: 'json',
  },
  database: {
    url: 'DATABASE_URL',
  },

  redis: {
    host: 'REDIS_HOST',
    port: {
      __name: 'REDIS_PORT',
      __format: 'json',
    },
    db: {
      __name: 'REDIS_DB',
      __format: 'json',
    },
    password: 'REDIS_PASSWORD',
  },
};

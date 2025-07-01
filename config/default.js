/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require('../package.json');

module.exports = {
  version,
  port: 3000,
  database: {
    url: 'postgresql://user:password@localhost:5432/db?schema=public',
  },

  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    password: '',
  },
};

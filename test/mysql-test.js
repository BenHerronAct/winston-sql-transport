/**
 * @module 'mysql-test'
 * @fileoverview Tests of winston transport for logging into MySQL
 * @license MIT
 * @author Andrei Tretyakov <andrei.tretyakov@gmail.com>
 */

const assert = require('assert');
const { Logger } = require('winston');
const { SQLTransport } = require('./../lib/winston-sql-transport');
const transport = require('./transport.js');
const vows = require('vows');

const logger = new Logger({
  transports: [
    new SQLTransport({
      client: 'mysql',
      connection: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
      },
      name: 'MySQL',
      pool: {
        min: 0,
        max: 10
      },
      tableName: 'winston_logs'
    })
  ]
});

vows
  .describe('winston-sql-transport')
  .addBatch({
    'An instance of the SQL Transport - MySQL': {
      topic: function topic() {
        const { callback } = this;
        logger.transports.SQLTransport.init().then(() => callback(null, true));
      },
      'should create table': (err, result) => {
        assert.isNull(err);
        assert.ok(result === true);
      }
    }
  })
  .addBatch({
    'An instance of the SQL Transport - MySQL': transport(logger, logger.transports.SQLTransport)
  })
  .export(module);

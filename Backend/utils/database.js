const mysql = require("mysql");
const logger  = require("./logger");

require("dotenv").config();

let pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});
pool.on('acquire', function (connection) {
    logger.info('Connection %d acquired', connection.threadId);
  });
  pool.on('enqueue', function () {
    logger.info('Waiting for available connection slot');
  });
  pool.on('release', function (connection) {
    logger.info('Connection %d released', connection.threadId);
  });
module.exports = pool;

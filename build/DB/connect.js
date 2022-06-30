"use strict";

var _require = require('pg'),
    Client = _require.Client;

var configDB = {
  user: 'postgres',
  host: 'localhost',
  port: '5432',
  password: 'systel',
  database: 'cuora_clara',
  statement_timeout: 20000
};
var pool = new Client(configDB);
pool.connect().then(function () {
  return console.log('DB connected!!!');
})["catch"](function (err) {
  return console.error('DB Connected error!!!');
});
module.exports = pool;
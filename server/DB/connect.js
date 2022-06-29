const {Client} = require('pg');

const configDB = {
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    password: 'systel',
    database: 'cuora_clara',
    statement_timeout: 20000        
}

const pool = new Client(configDB);
pool
    .connect()
    .then(() => console.log('DB connected!!!'))
    .catch((err) => console.error('DB Connected error!!!'))



module.exports = pool;














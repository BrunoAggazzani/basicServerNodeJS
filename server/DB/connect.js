import { Client } from 'pg';

const configDB = {
    user: 'systel',
    host: '192.168.2.198',
    port: '5432',
    password: 'Systel#4316',
    database: 'cuora',
    statement_timeout: 20000        
}

export const pool = new Client(configDB);
pool
    .connect()
    .then(() => console.log('DB connected!!!'))
    .catch((err) => console.error('DB Connected error!!!'))


















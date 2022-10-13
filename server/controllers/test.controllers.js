import { connect, query } from 'mssql'

export const sqlServerConnect = async (req, res) => {
    console.log('Conectando SQL Server...');
    
    const sqlConfig = {
      user: req.body.user,
      password: req.body.pass,
      database: req.body.db_name,
      server: req.body.ip,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: false, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
      }
    }
    
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await connect(sqlConfig);
        const result = await query`select * from dbo.productos`;
        console.log('Result SQL Server: '+JSON.stringify(result.recordset[0]));
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result.recordset[0]));
    } catch (err) {
        console.log(err);
        res.status(404).send('<h1>Test failed!</h1>');
    }    
}
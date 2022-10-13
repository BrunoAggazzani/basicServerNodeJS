import { connect, query, close } from 'mssql'

export const sqlServerConnect = async (req, res) => {
    console.log('Conectando SQL Server...');
    console.log('Datos para la conexion: '+JSON.stringify(req.body));
    let data = req.body;
    
    const sqlConfig = {
      user: data.user,
      password: data.pass,
      database: data.db_name,
      server: data.ip,
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
    let resultado = null;
    try {
        await connect(sqlConfig);
        const result = await query`select * from dbo.productos`;        
        resultado = JSON.stringify(result.recordset[0]);
        console.log('Resultado: '+resultado);
        res.setHeader('Content-Type', 'application/json');
        res.send(resultado);
        close();
    } catch (err) {
        console.log(err);
        console.log('Resultado: '+JSON.stringify(resultado));
        res.send(JSON.stringify(resultado));
        close();
    }
    data = {};    
}
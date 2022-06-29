const controller = {};
const pool = require('./DB/connect.js');
const http = require("http");


controller.inicio = async(req, res) => {
    try {
        req = await pool.query(`SELECT username FROM public.tb_user`);
        if (req.rows.length > 0) {
            console.log('');
            console.log('Mostrando registros encontrados...');
            console.log('');
            console.log(req.rows[0].username);
            const result = {usuarios: req.rows};                    
            res.render('Inicio/inicio.ejs', {data: result} );
        } else {
            console.log('');
            console.log('No se encontraron registros...');
            console.log('');
            res.status(201).send('noRecords');
            //res.end('lala');
        }
        //await pool.end();        
    } catch (e) {
        console.log('');
        console.log('Fallo ejecucion query !!!');
        console.log('');
        res.status(201).send('failed');
        //pool.end();        
    }
    
};

controller.queEsSaft = async(req, res) => {
    res.render('queessaft');
};

module.exports = controller;
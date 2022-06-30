import {pool} from '../DB/connect.js';

export const signin = async(req, res)=>{
    try{
        req = await pool.query('SELECT username FROM public.tb_user');       
            if (req.rows) {
                console.log('');
                console.log('Mostrando registros encontrados...');
                console.log('');
                console.log('Ejemplo de un resultado: '+req.rows[0].username);
                const resultado = {usuarios: req.rows};                    
                res.status(200).render('Inicio/inicio.ejs', {data: resultado} );
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }      
    } catch {
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        
    }       
}


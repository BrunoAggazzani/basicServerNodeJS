import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

export const getAbmPlu = async (req, res)=>{

    const data = req.body;

    let PLUlist = [];

    try{
        req = await pool.query("SELECT p.product_id AS id, p.name AS name, p.erp_code AS erp, p.isactive AS activo, p.description AS descripcion, p.department_id, d.name AS departamento, p.group_id, g.name AS grupo, p.attribute AS tipo, p.tare AS tara FROM public.product p JOIN public.department d ON p.department_id = d.department_id JOIN public. main_group g ON p.group_id = g.group_id WHERE p.product_id != '0'");       
            if (req.rows.length > 0) {
                req.rows.map((e)=>{
                    let PLU = {
                        id: e.id,
                        name: e.name,
                        erp: e.erp,
                        activo: e.activo,
                        descripcion: e.descripcion,
                        depto: e.departamento,
                        grupo: e.grupo,
                        tipo: e.tipo,
                        tara: e.tara
                    }
                    PLUlist.push(PLU);
                });
                console.log('PLUlist: '+JSON.stringify(PLUlist[0]));
                console.log('PLUlist: '+PLUlist[0].name);

                const result = JSON.stringify(PLUlist);
                    
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('ABM/Plu/plu1_0.ejs', {data: result});
                
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }      
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log(e);
        console.log('Falló ejecución de query');
    }

    if (data.PLU) {
        console.log('lalala');
    }

};
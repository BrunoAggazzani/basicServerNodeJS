import {pool} from '../DB/connect';
import CryptoJS from 'crypto-js';

export const getSearchPriceList = async(req, res)=>{
    console.log('Entrando en getSearchPriceList...');
    try{
        req = await pool.query("SELECT pricelist_version_id AS id, name FROM public.pricelist_version WHERE pricelist_id != '#'");       
            if (req.rows) {
                console.log('');
                console.log('Mostrando registros encontrados...');
                console.log('');
                console.log('Primer resultado: name = '+req.rows[0].name+' id = '+req.rows[0].id);
                const resultado = {priceList: req.rows};                    
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/price.ejs', {data: resultado});
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }
            //pool.end();      
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        //pool.end();
    }   
};

export const getTablePriceList = async(req, res)=>{

    console.log('Entrando en getTablePriceList...');
    const data = req.body;
    let pricelist_name = '';
    let pricelist_id = '';
    let product = '';

    pricelist_name = data.priceList_name;
    pricelist_id = data.priceList_id;
    if (data.product){
        product = data.product;
    }
    
    console.log('priceList name: '+pricelist_name);
    console.log('priceList id: '+pricelist_id);
    console.log('product: '+product);

    try{
        if (product != ''){
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pricelist_version_id = '"+pricelist_id+"' AND p.name ILIKE '"+product+"%' ORDER BY pp.product_id");       
            if (req.rows) {
                console.log('');
                console.log('Mostrando registros encontrados...');
                console.log('');
                console.log('Primer resultado: ID= '+req.rows[0].product_id+' PLU= '+req.rows[0].name+' Precio= '+req.rows[0].pricelist);
                const resultado = {priceList: req.rows};                    
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/table.ejs', {data: resultado});
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }
        } else if (product == ''){
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pricelist_version_id = '"+pricelist_id+"' ORDER BY pp.product_id");       
            if (req.rows) {
                console.log('');
                console.log('Mostrando registros encontrados...');
                console.log('');
                console.log('Ejemplo de un resultado: ID= '+req.rows[0].product_id+' PLU= '+req.rows[0].name+' Precio= '+req.rows[0].pricelist);
                const resultado = {priceList: req.rows};                    
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/table.ejs', {data: resultado});
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }
        }                  
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
    }   
};

export const getTableChanged = async(req, res)=>{
    console.log('Entrando en getTableChanged...');

    // Scá va el update a la tabla.

    const data = req.body;
    let pricelist_id = data.id;
    console.log('ID obtenido: '+pricelist_id);
    try{
        req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pricelist_version_id = '"+pricelist_id+"' ORDER BY pp.product_id");       
            if (req.rows) {
                console.log('');
                console.log('Mostrando registros encontrados...');
                console.log('');
                console.log('Ejemplo de un resultado: ID= '+req.rows[0].id+' PLU= '+req.rows[0].name+' Precio= '+req.rows[0].price);
                const resultado = {priceList: req.rows};                    
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/table.ejs', {data: resultado});
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }
            //pool.end();      
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        //pool.end();
    }   
};
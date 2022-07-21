import {pool} from '../DB/connect';
import CryptoJS from 'crypto-js';


let product = '';
export const getSearchPriceList = async(req, res)=>{
    product = '';
    try{
        req = await pool.query("SELECT pricelist_version_id AS id, name FROM public.pricelist_version WHERE pricelist_id != '#'");       
            if (req.rows) {
                const resultado = {priceList: req.rows};                    
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/price.ejs', {data: resultado});
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }      
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
    }   
};


export const getTablePriceList = async(req, res)=>{

    console.log('Entrando en getTablePriceList...');
    const data = req.body;
    let pricelist_name = '';
    let pricelist_id = '';
    //let product = '';

    pricelist_name = data.priceList_name;
    pricelist_id = data.priceList_id;
    if (data.product){
        product = data.product;
    }
    try{
        if (product != ''){
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price,  pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+pricelist_id+"' AND p.name ILIKE '"+product+"%' ORDER BY pp.product_id");       
            if (req.rows.length > 0) {
                const resultado = {priceList: req.rows}; 
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/table.ejs', {data: resultado});
            } else {
                console.log('');
                res.status(404).send('<h2 style="position: relative; top: 45%; padding: 5%; text-align: center">La búsqueda no arrojó resultados.<br/>No sea boludo, ¡escriba bién!</h2>');
                console.log('');
            }
        } else if (product == ''){
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price, pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+pricelist_id+"' ORDER BY pp.product_id");       
            if (req.rows.length > 0) {
                const resultado = {priceList: req.rows};               
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/table.ejs', {data: resultado});
            } else {
                console.log('');
                res.status(404).send('<h2 style="position: relative; top: 45%; padding: 5%; text-align: center">La búsqueda no arrojó resultados.<br/>No sea boludo, ¡escriba bién!</h2>');
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

    const data = req.body;
    let id = data.id;
    let price = data.newPrice;
    let listprice = data.listprice;

    try{
        req = await pool.query("UPDATE productprice SET pricelist = "+price+", updated = NOW() WHERE product_id = '"+id+"' AND pricelist_version_id = '"+listprice+"'");                 
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
    }
    
    try{
        if (product != ''){
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price,  pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+listprice+"' AND p.name ILIKE '"+product+"%' ORDER BY pp.product_id");       
            if (req.rows) {
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
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price, pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+pricelist_id+"' ORDER BY pp.product_id");       
            if (req.rows) {
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
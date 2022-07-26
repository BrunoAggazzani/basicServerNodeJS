import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

//################################   variables globales #####################################

let datos = {

    search: {
        list_id: [],
        list_name: [],
    },

    result_search: {
        list_id: '',
        prod_like_name: '',
    },

    table: {

        product_price: {
            prod_id: [],
            prod_name: [],
            prod_price: [],
        },

        pagination: {
            mostrar: 100,
            pagActual: 1, // por defecto
            totalPaginas: 0,
            forMinimo: 0,
            forMaximo: 0,
            totalRegist: 0,
            view_ALL: false
        },

    },    
    
}

//########################################### Show Search Form ##############################

export const getFormSearch = async(req, res)=>{

    datos.search.list_id = [];
    datos.search.list_name = [];

    try{
        req = await pool.query("SELECT pricelist_version_id AS list_id, name as list_name FROM public.pricelist_version WHERE pricelist_id != '#'");       
            if (req.rows.length > 0) {
                req.rows.map((e)=>{
                    datos.search.list_id.push(e.list_id);
                    datos.search.list_name.push(e.list_name);
                });
                //console.log('array de list_name 2º: '+JSON.stringify(datos.search.list_name));

                const resultado = {
                    list_id: datos.search.list_id,
                    list_name: datos.search.list_name
                }
                
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('Price/search.ejs', {data: resultado});
                
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

//########################################## Show Table ####################################

export const getTablePriceList = async(req, res)=>{

    const data = req.body;

    //################## Desde donde llaman a  getTablePriceList ?

    if (data.priceList_id) { // llaman a getTablePriceList desde el form de búsqueda.
       console.log('Cargando tabla...'); 
       datos.result_search.list_id = data.priceList_id;
       if (req.body.product) {
            datos.result_search.prod_like_name = data.product; 
       } else {
            datos.result_search.prod_like_name = '';
       } 
    }
    
    if (data.newPrice) { // llaman a getTablePriceList desde actualización de precio.
        console.log('Actualizando precio...');
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
    }

    if (data.inputPage){ // llaman a getTablePriceList desde actualización de página.
        console.log('Actualizando página...');
        datos.table.pagination.pagActual = data.inputPage;
    }

    try{
        if (datos.result_search.prod_like_name != ''){
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price,  pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+datos.result_search.list_id+"' AND p.name ILIKE '"+datos.result_search.prod_like_name+"%' ORDER BY pp.product_id");       
        } else if (datos.result_search.prod_like_name == '') {
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price, pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+datos.result_search.list_id+"' ORDER BY pp.product_id");       
        }
        
        if (req.rows.length > 0) {
            let prod_ID = [];
            let prod_NAME = [];
            let prod_PRICE = [];

            datos.table.product_price.prod_id = [];
            datos.table.product_price.prod_name = [];
            datos.table.product_price.prod_price = [];

            //###### Load arrays (for columns) with all results #######
            req.rows.map((e)=>{ 
                prod_ID.push(e.id);
                prod_NAME.push(e.name);
                prod_PRICE.push(e.price);
            });

            // ################ Pagination ###########################
            datos.table.pagination.totalRegist = req.rows.length;
            datos.table.pagination.totalPaginas = Math.trunc(datos.table.pagination.totalRegist / datos.table.pagination.mostrar) + 1;
            datos.table.pagination.forMinimo = (datos.table.pagination.pagActual - 1 ) * datos.table.pagination.mostrar;
            datos.table.pagination.forMaximo = datos.table.pagination.pagActual * datos.table.pagination.mostrar;
            if (datos.table.pagination.forMaximo > datos.table.pagination.totalRegist){
                let forMax = (datos.table.pagination.totalRegist - datos.table.pagination.forMinimo) + datos.table.pagination.forMinimo;
                datos.table.pagination.forMaximo = forMax;
            }

            if (datos.table.pagination.view_ALL === true){ // Aun no está en uso.
                datos.table.product_price.prod_id = prod_ID;
                datos.table.product_price.prod_name = prod_NAME;
                datos.table.product_price.prod_price = prod_PRICE;
            } else {
                for (let i = datos.table.pagination.forMinimo; i < datos.table.pagination.forMaximo; i++) {                                           
                    let aux_prod_ID = prod_ID[i];
                    let aux_prod_NAME = prod_NAME[i];
                    let aux_prod_PRICE = prod_PRICE[i];
                    datos.table.product_price.prod_id.push(aux_prod_ID);
                    datos.table.product_price.prod_name.push(aux_prod_NAME);
                    datos.table.product_price.prod_price.push(aux_prod_PRICE);
                }                
            }    
            console.log('Cantidad productos: '+datos.table.product_price.prod_id.length);
            // ############ Result Object #######################             
            const resultado = {
                product: {
                    pid: datos.table.product_price.prod_id,
                    pname: datos.table.product_price.prod_name,
                    pprice: datos.table.product_price.prod_price
                },
                page: {
                    pagActual: datos.table.pagination.pagActual,
                    totalPaginas: datos.table.pagination.totalPaginas,
                    forMinimo: datos.table.pagination.forMinimo,
                    forMaximo: datos.table.pagination.forMaximo,
                    regTotal: datos.table.pagination.totalRegist
                }
            };
            res
            .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .status(200).render('Price/table.ejs', {data: resultado});
        } else {
            console.log('');
            res.status(404).send('<h2 style="position: relative; top: 45%; padding: 5%; text-align: center">La búsqueda no arrojó resultados.<br/>No sea boludo, ¡escriba bién!</h2>');
            console.log('');
        }                  
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
    }   
};

//########################################## Update Price ##################################
export const updateProductPrice = async(req, res)=>{

    
    const data = req.body;

    if (data.newPrice) {
        console.log('Actualizando precio...');
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
        getTablePriceList(data);
    }
}

export const pagination = async(req, res)=>{
    
    const data = req.body;

    if (data.inputPage){
        console.log('Actualizando página...');
        datos.table.pagination.pagActual = data.inputPage;
    }
}



//##################################################3    eliminar  #####################################################3
/*
export const getTableChanged = async(req, res)=>{
    console.log('Entrando en getTableChanged...');    

    const data = req.body;
    let id = data.id;
    let price = data.newPrice;//###################
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
*/
import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

//################################   variables globales #####################################

let datos = {

    search: { // para la carga del formulario de búsqueda
        list_id: [],
        list_name: [],
    },

    result_search: { // para la carga de la tabla cuando viene del formulario de busqueda.
        list_id: '',
        prod_like_name: '',
    },

    search_massiveModif: { // para la carga del formulario de modificación masiva
        list_id: [],
        list_name: [],
        department_id: [],
        department_name: [],
        group_id: [],
        group_name: [],
    },

    result_search_massiveModif: { // para la carga de la tabla (si selecciona modificar solo algunos precios) cuando viene del formulario de modificación masiva.
        list_id: '',
        department_id: '',
        group_id: '',
        prices: '',
        accion: '',
        tipo: '',
        valor: '',
        PLUs: ''
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

        order: {
            by: 'id',
            direct: 'ASC'
        }

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


// ############################# Show form massive Modification ########################## 

export const getFormModif = async(req, res)=>{
    
    datos.search_massiveModif.list_id = [];
    datos.search_massiveModif.list_name = [];
    datos.search_massiveModif.department_id = [];
    datos.search_massiveModif.department_name = [];
    datos.search_massiveModif.group_id = [];
    datos.search_massiveModif.group_name = [];

    try{
        req = await pool.query("SELECT pricelist_version_id AS list_id, name as list_name FROM public.pricelist_version WHERE pricelist_id != '#'");       
            if (req.rows.length > 0) {
                req.rows.map((e)=>{
                    datos.search_massiveModif.list_id.push(e.list_id);
                    datos.search_massiveModif.list_name.push(e.list_name);
                });                
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
    
    try{
        req = await pool.query("SELECT department_id AS dep_id, name as dep_name FROM public.department");       
            if (req.rows.length > 0) {
                req.rows.map((e)=>{
                    datos.search_massiveModif.department_id.push(e.dep_id);
                    datos.search_massiveModif.department_name.push(e.dep_name);
                });                
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

    try{
        req = await pool.query("SELECT group_id AS group_id, name as group_name FROM public.main_group");       
            if (req.rows.length > 0) {
                req.rows.map((e)=>{
                    datos.search_massiveModif.group_id.push(e.group_id);
                    datos.search_massiveModif.group_name.push(e.group_name);
                });                
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

    const resultado = {
        list_ID: datos.search_massiveModif.list_id,
        list_NAME: datos.search_massiveModif.list_name,
        dep_ID: datos.search_massiveModif.department_id,
        dep_NAME: datos.search_massiveModif.department_name,
        group_ID: datos.search_massiveModif.group_id,
        group_NAME: datos.search_massiveModif.group_name, 
    };

    res
    .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .status(200).render('Price/searchModif.ejs', {data: resultado});

};

// ############################# Salida del "form massive Modification" hacia tabla para seleccion de PLUs o ejecucion de update y redirreccion ########################## 
export const getTableModif = async(req, res)=>{

    const data = req.body;
    /*
    datos.result_search_massiveModif.list_id = '';
    datos.result_search_massiveModif.department_id = ''; //data.dep_ID;
    datos.result_search_massiveModif.group_id = ''; //data.group_ID;
    datos.result_search_massiveModif.accion = ''; //data.accion;
    datos.result_search_massiveModif.tipo = ''; //data.tipo;
    datos.result_search_massiveModif.valor = '';
    datos.result_search_massiveModif.prices = ''; //data.prices;    
    datos.result_search_massiveModif.PLUs = '';
    */
    let productArray = [];

    datos.result_search_massiveModif.list_id = data.list_ID;
    datos.result_search_massiveModif.department_id = data.dep_ID;
    datos.result_search_massiveModif.group_id = data.group_ID;
    datos.result_search_massiveModif.valor = data.valor;
    try{
        req = await pool.query("SELECT p.product_id AS id, p.name as name, pp.pricelist as price FROM public.product p JOIN public.productprice pp ON p.product_id = pp.product_id WHERE p.product_id != 0 AND department_id = "+datos.result_search_massiveModif.department_id+" AND group_id = "+datos.result_search_massiveModif.group_id+" AND pp.pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"'");   
        productArray = req.rows;          
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query al traer array de productos');
    }

    console.log('Array de productos: '+JSON.stringify(productArray));
    

    if (data.prices == 'all'){ // ##########  Modifica todos los PLUs  ################
        datos.result_search_massiveModif.department_id = data.dep_ID;
        datos.result_search_massiveModif.group_id = data.group_ID;
        datos.result_search_massiveModif.accion = data.accion;
        datos.result_search_massiveModif.tipo = data.tipo;
        let variacion = 0;
        let new_price = 0;
        let queryString = '';
        //productArray.map(e => {
        for (let e = 0; e < productArray.length; e++) {           
            
            if (data.tipo == 'porcen'){ //############### ( * )
                datos.result_search_massiveModif.tipo = 'porcen';        
                if (data.accion == 'aumento'){
                    datos.result_search_massiveModif.accion = 'aumento';
                    variacion =  1 + (data.valor / 100);
                    new_price = productArray[e].price * variacion;
                } else if (data.accion == 'descuento'){
                    datos.result_search_massiveModif.accion = 'descuento';
                    variacion =  1 - (data.valor / 100);
                    new_price = productArray[e].price * variacion;
                }
            } else if (data.tipo == 'monto') { //#########( + )
                datos.result_search_massiveModif.tipo = 'monto';
                if (data.accion == 'aumento'){            
                    variacion = data.valor;
                    new_price = productArray[e].price + variacion;
                } else if (data.accion == 'descuento'){
                    variacion = data.valor;
                    new_price = productArray[e].price - variacion; 
                } 
            }

            //console.log('new_price: '+new_price);
            queryString = "UPDATE public.productprice SET pricelist = "+new_price+" WHERE product_id = "+productArray[e].id+" AND pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"'";
            try{
                req = await pool.query(queryString);
            } catch {
                console.log('error!');
                //res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
                //console.log('');
                //console.log('Falló ejecución de query');
            }
        };
        const resultado = {
            list_ID: datos.search_massiveModif.list_id,
            list_NAME: datos.search_massiveModif.list_name,
            dep_ID: datos.search_massiveModif.department_id,
            dep_NAME: datos.search_massiveModif.department_name,
            group_ID: datos.search_massiveModif.group_id,
            group_NAME: datos.search_massiveModif.group_name,
            //redirect: true 
        };
    
        res
        .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .status(200).render('Price/searchModif.ejs', {data: resultado});
        console.log('Updated Success!!');
        console.log('Redireccionando al formulario de modificacion masiva...');
    }
};


//########################################## Show Table ####################################

export const getTablePriceList = async(req, res)=>{

    const data = req.body;

    //################## Desde donde llaman a  getTablePriceList ?

    if (data.priceList_id) { // llaman a getTablePriceList desde el form de búsqueda.
       console.log('Cargando tabla...'); 
       datos.result_search.list_id = data.priceList_id;
       datos.table.pagination.pagActual = 1;
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
        try{
            req = await pool.query("UPDATE productprice SET pricelist = "+price+", updated = NOW() WHERE product_id = '"+id+"' AND pricelist_version_id = '"+datos.result_search.list_id+"'");                 
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

    if (data.order){ // llaman a getTablePriceList desde ordenamiento.
        console.log('Ordenando tabla...');

        let orderBy = '';
        let orderDirect = datos.table.order.direct;

        switch(data.order) {
          case 'PLU':
            orderBy = 'id'
            if (orderBy == datos.table.order.by){
                // no cambia  datos.table.order.by
                if(orderDirect == 'ASC'){
                    datos.table.order.direct = 'DESC';
                } else {
                    datos.table.order.direct = 'ASC';
                }
            } else {
                datos.table.order.by = orderBy;
                datos.table.order.direct = 'ASC';
            }
            break;
          case 'NOMBRE':
            orderBy = 'name'
            if (orderBy == datos.table.order.by){
                // no cambia  datos.table.order.by
                if(orderDirect == 'ASC'){
                    datos.table.order.direct = 'DESC';
                } else {
                    datos.table.order.direct = 'ASC';
                }
            } else {
                datos.table.order.by = orderBy;
                datos.table.order.direct = 'ASC';
            }
            break;
          case 'PRECIO':
            orderBy = 'price'
            if (orderBy == datos.table.order.by){
                // no cambia  datos.table.order.by
                if(orderDirect == 'ASC'){
                    datos.table.order.direct = 'DESC';
                } else {
                    datos.table.order.direct = 'ASC';
                }
            } else {
                datos.table.order.by = orderBy;
                datos.table.order.direct = 'ASC';
            }
            break;            
        }
    }

    try{
        if (datos.result_search.prod_like_name != ''){
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price,  pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+datos.result_search.list_id+"' AND p.name ILIKE '"+datos.result_search.prod_like_name+"%' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);       
        } else if (datos.result_search.prod_like_name == '') {
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price, pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE pp.pricelist_version_id = '"+datos.result_search.list_id+"' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);       
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

            if (datos.table.pagination.view_ALL === true){ //######## Aun no está en uso.
                //datos.table.product_price.prod_id = prod_ID;
                //datos.table.product_price.prod_name = prod_NAME;
                //datos.table.product_price.prod_price = prod_PRICE;
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
        console.log(e);
    }   
};



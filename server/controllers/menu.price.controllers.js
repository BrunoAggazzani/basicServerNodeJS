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
            updated: [], // Atributo que se envia a la vista
            prod_id: [],
            prod_name: [],
            prod_price: [],

            IDs_price_changed: [] // lista de productos actualizados 
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

//################################################################### Show Search Form ###############################################################################

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


// ########################################################## Show form massive Modification ####################################################################### 

export const getFormModif = async(req, res)=>{

    datos.table.product_price.IDs_price_changed = []; // Reseteo la lista de IDs actualizados para la tabla de modificacion masiva.
    
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
    
    let id = data.id;
    let price = data.newPrice;
    let productArray = [];

    if (data.list_ID){ // Cuando viene la primera vez desde el formulario de modificacion masiva
        datos.result_search_massiveModif.list_id = data.list_ID;
        datos.result_search_massiveModif.department_id = data.dep_ID;
        datos.result_search_massiveModif.group_id = data.group_ID;
        datos.result_search_massiveModif.accion = data.accion;
        datos.result_search_massiveModif.tipo = data.tipo;
        datos.result_search_massiveModif.valor = data.valor;
        datos.result_search_massiveModif.prices = data.prices;

        datos.table.pagination.pagActual = 1;
    }
    
    if (data.newPrice) { // llaman a getTableModif desde actualización de precio.
        console.log('Actualizando precio para tabla de modificacion masiva');
        datos.table.product_price.IDs_price_changed.push(id);
        try{
            req = await pool.query("UPDATE productprice SET pricelist = "+price+", updated = NOW() WHERE product_id = '"+id+"' AND pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"'");                 
        } catch (e){
            console.log('');
            res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
            console.log('');
            console.log('Falló ejecución de query');
        }
    }

    console.log('list_id: '+datos.result_search_massiveModif.list_id);
    console.log('department_id: '+datos.result_search_massiveModif.department_id);
    console.log('group_id: '+datos.result_search_massiveModif.group_id);

    if (data.order){ ///////////// llaman a getTableModif desde ordenamiento.
        console.log('Ordenando tabla...');
        let orderBy = datos.table.order.by;
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
          case 'NUEVO PRECIO':
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

    try{ ////////////////////////////////////////  Trae el array de productos segun lo especificado en el formulario ////////////////
        if (datos.result_search_massiveModif.department_id > 0 && datos.result_search_massiveModif.group_id > 0){
            console.log('Cargando el array de productos con department y group');
            req = await pool.query("SELECT p.product_id AS id, p.name as name, pp.pricelist as price FROM public.product p JOIN public.productprice pp ON p.product_id = pp.product_id WHERE p.product_id != 0 AND department_id = "+datos.result_search_massiveModif.department_id+" AND group_id = "+datos.result_search_massiveModif.group_id+" AND pp.pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);   
            productArray = req.rows;
        } else if (datos.result_search_massiveModif.department_id > 0 && datos.result_search_massiveModif.group_id == 0){
            console.log('Cargando el array de productos con department solo');
            req = await pool.query("SELECT p.product_id AS id, p.name as name, pp.pricelist as price FROM public.product p JOIN public.productprice pp ON p.product_id = pp.product_id WHERE p.product_id != 0 AND department_id = "+datos.result_search_massiveModif.department_id+" AND pp.pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);   
            productArray = req.rows;
        } else if (datos.result_search_massiveModif.department_id == 0 && datos.result_search_massiveModif.group_id > 0){
            console.log('Cargando el array de productos con group solo');
            req = await pool.query("SELECT p.product_id AS id, p.name as name, pp.pricelist as price FROM public.product p JOIN public.productprice pp ON p.product_id = pp.product_id WHERE p.product_id != 0 AND group_id = "+datos.result_search_massiveModif.group_id+" AND pp.pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);   
            productArray = req.rows;
        } else if (datos.result_search_massiveModif.department_id == 0 && datos.result_search_massiveModif.group_id == 0){
            console.log('Cargando el array de productos sin department y sin group');
            req = await pool.query("SELECT p.product_id AS id, p.name as name, pp.pricelist as price FROM public.product p JOIN public.productprice pp ON p.product_id = pp.product_id WHERE p.product_id != 0 AND pp.pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);   
            productArray = req.rows;
        } else {
            console.log('No se cargó el array de productos');
        }                  
    } catch (e){
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query al traer array de productos');
    }

    console.log('Array de productos: '+JSON.stringify(productArray));
    
    let variacion = 0;
    let new_price = 0;
    let queryString = '';
    
    if (datos.result_search_massiveModif.prices == 'all'){ ///////////////////////// ##########  Modifica todos los PLUs  ################
        console.log('Actualizando precio en all...');

        for (let e = 0; e < productArray.length; e++) {           
            if (datos.result_search_massiveModif.tipo == 'porcen'){ //############### ( * )        
                if (datos.result_search_massiveModif.accion == 'aumento'){
                    variacion =  1 + (data.valor / 100);
                    new_price = (parseFloat(productArray[e].price) * parseFloat(variacion)).toFixed(2);
                } else if (datos.result_search_massiveModif.accion == 'descuento'){
                    variacion =  1 - (data.valor / 100);
                    new_price = (parseFloat(productArray[e].price) * parseFloat(variacion)).toFixed(2);
                }
            } else if (datos.result_search_massiveModif.tipo == 'monto') { //#########( + )
                if (datos.result_search_massiveModif.accion == 'aumento'){            
                    variacion = data.valor;
                    new_price = (parseFloat(productArray[e].price) + parseFloat(variacion)).toFixed(2);
                } else if (datos.result_search_massiveModif.accion == 'descuento'){
                    variacion = data.valor;
                    new_price = (parseFloat(productArray[e].price) - parseFloat(variacion)).toFixed(2); 
                } 
            }

            //console.log('new_price: '+new_price);
            queryString = "UPDATE public.productprice SET pricelist = "+new_price+" WHERE product_id = "+productArray[e].id+" AND pricelist_version_id = '"+datos.result_search_massiveModif.list_id+"'";
            try{
                req = await pool.query(queryString);
            } catch {
                console.log('error!');
                res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
                console.log('');
                console.log('Falló ejecución de query');
            }
        };
    
        const success = {href: "/api/menu/prices/searchMassiveModif", mje: "Excelente..!"};
        res
        .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .status(200).render('Success/success.ejs', {dataSuccess: success});

    } else if (datos.result_search_massiveModif.prices == 'choose'){ ////////////////////// ##########  Modifica algunos PLUs  ################
        console.log('Entrando en choose...');
                

        if (data.inputPage){ ///////// llaman a getTableModif desde actualización de página.
            console.log('Actualizando página...');
            datos.table.pagination.pagActual = data.inputPage;
        }                   

        if (productArray.length > 0) {

            // ################ Pagination ###########################
            datos.table.pagination.totalRegist = productArray.length;
            datos.table.pagination.totalPaginas = Math.trunc(datos.table.pagination.totalRegist / datos.table.pagination.mostrar) + 1;
            datos.table.pagination.forMinimo = (datos.table.pagination.pagActual - 1 ) * datos.table.pagination.mostrar;
            datos.table.pagination.forMaximo = datos.table.pagination.pagActual * datos.table.pagination.mostrar;
            if (datos.table.pagination.forMaximo > datos.table.pagination.totalRegist){
                let forMax = (datos.table.pagination.totalRegist - datos.table.pagination.forMinimo) + datos.table.pagination.forMinimo;
                datos.table.pagination.forMaximo = forMax;
            }


            datos.table.product_price.updated = [];
            datos.table.product_price.prod_id = [];
            datos.table.product_price.prod_name = [];
            datos.table.product_price.prod_price = [];

            

            for (let e = datos.table.pagination.forMinimo; e < datos.table.pagination.forMaximo; e++) {

                if (datos.result_search_massiveModif.tipo == 'porcen'){ //############### ( * )        
                    if (datos.result_search_massiveModif.accion == 'aumento'){
                        variacion =  1 + (datos.result_search_massiveModif.valor / 100);
                        new_price = (parseFloat(productArray[e].price) * parseFloat(variacion)).toFixed(2);
                    } else if (datos.result_search_massiveModif.accion == 'descuento'){
                        variacion =  1 - (datos.result_search_massiveModif.valor / 100);
                        new_price = (parseFloat(productArray[e].price) * parseFloat(variacion)).toFixed(2);
                    }
                } else if (datos.result_search_massiveModif.tipo == 'monto') { //#########( + )
                    if (datos.result_search_massiveModif.accion == 'aumento'){            
                        variacion = datos.result_search_massiveModif.valor;
                        new_price = (parseFloat(productArray[e].price) + parseFloat(variacion)).toFixed(2);
                    } else if (datos.result_search_massiveModif.accion == 'descuento'){
                        variacion = datos.result_search_massiveModif.valor;
                        new_price = (parseFloat(productArray[e].price) - parseFloat(variacion)).toFixed(2); 
                    } 
                }
                let updated = false;                
                let coincide = false;
                if (datos.table.product_price.IDs_price_changed.length == 0){             // Si la lista de actualizados esta vacia
                    datos.table.product_price.updated.push(updated);
                    datos.table.product_price.prod_id.push(productArray[e].id);
                    datos.table.product_price.prod_name.push(productArray[e].name);
                    datos.table.product_price.prod_price.push(new_price);                                                                                    
                } else {                                                                  // Si tiene IDs...
                    for (let i = 0; i < datos.table.product_price.IDs_price_changed.length; i++) {// Recorre el array
                        //console.log(Object.values(datos.table.product_price.IDs_price_changed[i]));
                        if (productArray[e].id == datos.table.product_price.IDs_price_changed[i]) { // Si ID de producto coincide con ID actualizado
                            console.log('Actualizado: '+datos.table.product_price.IDs_price_changed[i]+' coincide con producto: '+productArray[e].id);
                            updated = true;
                            datos.table.product_price.updated.push(updated);
                            datos.table.product_price.prod_id.push(productArray[e].id);
                            datos.table.product_price.prod_name.push(productArray[e].name);
                            datos.table.product_price.prod_price.push(new_price);
                            coincide = true;
                            break;
                        }
                    }
                    if (coincide == false) {
                        datos.table.product_price.updated.push(updated);
                        datos.table.product_price.prod_id.push(productArray[e].id);
                        datos.table.product_price.prod_name.push(productArray[e].name);
                        datos.table.product_price.prod_price.push(new_price); 
                    }
                }
            
            }
            console.log('Actualizados: '+Object.values(datos.table.product_price.IDs_price_changed));
            // ############ Result Object #######################             
            const resultado = {
                product: {
                    updtd: datos.table.product_price.updated,
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
            console.log('Resultado en choose: '+Object.values(resultado.product.updtd));
            res
            .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .status(200).render('Price/tableModif.ejs', {data: resultado});
        } else {
            console.log('');
            res.status(404).send('<h2 style="position: relative; top: 45%; padding: 5%; text-align: center">La búsqueda no arrojó resultados.</h2>');
            console.log('');
        }
    }
};


//######################################################################### Show Table #############################################################################

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
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price,  pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE p.product_id != 0 AND pp.pricelist_version_id = '"+datos.result_search.list_id+"' AND p.name ILIKE '"+datos.result_search.prod_like_name+"%' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);       
        } else if (datos.result_search.prod_like_name == '') {
            req = await pool.query("SELECT pp.product_id as id, p.name as name, round(pp.pricelist, 2) as price, pp.pricelist_version_id as listprice FROM public.productprice pp JOIN public.product p ON pp.product_id = p.product_id WHERE p.product_id != 0 AND pp.pricelist_version_id = '"+datos.result_search.list_id+"' ORDER BY "+datos.table.order.by+" "+datos.table.order.direct);       
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
            res.status(404).send('<h2 style="position: relative; top: 45%; padding: 5%; text-align: center">La búsqueda no arrojó resultados.</h2>');
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



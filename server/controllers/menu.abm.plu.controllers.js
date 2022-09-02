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
                    //console.log(PLU.name);
                });
                //console.log('PLUlist: '+JSON.stringify(PLUlist));

                const result = JSON.stringify(PLUlist);
                    
                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('ABM/Plu/plu_form_1.ejs', {data: result});
                
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


};

let logedUser = '';

export const showTable = async (req, res) => {
    console.log('Entro en formEdit!');
    const dato = req.body;
    console.log('datos: '+JSON.stringify(dato));

    logedUser = dato.logedUser;

    console.log(dato.valor);
    let result = [];    
    try{
        if (dato.tipo == 'id' && dato.valor > 0) {
            console.log('Entró en query de id');
            result = await pool.query("SELECT product_id AS id, name AS name FROM public.product WHERE product_id = '"+dato.valor+"'");       
            
        }
        if (dato.tipo === 'name' && dato.valor != ''){
            console.log('Entró en query de name');
            result = await pool.query("SELECT product_id AS id, name AS name FROM public.product WHERE name ILIKE '"+dato.valor+"%'");       
            
        }

        if (result.rows.length > 0) {            
            console.log('result: '+JSON.stringify(result.rows[0]));
            
            let resultado = [];
            result.rows.map(e => {
                resultado.push({
                    id: e.id,
                    name: e.name
                });
            })
            //console.log('Resultado: '+JSON.stringify(resultado));
                
            res
            .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .status(200).render('ABM/Plu/plu_table_1.ejs', {data: resultado});
            
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
    
}

let productID = 0;
let arrDepto = [];
let arrGroup = [];
let arrPubli = [];
let arrIva = [];
let FS = 0;



export const showFormEditGral = async (req, res) => { // Muestra el formulario de edición gral (con datos del plu seleccionado) ######
    console.log('Entro en showFormEditGral!');
    const dato = req.body;
    if (dato.id) {
        console.log('datos: '+JSON.stringify(dato));
        productID = dato.id;
        
        reloadFormProduct(req, res);
    }    
}

export const showProductImages = async (req, res) => {  // trae todas las imagenes de producto y las muestra en una tabla ######
    
    try {
        console.log("Trayendo imagenes, para tabla de seleccion de imagenes de producto");
        let result = await pool.query("SELECT image_id AS id, name AS image, encode(binarydata, 'base64') AS binarydata FROM public.image WHERE isproducticon = 'Y'");
        
        if (result.rows.length > 0) {
            //console.log('result: '+JSON.stringify(result.rows[0]));            
            
            let resultado = [];
            result.rows.map((e) => {
              resultado.push({
                id: e.id,
                image: e.image,
                binarydata: e.binarydata,
              });
            });
            //console.log('Resultado: '+JSON.stringify(resultado[0]));
            
            res
              .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
              .status(200)
              .render("ABM/Plu/plu_table_icon.ejs", { data: resultado});
            
            } else {
            console.log("");
            res.status(404).send({ message: "No hay registros!" });
            console.log("");
        }
    } catch (e) {
        console.log("");
        res.status(500).send("<h1>Pifiada del servidor!!</h1>");
        console.log(e);
        console.log("Falló ejecución de query");
    }
    
}

export const updateProductImages = async (req, res) => {  // Actualiza imagen de producto y vuelve a cargar el formulario gral de product ####

    const dato = req.body;
    
    if (dato.idImage) {
        try{
            console.log('Actualizando imagen de producto...');
            req = await pool.query("UPDATE product SET icon_id = '"+dato.idImage+"', updated = NOW() WHERE product_id = '"+productID+"'");                             
        } catch (e){
            console.log('');
            res.send('<h1>Pifiada del servidor!!</h1>');        
            console.log('');
            console.log('Falló ejecución de query');
            console.log(e);
        }
    }
    
    reloadFormProduct(req, res);
    
}

export const showTablePricelist = async (req, res) => {

    let result;
    try {
        result = await pool.query("SELECT pv.pricelist_version_id AS pricelist, pv.name AS nombre, pp.pricelist AS precio FROM public.pricelist_version pv JOIN public.productprice pp ON pv.pricelist_version_id = pp.pricelist_version_id WHERE product_id = '"+productID+"' ORDER BY precio DESC");
        //console.log(JSON.stringify(result.rows));
        res
        .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .status(200).render('ABM/Plu/plu_table_pricelist.ejs', {data: result.rows});        
    } catch (e){
        console.log('');
        res.send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        console.log(e);
    }    
}

export const updatePricelist = async (req, res) => {

    let data = req.body;
    
    try {
        console.log('Actualizando pricelist de producto...');
        await pool.query("UPDATE productprice SET pricelist = '"+data.price+"', updated = NOW() WHERE product_id = '"+productID+"' AND pricelist_version_id = '"+data.idlist+"'");                
    } catch (e){
        console.log('');
        res.send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        console.log(e);
    }
    
    showTablePricelist(req, res);
}

export const showTableDiscount = async (req, res) => {
    console.log('Mostrando tabla de descuentos...');
    let result;
    try {
        result = await pool.query("SELECT discount_schema_line_id AS id, limit_fixed AS hasta, rate AS precio FROM public.discount_schema_line WHERE discount_schema_id = '"+productID+"' ORDER BY hasta ASC");
        //console.log(JSON.stringify(result.rows));
        res
        .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .status(200).render('ABM/Plu/plu_table_discount.ejs', {data: result.rows});
        //console.log('Descuento prueba: '+JSON.stringify(result.rows));        
    } catch (e){
        console.log('');
        res.send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        console.log(e);
    }    
}

export const updateDiscount = async (req, res) => {
    console.log('Entró en updateDiscount!');
    let data = req.body;
    console.log('updateDiscount DATA: '+JSON.stringify(data));

    let hasta = parseFloat(data.hasta);
    let precio = parseFloat(data.precio);
    
    try {
        console.log('Actualizando descuentos de producto...');
        await pool.query("UPDATE discount_schema_line SET limit_fixed = '"+hasta+"', rate = '"+precio+"', updated = NOW(), updatedby = '"+logedUser+"' WHERE discount_schema_line_id = '"+data.discountid+"'");                
    } catch (e){
        console.log('');
        res.send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        console.log(e);
    }
    
    showTableDiscount(req, res);
}

export const createDiscount = async (req, res) => {
    console.log('Entró en createDiscount!');
    let data = req.body;
    console.log('createDiscount DATA: '+JSON.stringify(data));
    /*
    try {
        console.log('Creando nuevo descuento de producto...');
        //await pool.query("CREATE productprice SET pricelist = '"+data.price+"', updated = NOW() WHERE product_id = '"+productID+"' AND pricelist_version_id = '"+data.idlist+"'");                
    } catch (e){
        console.log('');
        res.send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        console.log(e);
    }
    */
    showTableDiscount(req, res);
}

export const deleteDiscount = async (req, res) => {
    console.log('Entró en deleteDiscount!');
    let data = req.body;
    console.log('deleteDiscount DATA: '+JSON.stringify(data));
    /*
    try {
        console.log('Eliminando descuento de producto...');
        //await pool.query("DELETE productprice SET pricelist = '"+data.price+"', updated = NOW() WHERE product_id = '"+productID+"' AND pricelist_version_id = '"+data.idlist+"'");                
    } catch (e){
        console.log('');
        res.send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        console.log(e);
    }
    */
    showTableDiscount(req, res);
}

const reloadFormProduct = async (req, res) => {     //  Método gral para leer los datos del formulario y renderizarlos en la vista ###

    if (productID != 0) {
        let plu = {
            binarydata: '',
            id: '',
            erp: '',
            isactive: '',
            name: '',
            descript: '',
            type: '',
            depto: '',
            arrdepto: [],
            group: '',
            arrgroup: [],
            publi: '',
            arrpubli: [],
            iva: '',
            arriva: [],
            lote: '',
            tara: '',
            fs: FS,
            waterperc: ''
        };

        getDepartment(req, res);
        getGroup(req, res);
        getPubli(req, res);
        getIva(req, res);
        getFS(req, res);

        
        try{ 
            console.log('Trayendo datos para formulario de edicion de PLU con id: '+productID);
            let result = await pool.query("SELECT encode(im.binarydata, 'base64') AS binarydata, p.product_id AS id, p.erp_code AS erp, p.isactive AS isactive, p.name AS name, p.description AS descript, p.attribute AS type, p.department_id AS depto_id, d.name AS depto_name, p.group_id AS group_id, g.name AS group_name, p.advertising_id AS publi_id, a.name AS publi_name, p.tax_id AS iva_id, i.name AS iva_name, p.lot AS lote, p.tare AS tara, p.perc_tare AS waterperc FROM public.product p LEFT JOIN public.image im ON p.icon_id = im.image_id LEFT JOIN public.department d ON p.department_id = d.department_id LEFT JOIN public.main_group g ON p.group_id = g.group_id LEFT JOIN public.advertising a ON p.advertising_id = a.advertising_id LEFT JOIN public.tax i ON p.tax_id = i.tax_id WHERE product_id = '" +productID+"'");       
            // TRAER LOS DATOS DE PLU QUE NO TIENEN IMÁGENES ASIGNADAS COMO ICONOS. (rta: con LEFT JOIN)
            if (result.rows.length > 0) {            
                //console.log('result: '+JSON.stringify(result.rows[0]));

                plu = {
                    binarydata: result.rows[0].binarydata,
                    id: result.rows[0].id,
                    erp: result.rows[0].erp,
                    isactive: result.rows[0].isactive, 
                    name: result.rows[0].name,
                    descript: result.rows[0].descript,
                    type: result.rows[0].type,
                    depto: {id: result.rows[0].depto_id, name: result.rows[0].depto_name},
                    arrdepto: arrDepto, 
                    group: {id: result.rows[0].group_id, name: result.rows[0].group_name},
                    arrgroup: arrGroup,
                    publi: {id: result.rows[0].publi_id, name: result.rows[0].publi_name},
                    arrpubli: arrPubli,
                    iva: {id: result.rows[0].iva_id, name: result.rows[0].iva_name},
                    arriva: arrIva,
                    lote: result.rows[0].lote,
                    tara: result.rows[0].tara,
                    fs: FS,
                    waterperc: result.rows[0].waterperc,
                };

                //console.log('Resultado plu: '+JSON.stringify(plu));

                res
                .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('ABM/Plu/plu_form_princ.ejs', {data: plu});

            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }      
        } catch (e){            
            console.log('Falló ejecución de query');
            console.log('');        
            console.log('ERROR!: '+e);
        }
    
    } else {
        console.log('cargar form vacio para opción de "nuevo"');
    }    

}

const getDepartment = async (req, res) => {
    try{
            let result = await pool.query("SELECT department_id AS depto_id, name AS depto_name FROM public.department");
            //console.log('arrDepto: '+JSON.stringify(result.rows));
            arrDepto = result.rows;                             
        } catch (e){
            console.log('');
            console.log('Falló ejecución de query');
            console.log(e);
        }
}

const getGroup = async (req, res) => {
    try{
            let result = await pool.query("SELECT group_id AS group_id, name AS group_name FROM public.main_group");
            //console.log('arrGroup: '+JSON.stringify(result.rows));
            arrGroup = result.rows;                             
        } catch (e){
            console.log('');
            console.log('Falló ejecución de query');
            console.log(e);
        }
}

const getPubli = async (req, res) => {
    try{
            let result = await pool.query("SELECT advertising_id AS publi_id, name AS publi_name FROM public.advertising WHERE isproductmsgonly = 'Y'");
            //console.log('arrPubli: '+JSON.stringify(result.rows));
            arrPubli = result.rows;                             
        } catch (e){
            console.log('');
            console.log('Falló ejecución de query');
            console.log(e);
        }
}

const getIva = async (req, res) => {
    try{
            let result = await pool.query("SELECT tax_id AS iva_id, name AS iva_name FROM public.tax");
            //console.log('arrIva: '+JSON.stringify(result.rows));
            arrIva = result.rows;                             
        } catch (e){
            console.log('');
            console.log('Falló ejecución de query');
            console.log(e);
        }
}

const getFS = async (req, res) => {
    try{
            let result = await pool.query("SELECT MAX(fs) AS FS FROM systel.calibration");
            //console.log('result: '+JSON.stringify(result.rows[0]));
            FS = parseInt(Object.values(result.rows[0]));
            //console.log('FS: '+FS);                             
        } catch (e){
            console.log('');
            console.log('Falló ejecución de query');
            console.log(e);
        }
}
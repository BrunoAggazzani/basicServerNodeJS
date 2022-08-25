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


};

export const showTable = async (req, res) => {
    console.log('Entro en formEdit!');
    const dato = req.body;
    console.log('datos: '+JSON.stringify(dato));
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
            .status(200).render('ABM/Plu/plu1_1.ejs', {data: resultado});
            
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
export const showFormEditGral = async (req, res) => {
    console.log('Entro en showFormEditGral!');
    const dato = req.body;
    console.log('datos: '+JSON.stringify(dato));
    //console.log();
    productID = dato.id;
    let result = [];
        
    try{
        console.log('Primera vez: Trayendo datos, para formulario de edicion, de PLU con id: '+productID);
        result = await pool.query("SELECT p.product_id AS id, p.name AS name, im.name AS image, encode(im.binarydata, 'base64') AS binarydata FROM public.product p LEFT JOIN public.image im ON p.icon_id = im.image_id WHERE product_id = '" +productID+"'");       
        // VER COMO TRAER LOS DATOS DE PLU QUE NO TIENEN IMÁGENES ASIGNADAS COMO ICONOS.
        if (result.rows.length > 0) {            
            //console.log('result: '+JSON.stringify(result.rows[0]));
            
            let resultado = [];
            result.rows.map(e => {
                resultado.push({
                  id: e.id,
                  name: e.name,
                  image: e.image,
                  binarydata: e.binarydata,
                });
            })
            //console.log('tipo: '+typeof resultado[0].binarydata);
            //console.log('Resultado: '+resultado[0].binarydata);
                
            res
            .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .status(200).render('ABM/Plu/plu2_0.ejs', {data: resultado});
            
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

export const showProductImages = async (req, res) => {  // trae todas las imagenes de producto y las muestra en una tabla.
    
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
              .render("ABM/Plu/plu3_0.ejs", { data: resultado});
            
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

export const updateProductImages = async (req, res) => {  // Actualiza imagen de producto y vuelve a cargar el formulario gral de product.

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
    
    try{ /////////////////////////////// Hacer un metodo para todo este try (que reciba com parametros req y res) para no repetir tanto código al pedo. ###########################################
        console.log('Segunda vez:Trayendo datos, para formulario de edicion, de PLU con id: '+productID);
        let result = await pool.query("SELECT p.product_id AS id, p.name AS name, im.name AS image, encode(im.binarydata, 'base64') AS binarydata FROM public.product p LEFT JOIN public.image im ON p.icon_id = im.image_id WHERE product_id = '" +productID+"'");       
        // VER COMO TRAER LOS DATOS DE PLU QUE NO TIENEN IMÁGENES ASIGNADAS COMO ICONOS. (rta: con LEFT JOIN)
        if (result.rows.length > 0) {            
            //console.log('result: '+JSON.stringify(result.rows[0]));
            
            let resultado = [];
            result.rows.map(e => {
                resultado.push({
                  id: e.id,
                  name: e.name,
                  image: e.image,
                  binarydata: e.binarydata,
                });
            })
            //console.log('tipo: '+typeof resultado[0].binarydata);
            //console.log('Resultado: '+resultado[0].binarydata);
                
            res
            .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .status(200).render('ABM/Plu/plu2_0.ejs', {data: resultado});
            
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
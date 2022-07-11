import {pool} from '../DB/connect';
import CryptoJS from 'crypto-js';
export const getAbm = async(req, res)=>{
    console.log('Entrando en getAbm...');
    const data = req.body;
    const user = data.user;
    const pass = CryptoJS.MD5(data.pass);
    console.log(user);
    console.log(pass.toString());

    try{
        req = await pool.query("SELECT password FROM public.tb_user WHERE username = '"+user+"'");
        console.log('Result: ');       
            if (req.rows) {
                console.log('');
                console.log('Trayendo password de usuario...');
                console.log('');
                console.log('Resultado de PASS: '+req.rows[0].password);
                if (req.rows[0].password === pass.toString()){
                    res.status(200).render('Abm/menu.ejs');
                } else {
                    const error = {href: "/", mje: "Contraseña incorrecta!"};
                    res.status(200).render('Error/error.ejs', {dataError: error});
                }       
            } else {
                console.log('');
                res.status(404).send({message: 'No hay registros!'});
                console.log('');
            }
            //pool.end();      
    } catch (e){
        console.log(e);
        console.log('');
        res.status(500).send('<h1>Pifiada del servidor!!</h1>');        
        console.log('');
        console.log('Falló ejecución de query');
        //pool.end();        
    }   
}
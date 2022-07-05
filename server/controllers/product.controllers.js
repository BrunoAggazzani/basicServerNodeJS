import pool from '../DB/connect';
export const getAbm = (req, res)=>{
    const data = req.body;
    const user = data.user;
    const pass = data.pass;
    if (pass == '1234'){
        res.json('Puto el que lee!');
    }    
}
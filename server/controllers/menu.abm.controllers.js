//import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

export const getAbm = (req, res)=>{
    res.status(200).render('ABM/abm.ejs');
};
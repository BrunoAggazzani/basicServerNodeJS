//import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

export const getAbm = (req, res)=>{
    res
    .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .status(200).render('ABM/abm.ejs');
};
//import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

export const getAbmPlu = (req, res)=>{
    res
    .set("Content-Security-Policy", "script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .status(200).render('ABM/Plu/plu1_0.ejs');
};
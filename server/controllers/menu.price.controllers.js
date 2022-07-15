//import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

export const getPrice = (req, res)=>{
    res.status(200).render('Price/price.ejs');
};
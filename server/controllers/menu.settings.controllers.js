//import {pool} from '../DB/connect';
//import CryptoJS from 'crypto-js';

export const getSettings = (req, res)=>{
    res.status(200).render('Settings/settings.ejs');
};